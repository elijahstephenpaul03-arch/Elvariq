/**
 * @license
 * ELVARIQ - Enquiry & Relationship Management System
 * Academic Frontend Prototype | IME Subject Case Study
 * 
 * Feature 3: Assign Staff Modal
 * Allocates an enquiry to a designated admissions counsellor, initializes follow-up task,
 * and updates staff workload statistics across all views.
 */

import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { X, UserCheck, Briefcase } from 'lucide-react';

interface AssignStaffModalProps {
  enquiryId: string;
  onClose: () => void;
}

export const AssignStaffModal: React.FC<AssignStaffModalProps> = ({ enquiryId, onClose }) => {
  const { enquiries, staff, tasks, assignStaffToEnquiry } = useData();

  const enquiry = enquiries.find((e) => e.id === enquiryId);
  if (!enquiry) return null;

  const currentStaff = staff.find((s) => s.id === enquiry.assignedStaffId);
  const [selectedStaffId, setSelectedStaffId] = useState(enquiry.assignedStaffId || staff[2]?.id || staff[0].id);
  const [assignmentNote, setAssignmentNote] = useState('');

  const handleAssign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStaffId) return;

    assignStaffToEnquiry(enquiry.id, selectedStaffId, assignmentNote);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Assign Staff Member</h3>
              <p className="text-[11px] text-gray-500">
                Allocate {enquiry.fullName} ({enquiry.id}) to counsellor
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleAssign} className="p-5 space-y-4 text-xs">
          {/* Enquiry summary banner */}
          <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 space-y-1">
            <div className="flex justify-between font-medium">
              <span className="text-gray-900 font-semibold">{enquiry.fullName}</span>
              <span className="font-mono text-gray-500">{enquiry.id}</span>
            </div>
            <div className="text-gray-600 truncate">{enquiry.course}</div>
            <div className="text-[11px] text-gray-400">
              Current Status: {enquiry.status} · Priority: {enquiry.priority}
            </div>
          </div>

          {/* Select Staff Member */}
          <div>
            <label className="block font-semibold text-gray-800 mb-1.5">
              Select Staff Member / Counsellor *
            </label>
            <select
              value={selectedStaffId}
              onChange={(e) => setSelectedStaffId(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 focus:border-teal-500 bg-white"
            >
              {staff.map((member) => {
                const assignedCount = enquiries.filter(
                  (e) => e.assignedStaffId === member.id
                ).length;
                return (
                  <option key={member.id} value={member.id}>
                    {member.name} ({member.role}) — {member.department} [{assignedCount} assigned]
                  </option>
                );
              })}
            </select>
          </div>

          {/* Handover Note */}
          <div>
            <label className="block font-semibold text-gray-800 mb-1.5">
              Assignment Note / Handover Instructions (Optional)
            </label>
            <textarea
              rows={3}
              value={assignmentNote}
              onChange={(e) => setAssignmentNote(e.target.value)}
              placeholder="e.g. Candidate requested campus lab visit; please share fee structure before Wednesday."
              className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 focus:border-teal-500 bg-white"
            />
          </div>

          {/* Academic Role Disclaimer */}
          <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-200/80 text-[11px] text-amber-800">
            <strong>Case Study Note:</strong> Roles and staff allocations are simulated in client memory and localStorage as per diploma case study instructions.
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-semibold text-gray-700 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 font-semibold bg-[#14B8A6] hover:bg-teal-600 text-white rounded-lg shadow-xs"
            >
              Confirm Assignment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
