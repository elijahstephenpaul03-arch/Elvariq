/**
 * @license
 * ELVARIQ - Enquiry & Relationship Management System
 * PostgreSQL Database Schema via Drizzle ORM
 */

import { pgTable, text, serial, timestamp, integer, boolean, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table (authenticated users via Firebase Auth UID)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  role: text('role').notNull().default('Counsellor'), // Administrator, Manager, Counsellor
  displayName: text('display_name'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Staff table
export const staff = pgTable('staff', {
  id: text('id').primaryKey(), // e.g., STF-101
  name: text('name').notNull(),
  role: text('role').notNull(), // Administrator, Manager, Counsellor
  department: text('department').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  specialization: text('specialization').notNull(),
  maxCapacity: integer('max_capacity').notNull().default(15),
  createdAt: timestamp('created_at').defaultNow(),
});

// Enquiries table
export const enquiries = pgTable('enquiries', {
  id: text('id').primaryKey(), // e.g., ELV-2026-001
  fullName: text('full_name').notNull(),
  phone: text('phone').notNull(),
  email: text('email').notNull(),
  course: text('course').notNull(),
  qualification: text('qualification').notNull(),
  location: text('location').notNull(),
  source: text('source').notNull(),
  date: text('date').notNull(), // YYYY-MM-DD
  priority: text('priority').notNull(), // High, Medium, Low
  status: text('status').notNull(), // New, Assigned, In Follow-up, Converted, Lost
  assignedStaffId: text('assigned_staff_id').references(() => staff.id),
  followUpDate: text('follow_up_date'),
  remarks: text('remarks'),
  isDemoRecord: boolean('is_demo_record').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export interface TaskNoteItem {
  id: string;
  authorName: string;
  authorRole: string;
  timestamp: string;
  content: string;
}

// Follow-up Tasks table
export const tasks = pgTable('tasks', {
  id: text('id').primaryKey(), // e.g., TSK-501
  enquiryId: text('enquiry_id').notNull().references(() => enquiries.id, { onDelete: 'cascade' }),
  staffId: text('staff_id').notNull().references(() => staff.id),
  scheduledDate: text('scheduled_date').notNull(), // YYYY-MM-DD
  priority: text('priority').notNull(), // High, Medium, Low
  status: text('status').notNull(), // Pending, Completed, Overdue
  completedAt: text('completed_at'),
  notes: jsonb('notes').$type<TaskNoteItem[]>().default([]),
  createdAt: timestamp('created_at').defaultNow(),
});

// Relations
export const usersRelations = relations(users, () => ({}));

export const staffRelations = relations(staff, ({ many }) => ({
  enquiries: many(enquiries),
  tasks: many(tasks),
}));

export const enquiriesRelations = relations(enquiries, ({ one, many }) => ({
  assignedStaff: one(staff, {
    fields: [enquiries.assignedStaffId],
    references: [staff.id],
  }),
  tasks: many(tasks),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  enquiry: one(enquiries, {
    fields: [tasks.enquiryId],
    references: [enquiries.id],
  }),
  staff: one(staff, {
    fields: [tasks.staffId],
    references: [staff.id],
  }),
}));
