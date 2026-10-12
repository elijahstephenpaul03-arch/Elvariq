/**
 * @license
 * ELVARIQ - Enquiry & Relationship Management System
 * Academic Frontend Prototype | IME Subject Case Study
 * 
 * Enquiry Edit Modal
 * Allows updating all enquiry attributes and immediately updates localStorage and dashboard.
 */

import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import {
  AVAILABLE_COURSES,
  AVAILABLE_QUALIFICATIONS,
  AVAILABLE_LOCATIONS,
  AVAILABLE_SOURCES,
} from '../../data/initialData';
import { EnquiryPriority, EnquiryStatus } from '../../types';
import { X, Save, AlertCircle } from 'lucide-react';

interface EnquiryEditModalProps {
  enquiryId: string;
  onClose: () => void;
}

export const EnquiryEditModal: React.FC<EnquiryEditModalProps> = ({ enquiryId, onClose }) => {
  const { enquiries, updateEnquiry, staff } = useData();

  const enquiry = enquiries.find((e) => e.id === enquiryId);
  if (!enquiry) return null;

  const [form, setForm] = useState({
    fullName: enquiry.fullName,
    phone: enquiry.phone,
    email: enquiry.email,
    course: enquiry.course,
    qualification: enquiry.qualification,
    location: enquiry.location,
    source: enquiry.source,
    date: enquiry.date,
    priority: enquiry.priority,
    status: enquiry.status,
    assignedStaffId: enquiry.assignedStaffId || '',
    remarks: enquiry.remarks || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (!form.fullName.trim()) newErrors.fullName = 'Full Name is required';
    if (!form.phone.trim()) newErrors.phone = 'Phone Number is required';
    if (!form.email.trim() || !form.email.includes('@')) {
      newErrors.email = 'Valid Email is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    updateEnquiry(enquiry.id, {
      ...form,
      assignedStaffId: form.assignedStaffId ? form.assignedStaffId : null,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/80">
          <div>
            <span className="font-mono text-xs text-teal-600 font-bold block">{enquiry.id}</span>
            <h3 className="text-base font-bold text-gray-900">Edit Enquiry Record</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="overflow-y-auto p-6 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Candidate Name *</label>
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-teal-500 bg-white"
              />
              {errors.fullName && <p className="text-rose-600 text-[11px] mt-0.5">{errors.fullName}</p>}
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Phone Number *</label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-teal-500 bg-white"
              />
              {errors.phone && <p className="text-rose-600 text-[11px] mt-0.5">{errors.phone}</p>}
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Email Address *</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-teal-500 bg-white"
              />
              {errors.email && <p className="text-rose-600 text-[11px] mt-0.5">{errors.email}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Interested Course</label>
              <select
                name="course"
                value={form.course}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-teal-500 bg-white"
              >
                {AVAILABLE_COURSES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Qualification</label>
              <select
                name="qualification"
                value={form.qualification}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-teal-500 bg-white"
              >
                {AVAILABLE_QUALIFICATIONS.map((q) => (
                  <option key={q} value={q}>
                    {q}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Campus Location</label>
              <select
                name="location"
                value={form.location}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-teal-500 bg-white"
              >
                {AVAILABLE_LOCATIONS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Enquiry Source</label>
              <select
                name="source"
                value={form.source}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-teal-500 bg-white"
              >
                {AVAILABLE_SOURCES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Enquiry Date</label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-teal-500 bg-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Priority</label>
              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-teal-500 bg-white"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Lifecycle Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-teal-500 bg-white"
              >
                <option value="New">New</option>
                <option value="Assigned">Assigned</option>
                <option value="In Follow-up">In Follow-up</option>
                <option value="Converted">Converted</option>
                <option value="Lost">Lost</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Assigned Counsellor</label>
              <select
                name="assignedStaffId"
                value={form.assignedStaffId}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-teal-500 bg-white"
              >
                <option value="">(Unassigned)</option>
                {staff.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.role})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Remarks & Intake Notes</label>
            <textarea
              name="remarks"
              rows={3}
              value={form.remarks}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-teal-500 bg-white"
            />
          </div>

          <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3 -mx-6 -mb-6 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-semibold text-gray-700 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 font-semibold bg-[#14B8A6] hover:bg-teal-600 text-white rounded-lg shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
