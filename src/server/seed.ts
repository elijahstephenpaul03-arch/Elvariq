import { db } from '../db/index.ts';
import { staff, enquiries, tasks } from '../db/schema.ts';
import { INITIAL_STAFF, INITIAL_ENQUIRIES, INITIAL_TASKS } from '../data/initialData.ts';
import { count } from 'drizzle-orm';

export async function seedDatabase(forceReset = false) {
  try {
    if (forceReset) {
      // Cascading clean
      await db.delete(tasks);
      await db.delete(enquiries);
      await db.delete(staff);
    } else {
      const [{ value: staffCount }] = await db.select({ value: count() }).from(staff);
      if (staffCount > 0) {
        return { message: 'Database already seeded', seeded: false };
      }
    }

    // 1. Insert Staff
    for (const s of INITIAL_STAFF) {
      await db.insert(staff).values({
        id: s.id,
        name: s.name,
        role: s.role,
        department: s.department,
        email: s.email,
        phone: s.phone,
        specialization: s.specialization,
        maxCapacity: s.maxCapacity,
      }).onConflictDoNothing();
    }

    // 2. Insert Enquiries
    for (const e of INITIAL_ENQUIRIES) {
      await db.insert(enquiries).values({
        id: e.id,
        fullName: e.fullName,
        phone: e.phone,
        email: e.email,
        course: e.course,
        qualification: e.qualification,
        location: e.location,
        source: e.source,
        date: e.date,
        priority: e.priority,
        status: e.status,
        assignedStaffId: e.assignedStaffId || null,
        followUpDate: e.followUpDate || null,
        remarks: e.remarks || '',
        isDemoRecord: e.isDemoRecord ?? true,
      }).onConflictDoNothing();
    }

    // 3. Insert Tasks
    for (const t of INITIAL_TASKS) {
      await db.insert(tasks).values({
        id: t.id,
        enquiryId: t.enquiryId,
        staffId: t.staffId,
        scheduledDate: t.scheduledDate,
        priority: t.priority,
        status: t.status,
        completedAt: t.completedAt || null,
        notes: t.notes || [],
      }).onConflictDoNothing();
    }

    return { message: 'Database successfully seeded with demo dataset', seeded: true };
  } catch (error) {
    console.error('Error during database seeding:', error);
    throw error;
  }
}
