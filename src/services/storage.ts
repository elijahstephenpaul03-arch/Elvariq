/**
 * @license
 * ELVARIQ - Enquiry & Relationship Management System
 * Academic Frontend Prototype | IME Subject Case Study
 * 
 * LocalStorage Service Provider
 * Handles reading, writing, initializing, and resetting browser-persisted demo data.
 * Pure frontend implementation without external databases or server APIs.
 */

import { Enquiry, StaffMember, FollowUpTask, TestCaseModel } from '../types';
import {
  INITIAL_ENQUIRIES,
  INITIAL_STAFF,
  INITIAL_TASKS,
  INITIAL_TEST_CASES,
} from '../data/initialData';

const KEYS = {
  ENQUIRIES: 'elvariq_records_enquiries_v1',
  STAFF: 'elvariq_records_staff_v1',
  TASKS: 'elvariq_records_tasks_v1',
  TEST_CASES: 'elvariq_records_testcases_v1',
  INITIALIZED: 'elvariq_initialized_v1',
};

/**
 * Initializes localStorage with baseline demonstration dataset on first launch.
 */
export function initializeStorageIfEmpty(): void {
  try {
    const isInit = localStorage.getItem(KEYS.INITIALIZED);
    if (!isInit) {
      resetToDefaultData();
    }
  } catch (err) {
    console.error('Failed to access localStorage during initialization:', err);
  }
}

/**
 * Completely resets all local records back to the original demonstration dataset.
 * Ideal for academic demonstrators wanting to restart clean test runs.
 */
export function resetToDefaultData(): void {
  try {
    localStorage.setItem(KEYS.ENQUIRIES, JSON.stringify(INITIAL_ENQUIRIES));
    localStorage.setItem(KEYS.STAFF, JSON.stringify(INITIAL_STAFF));
    localStorage.setItem(KEYS.TASKS, JSON.stringify(INITIAL_TASKS));
    localStorage.setItem(KEYS.TEST_CASES, JSON.stringify(INITIAL_TEST_CASES));
    localStorage.setItem(KEYS.INITIALIZED, 'true');
  } catch (err) {
    console.error('Failed to reset localStorage dataset:', err);
  }
}

/**
 * Retrieve all enquiries from localStorage.
 */
export function getEnquiries(): Enquiry[] {
  try {
    const raw = localStorage.getItem(KEYS.ENQUIRIES);
    if (!raw) {
      resetToDefaultData();
      return INITIAL_ENQUIRIES;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse enquiries from localStorage:', err);
    return INITIAL_ENQUIRIES;
  }
}

/**
 * Save updated enquiry list to localStorage.
 */
export function saveEnquiries(enquiries: Enquiry[]): void {
  try {
    localStorage.setItem(KEYS.ENQUIRIES, JSON.stringify(enquiries));
  } catch (err) {
    console.error('Failed to save enquiries to localStorage:', err);
  }
}

/**
 * Retrieve all staff members.
 */
export function getStaffMembers(): StaffMember[] {
  try {
    const raw = localStorage.getItem(KEYS.STAFF);
    if (!raw) {
      localStorage.setItem(KEYS.STAFF, JSON.stringify(INITIAL_STAFF));
      return INITIAL_STAFF;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse staff from localStorage:', err);
    return INITIAL_STAFF;
  }
}

/**
 * Save staff members to localStorage.
 */
export function saveStaffMembers(staff: StaffMember[]): void {
  try {
    localStorage.setItem(KEYS.STAFF, JSON.stringify(staff));
  } catch (err) {
    console.error('Failed to save staff to localStorage:', err);
  }
}

/**
 * Retrieve follow-up tasks from localStorage.
 */
export function getTasks(): FollowUpTask[] {
  try {
    const raw = localStorage.getItem(KEYS.TASKS);
    if (!raw) {
      localStorage.setItem(KEYS.TASKS, JSON.stringify(INITIAL_TASKS));
      return INITIAL_TASKS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse tasks from localStorage:', err);
    return INITIAL_TASKS;
  }
}

/**
 * Save follow-up tasks to localStorage.
 */
export function saveTasks(tasks: FollowUpTask[]): void {
  try {
    localStorage.setItem(KEYS.TASKS, JSON.stringify(tasks));
  } catch (err) {
    console.error('Failed to save tasks to localStorage:', err);
  }
}

/**
 * Retrieve test cases from localStorage.
 */
export function getTestCases(): TestCaseModel[] {
  try {
    const raw = localStorage.getItem(KEYS.TEST_CASES);
    if (!raw) {
      localStorage.setItem(KEYS.TEST_CASES, JSON.stringify(INITIAL_TEST_CASES));
      return INITIAL_TEST_CASES;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse test cases from localStorage:', err);
    return INITIAL_TEST_CASES;
  }
}

/**
 * Save test cases to localStorage.
 */
export function saveTestCases(testCases: TestCaseModel[]): void {
  try {
    localStorage.setItem(KEYS.TEST_CASES, JSON.stringify(testCases));
  } catch (err) {
    console.error('Failed to save test cases to localStorage:', err);
  }
}

/**
 * Helper to compute the next unique auto-incrementing enquiry ID.
 * Format: ELV-2026-XXX
 */
export function generateNextEnquiryId(existing: Enquiry[]): string {
  const year = new Date().getFullYear();
  const pattern = new RegExp(`^ELV-${year}-(\\d+)$`);
  let maxSeq = 0;

  existing.forEach((item) => {
    const match = item.id.match(pattern);
    if (match) {
      const num = parseInt(match[1], 10);
      if (!isNaN(num) && num > maxSeq) {
        maxSeq = num;
      }
    }
  });

  const nextSeq = (maxSeq + 1).toString().padStart(3, '0');
  return `ELV-${year}-${nextSeq}`;
}

/**
 * Helper to compute next task ID.
 * Format: TSK-XXX
 */
export function generateNextTaskId(existing: FollowUpTask[]): string {
  let maxNum = 500;
  existing.forEach((t) => {
    const match = t.id.match(/^TSK-(\d+)$/);
    if (match) {
      const num = parseInt(match[1], 10);
      if (!isNaN(num) && num > maxNum) {
        maxNum = num;
      }
    }
  });
  return `TSK-${maxNum + 1}`;
}
