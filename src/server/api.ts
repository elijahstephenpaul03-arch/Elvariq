import express, { Router, Response } from 'express';
import { db } from '../db/index.ts';
import { staff, enquiries, tasks, TaskNoteItem } from '../db/schema.ts';
import { eq, desc, ilike, and, sql } from 'drizzle-orm';
import { authenticateToken, requireRole, AuthenticatedRequest } from '../middleware/auth.ts';
import { seedDatabase } from './seed.ts';

export const apiRouter = Router();

apiRouter.use(express.json());
apiRouter.use(authenticateToken);

// ==========================================
// 1. HEALTH & CONNECTIVITY
// ==========================================
apiRouter.get('/health', async (_req, res: Response) => {
  try {
    const result = await db.execute(sql`SELECT NOW() as current_time`);
    res.json({
      status: 'healthy',
      database: 'connected (PostgreSQL Cloud SQL asia-southeast1)',
      serverTime: result.rows[0]?.current_time,
      architecture: 'Full-Stack Express + Node.js + Drizzle ORM',
    });
  } catch (error: any) {
    console.error('Health check database query error:', error);
    res.status(500).json({
      status: 'degraded',
      database: 'disconnected',
      error: error.message,
    });
  }
});

// ==========================================
// 2. STAFF ENDPOINTS
// ==========================================
apiRouter.get('/staff', async (_req, res: Response) => {
  try {
    const allStaff = await db.select().from(staff);
    
    // Compute current workload from enquiries table
    const enquiryCounts = await db
      .select({
        staffId: enquiries.assignedStaffId,
        count: sql<number>`count(*)::int`,
      })
      .from(enquiries)
      .where(sql`${enquiries.assignedStaffId} IS NOT NULL`)
      .groupBy(enquiries.assignedStaffId);

    const countMap: Record<string, number> = {};
    for (const ec of enquiryCounts) {
      if (ec.staffId) {
        countMap[ec.staffId] = ec.count;
      }
    }

    const enrichedStaff = allStaff.map((s) => ({
      ...s,
      activeEnquiriesCount: countMap[s.id] || 0,
      utilizationRate: Math.min(
        100,
        Math.round(((countMap[s.id] || 0) / (s.maxCapacity || 15)) * 100)
      ),
    }));

    res.json(enrichedStaff);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch staff directory', details: error.message });
  }
});

apiRouter.post('/staff', requireRole(['Administrator', 'Manager']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id, name, role, department, email, phone, specialization, maxCapacity } = req.body;
    if (!name || !role || !email) {
      return res.status(400).json({ error: 'Name, role, and email are required fields.' });
    }

    const staffId = id || `STF-${Math.floor(100 + Math.random() * 900)}`;
    const [inserted] = await db
      .insert(staff)
      .values({
        id: staffId,
        name,
        role,
        department: department || 'General Admissions',
        email,
        phone: phone || '',
        specialization: specialization || 'General Counselling',
        maxCapacity: Number(maxCapacity) || 15,
      })
      .onConflictDoUpdate({
        target: staff.id,
        set: {
          name,
          role,
          department,
          email,
          phone,
          specialization,
          maxCapacity: Number(maxCapacity) || 15,
        },
      })
      .returning();

    res.status(201).json(inserted);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to create or update staff member', details: error.message });
  }
});

// ==========================================
// 3. ENQUIRIES CRUD & SEARCH
// ==========================================
apiRouter.get('/enquiries', async (req, res: Response) => {
  try {
    const { search, status, priority, course, assignedStaffId } = req.query;

    const conditions: any[] = [];

    if (status && status !== 'all') {
      conditions.push(eq(enquiries.status, String(status)));
    }
    if (priority && priority !== 'all') {
      conditions.push(eq(enquiries.priority, String(priority)));
    }
    if (course && course !== 'all') {
      conditions.push(eq(enquiries.course, String(course)));
    }
    if (assignedStaffId && assignedStaffId !== 'all') {
      conditions.push(eq(enquiries.assignedStaffId, String(assignedStaffId)));
    }
    if (search && String(search).trim() !== '') {
      const q = `%${String(search).trim()}%`;
      conditions.push(
        sql`(${enquiries.fullName} ILIKE ${q} OR ${enquiries.email} ILIKE ${q} OR ${enquiries.phone} ILIKE ${q} OR ${enquiries.location} ILIKE ${q} OR ${enquiries.id} ILIKE ${q})`
      );
    }

    const query = conditions.length > 0
      ? db.select().from(enquiries).where(and(...conditions)).orderBy(desc(enquiries.createdAt))
      : db.select().from(enquiries).orderBy(desc(enquiries.createdAt));

    const records = await query;
    res.json(records);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to query enquiries', details: error.message });
  }
});

apiRouter.post('/enquiries', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      fullName,
      phone,
      email,
      course,
      qualification,
      location,
      source,
      date,
      priority,
      status,
      remarks,
      assignedStaffId,
      followUpDate,
    } = req.body;

    // Strict Character-Only Validation on Candidate Full Name
    if (!fullName || typeof fullName !== 'string' || fullName.trim().length === 0) {
      return res.status(400).json({ error: 'Candidate Full Name is required.' });
    }

    if (/\d/.test(fullName)) {
      return res.status(400).json({
        error: 'Invalid Full Name: Please enter characters only. Numbers and digits are not permitted in candidate names.',
        field: 'fullName',
      });
    }

    // Phone validation
    const cleanPhone = (phone || '').replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      return res.status(400).json({
        error: 'Invalid Phone Number: Must contain at least 10 valid contact digits.',
        field: 'phone',
      });
    }

    // Email validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        error: 'Invalid Email Address: Please provide a valid email format.',
        field: 'email',
      });
    }

    // Generate unique ID in sequence: ELV-2026-XXX
    const [{ value: currentCount }] = await db.select({ value: sql<number>`count(*)::int` }).from(enquiries);
    const id = `ELV-2026-${String(currentCount + 1).padStart(3, '0')}`;

    const newEnquiryDate = date || new Date().toISOString().split('T')[0];

    const [created] = await db
      .insert(enquiries)
      .values({
        id,
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim().toLowerCase(),
        course: course || 'General Studies',
        qualification: qualification || 'Undergraduate',
        location: location || 'Hyderabad',
        source: source || 'Walk-in',
        date: newEnquiryDate,
        priority: priority || 'Medium',
        status: status || 'New',
        assignedStaffId: assignedStaffId || null,
        followUpDate: followUpDate || null,
        remarks: remarks || '',
        isDemoRecord: false,
      })
      .returning();

    // Auto-create task if assigned or in follow-up
    if (assignedStaffId && (status === 'Assigned' || status === 'In Follow-up')) {
      const taskId = `TSK-${Math.floor(500 + Math.random() * 499)}`;
      const scheduledDate = followUpDate || new Date(Date.now() + 86400000).toISOString().split('T')[0];
      const initialNotes: TaskNoteItem[] = [
        {
          id: `note-${Date.now()}`,
          authorName: req.user?.name || 'Admissions Coordinator',
          authorRole: req.user?.role || 'Manager',
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
          content: remarks || 'Initial enquiry recorded and assigned for counselling follow-up.',
        },
      ];

      await db.insert(tasks).values({
        id: taskId,
        enquiryId: id,
        staffId: assignedStaffId,
        scheduledDate,
        priority: priority || 'Medium',
        status: 'Pending',
        notes: initialNotes,
      }).onConflictDoNothing();
    }

    res.status(201).json(created);
  } catch (error: any) {
    console.error('Create enquiry failed:', error);
    res.status(500).json({ error: 'Failed to create enquiry', details: error.message });
  }
});

apiRouter.get('/enquiries/:id', async (req, res: Response) => {
  try {
    const { id } = req.params;
    const [enquiry] = await db.select().from(enquiries).where(eq(enquiries.id, id)).limit(1);
    if (!enquiry) {
      return res.status(404).json({ error: 'Enquiry record not found' });
    }

    // Fetch associated tasks
    const relatedTasks = await db.select().from(tasks).where(eq(tasks.enquiryId, id));

    // Fetch assigned staff details
    let assignedStaff = null;
    if (enquiry.assignedStaffId) {
      const [stf] = await db.select().from(staff).where(eq(staff.id, enquiry.assignedStaffId)).limit(1);
      assignedStaff = stf || null;
    }

    res.json({
      ...enquiry,
      assignedStaff,
      tasks: relatedTasks,
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to retrieve enquiry details', details: error.message });
  }
});

apiRouter.put('/enquiries/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Full Name characters-only validation if updating fullName
    if (updates.fullName !== undefined) {
      if (typeof updates.fullName !== 'string' || updates.fullName.trim().length === 0) {
        return res.status(400).json({ error: 'Full name cannot be empty.' });
      }
      if (/\d/.test(updates.fullName)) {
        return res.status(400).json({
          error: 'Invalid Full Name: Please enter characters only. Numbers are not permitted.',
          field: 'fullName',
        });
      }
    }

    const [updated] = await db
      .update(enquiries)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(enquiries.id, id))
      .returning();

    if (!updated) {
      return res.status(404).json({ error: 'Enquiry not found for update' });
    }

    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update enquiry', details: error.message });
  }
});

apiRouter.delete('/enquiries/:id', requireRole(['Administrator', 'Manager']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    // Cascade delete tasks
    await db.delete(tasks).where(eq(tasks.enquiryId, id));
    const [deleted] = await db.delete(enquiries).where(eq(enquiries.id, id)).returning();

    if (!deleted) {
      return res.status(404).json({ error: 'Enquiry not found to delete' });
    }

    res.json({ message: 'Enquiry and related tasks deleted successfully', deletedId: id });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to delete enquiry', details: error.message });
  }
});

apiRouter.patch('/enquiries/:id/assign', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { staffId, initialNote } = req.body;

    if (!staffId) {
      return res.status(400).json({ error: 'Target staffId is required.' });
    }

    const [stf] = await db.select().from(staff).where(eq(staff.id, staffId)).limit(1);
    if (!stf) {
      return res.status(404).json({ error: 'Target staff member does not exist.' });
    }

    const [existingEnquiry] = await db.select().from(enquiries).where(eq(enquiries.id, id)).limit(1);
    if (!existingEnquiry) {
      return res.status(404).json({ error: 'Enquiry not found.' });
    }

    const newStatus = existingEnquiry.status === 'New' ? 'Assigned' : existingEnquiry.status;
    const [updated] = await db
      .update(enquiries)
      .set({
        assignedStaffId: staffId,
        status: newStatus,
        updatedAt: new Date(),
      })
      .where(eq(enquiries.id, id))
      .returning();

    // Create or reassign task
    const taskId = `TSK-${Math.floor(500 + Math.random() * 499)}`;
    const scheduledDate = existingEnquiry.followUpDate || new Date(Date.now() + 86400000).toISOString().split('T')[0];
    const notes: TaskNoteItem[] = [
      {
        id: `note-${Date.now()}`,
        authorName: req.user?.name || 'Admissions Lead',
        authorRole: req.user?.role || 'Manager',
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
        content: initialNote || `Reassigned enquiry to ${stf.name} for candidate counselling.`,
      },
    ];

    await db.insert(tasks).values({
      id: taskId,
      enquiryId: id,
      staffId,
      scheduledDate,
      priority: existingEnquiry.priority || 'Medium',
      status: 'Pending',
      notes,
    }).onConflictDoNothing();

    res.json({ enquiry: updated, assignedStaff: stf });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to assign staff', details: error.message });
  }
});

// ==========================================
// 4. TASKS ENDPOINTS
// ==========================================
apiRouter.get('/tasks', async (req, res: Response) => {
  try {
    const { status, staffId } = req.query;
    const conditions: any[] = [];

    if (status && status !== 'all') {
      conditions.push(eq(tasks.status, String(status)));
    }
    if (staffId && staffId !== 'all') {
      conditions.push(eq(tasks.staffId, String(staffId)));
    }

    const query = conditions.length > 0
      ? db.select().from(tasks).where(and(...conditions)).orderBy(desc(tasks.scheduledDate))
      : db.select().from(tasks).orderBy(desc(tasks.scheduledDate));

    const records = await query;
    res.json(records);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch tasks', details: error.message });
  }
});

apiRouter.patch('/tasks/:id/status', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Pending', 'Completed', 'Overdue'].includes(status)) {
      return res.status(400).json({ error: 'Invalid task status value.' });
    }

    const completedAt = status === 'Completed' ? new Date().toISOString() : null;

    const [updated] = await db
      .update(tasks)
      .set({
        status,
        completedAt,
      })
      .where(eq(tasks.id, id))
      .returning();

    if (!updated) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update task status', details: error.message });
  }
});

apiRouter.post('/tasks/:id/notes', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Note content cannot be empty.' });
    }

    const [taskRecord] = await db.select().from(tasks).where(eq(tasks.id, id)).limit(1);
    if (!taskRecord) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const currentNotes: TaskNoteItem[] = (taskRecord.notes as TaskNoteItem[]) || [];
    const newNote: TaskNoteItem = {
      id: `note-${Date.now()}`,
      authorName: req.user?.name || 'Staff Member',
      authorRole: req.user?.role || 'Counsellor',
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      content: content.trim(),
    };

    const updatedNotes = [...currentNotes, newNote];

    const [updated] = await db
      .update(tasks)
      .set({ notes: updatedNotes })
      .where(eq(tasks.id, id))
      .returning();

    res.status(201).json(updated);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to add task note', details: error.message });
  }
});

apiRouter.post('/tasks/:id/reschedule', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { followUpDate, note } = req.body;

    if (!followUpDate) {
      return res.status(400).json({ error: 'New follow-up date is required.' });
    }

    const [taskRecord] = await db.select().from(tasks).where(eq(tasks.id, id)).limit(1);
    if (!taskRecord) {
      return res.status(404).json({ error: 'Task not found.' });
    }

    const currentNotes: TaskNoteItem[] = (taskRecord.notes as TaskNoteItem[]) || [];
    if (note && note.trim()) {
      currentNotes.push({
        id: `note-${Date.now()}`,
        authorName: req.user?.name || 'Staff Member',
        authorRole: req.user?.role || 'Counsellor',
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
        content: `Rescheduled follow-up to ${followUpDate}: ${note.trim()}`,
      });
    }

    const [updatedTask] = await db
      .update(tasks)
      .set({
        scheduledDate: followUpDate,
        status: 'Pending',
        notes: currentNotes,
      })
      .where(eq(tasks.id, id))
      .returning();

    // Also update parent enquiry's followUpDate
    await db
      .update(enquiries)
      .set({
        followUpDate,
        status: 'In Follow-up',
        updatedAt: new Date(),
      })
      .where(eq(enquiries.id, taskRecord.enquiryId));

    res.json(updatedTask);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to reschedule task', details: error.message });
  }
});

// ==========================================
// 5. DATABASE-DRIVEN REPORTS & METRICS
// ==========================================
apiRouter.get('/reports/summary', async (_req, res: Response) => {
  try {
    const [statusStats] = await db.execute(sql`
      SELECT
        COUNT(*)::int as total,
        COUNT(CASE WHEN status = 'New' THEN 1 END)::int as new_count,
        COUNT(CASE WHEN status = 'Assigned' THEN 1 END)::int as assigned_count,
        COUNT(CASE WHEN status = 'In Follow-up' THEN 1 END)::int as follow_up_count,
        COUNT(CASE WHEN status = 'Converted' THEN 1 END)::int as converted_count,
        COUNT(CASE WHEN status = 'Lost' THEN 1 END)::int as lost_count
      FROM enquiries
    `).then(r => r.rows);

    const [taskStats] = await db.execute(sql`
      SELECT
        COUNT(*)::int as total_tasks,
        COUNT(CASE WHEN status = 'Pending' THEN 1 END)::int as pending_count,
        COUNT(CASE WHEN status = 'Completed' THEN 1 END)::int as completed_count,
        COUNT(CASE WHEN status = 'Overdue' THEN 1 END)::int as overdue_count
      FROM tasks
    `).then(r => r.rows);

    const courseDistribution = await db.execute(sql`
      SELECT course, COUNT(*)::int as count
      FROM enquiries
      GROUP BY course
      ORDER BY count DESC
    `).then(r => r.rows);

    const sourceDistribution = await db.execute(sql`
      SELECT source, COUNT(*)::int as count
      FROM enquiries
      GROUP BY source
      ORDER BY count DESC
    `).then(r => r.rows);

    const staffPerformance = await db.execute(sql`
      SELECT
        s.id,
        s.name,
        s.role,
        s.department,
        s.max_capacity,
        COUNT(e.id)::int as total_assigned,
        COUNT(CASE WHEN e.status = 'Converted' THEN 1 END)::int as converted
      FROM staff s
      LEFT JOIN enquiries e ON s.id = e.assigned_staff_id
      GROUP BY s.id, s.name, s.role, s.department, s.max_capacity
      ORDER BY total_assigned DESC
    `).then(r => r.rows);

    const total = Number(statusStats?.total) || 0;
    const converted = Number(statusStats?.converted_count) || 0;
    const conversionRate = total > 0 ? Math.round((converted / total) * 100) : 0;

    const totalTasks = Number(taskStats?.total_tasks) || 0;
    const completedTasks = Number(taskStats?.completed_count) || 0;
    const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    res.json({
      totalEnquiries: total,
      newEnquiries: Number(statusStats?.new_count) || 0,
      assignedEnquiries: Number(statusStats?.assigned_count) || 0,
      inFollowUpEnquiries: Number(statusStats?.follow_up_count) || 0,
      convertedEnquiries: converted,
      lostEnquiries: Number(statusStats?.lost_count) || 0,
      conversionRate,
      tasks: {
        total: totalTasks,
        pending: Number(taskStats?.pending_count) || 0,
        completed: completedTasks,
        overdue: Number(taskStats?.overdue_count) || 0,
        completionRate: taskCompletionRate,
      },
      courses: courseDistribution,
      sources: sourceDistribution,
      staffPerformance,
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to aggregate reporting metrics', details: error.message });
  }
});

// ==========================================
// 6. SYSTEM RESET (DEMO RE-SEED)
// ==========================================
apiRouter.post('/system/reset', async (_req, res: Response) => {
  try {
    const result = await seedDatabase(true);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to reset system data', details: error.message });
  }
});
