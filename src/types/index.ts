/**
 * @license
 * ELVARIQ - Enquiry & Relationship Management System
 * Academic Frontend Prototype | IME Subject Case Study
 * 
 * TypeScript Definitions for Data Models
 */

export type EnquiryPriority = 'High' | 'Medium' | 'Low';

export type EnquiryStatus = 'New' | 'Assigned' | 'In Follow-up' | 'Converted' | 'Lost';

export interface Enquiry {
  id: string; // e.g., ELV-2026-001
  fullName: string;
  phone: string;
  email: string;
  course: string;
  qualification: string;
  location: string;
  source: string;
  date: string; // YYYY-MM-DD
  priority: EnquiryPriority;
  status: EnquiryStatus;
  assignedStaffId: string | null;
  followUpDate: string | null; // YYYY-MM-DD
  remarks: string;
  isDemoRecord: boolean; // Distinguishes initial demo data from newly entered records
  createdAt: string;
  updatedAt: string;
}

export type StaffRole = 'Administrator' | 'Manager' | 'Counsellor';

export interface StaffMember {
  id: string; // e.g., STF-101
  name: string;
  role: StaffRole;
  department: string;
  email: string;
  phone: string;
  specialization: string;
  maxCapacity: number;
}

export type TaskStatus = 'Pending' | 'Completed' | 'Overdue';

export interface TaskNote {
  id: string;
  authorName: string;
  authorRole: string;
  timestamp: string;
  content: string;
}

export interface FollowUpTask {
  id: string; // e.g., TSK-501
  enquiryId: string;
  staffId: string;
  scheduledDate: string; // YYYY-MM-DD
  priority: EnquiryPriority;
  status: TaskStatus;
  notes: TaskNote[];
  completedAt: string | null;
}

export type TestResultStatus = 'Pass' | 'Fail' | 'Pending';

export interface TestCaseModel {
  id: string; // TC-01, TC-02, TC-03
  title: string;
  objective: string;
  preconditions: string;
  steps: string[];
  inputData: Record<string, string>;
  expectedResult: string;
  actualResult: string;
  status: TestResultStatus;
  testedBy?: string;
  lastExecuted?: string;
  notes?: string;
}

export type ActivePage =
  | 'dashboard'
  | 'new-enquiry'
  | 'enquiries'
  | 'staff'
  | 'tasks'
  | 'reports'
  | 'data-fields'
  | 'test-cases'
  | 'pricing'
  | 'about';
