import { Enquiry, StaffMember, FollowUpTask, TaskStatus, StaffRole } from '../types';
import { auth } from '../lib/firebase';

let activeRoleForHeaders: StaffRole = 'Manager';

export function setActiveRoleForHeaders(role: StaffRole) {
  activeRoleForHeaders = role;
}

async function getAuthHeaders(): Promise<HeadersInit> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'x-demo-role': activeRoleForHeaders,
  };

  try {
    if (auth.currentUser) {
      const token = await auth.currentUser.getIdToken();
      headers['Authorization'] = `Bearer ${token}`;
    }
  } catch (err) {
    console.warn('Could not acquire Firebase token:', err);
  }

  return headers;
}

export const apiClient = {
  async checkHealth() {
    try {
      const res = await fetch('/api/health');
      return await res.json();
    } catch (err) {
      return { status: 'offline', error: String(err) };
    }
  },

  async fetchStaff(): Promise<StaffMember[]> {
    const headers = await getAuthHeaders();
    const res = await fetch('/api/staff', { headers });
    if (!res.ok) throw new Error(`Failed to fetch staff: ${res.statusText}`);
    return await res.json();
  },

  async createStaff(data: Partial<StaffMember>): Promise<StaffMember> {
    const headers = await getAuthHeaders();
    const res = await fetch('/api/staff', {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to save staff');
    }
    return await res.json();
  },

  async fetchEnquiries(params?: {
    search?: string;
    status?: string;
    priority?: string;
    course?: string;
    assignedStaffId?: string;
  }): Promise<Enquiry[]> {
    const headers = await getAuthHeaders();
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.status) query.set('status', params.status);
    if (params?.priority) query.set('priority', params.priority);
    if (params?.course) query.set('course', params.course);
    if (params?.assignedStaffId) query.set('assignedStaffId', params.assignedStaffId);

    const url = `/api/enquiries${query.toString() ? `?${query.toString()}` : ''}`;
    const res = await fetch(url, { headers });
    if (!res.ok) throw new Error(`Failed to fetch enquiries: ${res.statusText}`);
    return await res.json();
  },

  async createEnquiry(data: {
    fullName: string;
    phone: string;
    email: string;
    course: string;
    qualification: string;
    location: string;
    source: string;
    date: string;
    priority: Enquiry['priority'];
    status: Enquiry['status'];
    remarks: string;
    assignedStaffId?: string | null;
    followUpDate?: string | null;
  }): Promise<Enquiry> {
    const headers = await getAuthHeaders();
    const res = await fetch('/api/enquiries', {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to register enquiry');
    }

    return await res.json();
  },

  async getEnquiry(id: string): Promise<Enquiry & { tasks?: FollowUpTask[]; assignedStaff?: StaffMember }> {
    const headers = await getAuthHeaders();
    const res = await fetch(`/api/enquiries/${id}`, { headers });
    if (!res.ok) throw new Error('Enquiry not found');
    return await res.json();
  },

  async updateEnquiry(id: string, updates: Partial<Enquiry>): Promise<Enquiry> {
    const headers = await getAuthHeaders();
    const res = await fetch(`/api/enquiries/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(updates),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to update enquiry');
    }
    return await res.json();
  },

  async deleteEnquiry(id: string): Promise<void> {
    const headers = await getAuthHeaders();
    const res = await fetch(`/api/enquiries/${id}`, {
      method: 'DELETE',
      headers,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to delete enquiry');
    }
  },

  async assignStaff(enquiryId: string, staffId: string, initialNote?: string) {
    const headers = await getAuthHeaders();
    const res = await fetch(`/api/enquiries/${enquiryId}/assign`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ staffId, initialNote }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to assign staff');
    }
    return await res.json();
  },

  async fetchTasks(params?: { status?: string; staffId?: string }): Promise<FollowUpTask[]> {
    const headers = await getAuthHeaders();
    const query = new URLSearchParams();
    if (params?.status) query.set('status', params.status);
    if (params?.staffId) query.set('staffId', params.staffId);

    const url = `/api/tasks${query.toString() ? `?${query.toString()}` : ''}`;
    const res = await fetch(url, { headers });
    if (!res.ok) throw new Error(`Failed to fetch tasks: ${res.statusText}`);
    return await res.json();
  },

  async updateTaskStatus(taskId: string, status: TaskStatus): Promise<FollowUpTask> {
    const headers = await getAuthHeaders();
    const res = await fetch(`/api/tasks/${taskId}/status`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to update task');
    }
    return await res.json();
  },

  async addTaskNote(taskId: string, content: string): Promise<FollowUpTask> {
    const headers = await getAuthHeaders();
    const res = await fetch(`/api/tasks/${taskId}/notes`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ content }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to save note');
    }
    return await res.json();
  },

  async rescheduleTask(taskId: string, followUpDate: string, note?: string): Promise<FollowUpTask> {
    const headers = await getAuthHeaders();
    const res = await fetch(`/api/tasks/${taskId}/reschedule`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ followUpDate, note }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to reschedule task');
    }
    return await res.json();
  },

  async fetchReportsSummary() {
    const headers = await getAuthHeaders();
    const res = await fetch('/api/reports/summary', { headers });
    if (!res.ok) throw new Error('Failed to fetch reporting summary');
    return await res.json();
  },

  async resetSystem() {
    const headers = await getAuthHeaders();
    const res = await fetch('/api/system/reset', {
      method: 'POST',
      headers,
    });
    if (!res.ok) throw new Error('Failed to reset system data');
    return await res.json();
  },
};
