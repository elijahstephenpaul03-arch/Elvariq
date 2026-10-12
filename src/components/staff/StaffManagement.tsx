/**
 * @license
 * ELVARIQ - Enquiry & Relationship Management System
 * Academic Frontend Prototype | IME Subject Case Study
 * 
 * Feature 3: Staff Management & Workload Allocation
 * Displays staff directory across demonstration roles (Administrator, Manager, Counsellor),
 * calculates real-time enquiry loads, and enables direct enquiry allocation.
 */

import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { StaffRole, StaffMember } from '../../types';
import {
  Briefcase,
  Users,
  CheckCircle,
  Clock,
  UserCheck,
  Mail,
  Phone,
  ShieldAlert,
  ArrowRight,
  Filter,
} from 'lucide-react';

export const StaffManagement: React.FC = () => {
  const {
    staff,
    enquiries,
    tasks,
    assignStaffToEnquiry,
    setDetailEnquiryId,
    setActivePage,
  } = useData();

  // Selected staff to view assigned enquiries breakdown
  const [selectedStaffId, setSelectedStaffId] = useState<string>(staff[2]?.id || staff[0].id);
  const [roleFilter, setRoleFilter] = useState<string>('all');

  // Quick Assignment Form on this page
  const [quickEnquiryId, setQuickEnquiryId] = useState<string>('');
  const [quickAssigneeId, setQuickAssigneeId] = useState<string>(staff[2]?.id || staff[0].id);
  const [quickNote, setQuickNote] = useState('');

  // Unassigned enquiries for assignment dropdown
  const unassignedEnquiries = enquiries.filter((e) => !e.assignedStaffId);

  const filteredStaff = staff.filter((m) => {
    if (roleFilter !== 'all' && m.role !== roleFilter) return false;
    return true;
  });

  const selectedStaffMember = staff.find((s) => s.id === selectedStaffId) || staff[0];
  const assignedToSelected = enquiries.filter((e) => e.assignedStaffId === selectedStaffMember?.id);
  const tasksForSelected = tasks.filter((t) => t.staffId === selectedStaffMember?.id);

  const handleQuickAssign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickEnquiryId || !quickAssigneeId) return;

    assignStaffToEnquiry(quickEnquiryId, quickAssigneeId, quickNote);
    setQuickEnquiryId('');
    setQuickNote('');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-600 mb-1">
            <span>Feature 3: Human Resource Allocation</span>
            <span className="text-gray-300">/</span>
            <span>Academic Simulation</span>
          </div>
          <h2 className="text-lg font-bold text-gray-900">Staff Workload & Assignment</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage institutional staff members, review caseloads, and assign candidate enquiries to counsellors.
          </p>
        </div>

        {/* Role Disclaimer Card */}
        <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs max-w-sm">
          <div className="flex items-center gap-1.5 text-gray-700 font-semibold mb-0.5">
            <ShieldAlert className="w-4 h-4 text-teal-600" />
            <span>Academic Demonstration Roles</span>
          </div>
          <p className="text-[11px] text-gray-500 leading-tight">
            Roles simulate administrative and counselling responsibilities for diploma evaluation. Real auth requires future backend implementation.
          </p>
        </div>
      </div>

      {/* Quick Assign Widget Strip */}
      <div className="bg-teal-50/70 p-4 rounded-xl border border-teal-200/80">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <h3 className="text-xs font-bold text-teal-900 uppercase tracking-wider flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-teal-600" />
              <span>Direct Enquiry Allocation</span>
            </h3>
            <p className="text-xs text-teal-700">
              There are currently <strong className="font-mono">{unassignedEnquiries.length} unassigned</strong> enquiries awaiting counsellor allocation.
            </p>
          </div>

          <form onSubmit={handleQuickAssign} className="flex flex-wrap items-center gap-2 text-xs">
            {/* Unassigned enquiry dropdown */}
            <select
              value={quickEnquiryId}
              onChange={(e) => setQuickEnquiryId(e.target.value)}
              className="px-3 py-2 rounded-lg border border-teal-300 bg-white text-gray-800 outline-none max-w-xs"
            >
              <option value="">-- Choose Unassigned Enquiry --</option>
              {unassignedEnquiries.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.id}: {e.fullName} ({e.course})
                </option>
              ))}
            </select>

            {/* Target Staff */}
            <select
              value={quickAssigneeId}
              onChange={(e) => setQuickAssigneeId(e.target.value)}
              className="px-3 py-2 rounded-lg border border-teal-300 bg-white text-gray-800 outline-none"
            >
              {staff.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.role})
                </option>
              ))}
            </select>

            <button
              type="submit"
              disabled={!quickEnquiryId}
              className="px-4 py-2 font-semibold bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors whitespace-nowrap shadow-xs"
            >
              Assign Now
            </button>
          </form>
        </div>
      </div>

      {/* Staff Directory Cards Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
            Demonstration Staff Directory ({filteredStaff.length})
          </h3>

          <div className="flex items-center gap-2 text-xs">
            <Filter className="w-3.5 h-3.5 text-gray-400" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="p-1.5 border border-gray-200 rounded-lg bg-white text-xs outline-none"
            >
              <option value="all">All Demonstration Roles</option>
              <option value="Administrator">Administrators</option>
              <option value="Manager">Managers</option>
              <option value="Counsellor">Counsellors</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStaff.map((member) => {
            const assignedCount = enquiries.filter((e) => e.assignedStaffId === member.id).length;
            const pendingTasks = tasks.filter(
              (t) => t.staffId === member.id && t.status === 'Pending'
            ).length;
            const completedTasks = tasks.filter(
              (t) => t.staffId === member.id && t.status === 'Completed'
            ).length;
            const isSelected = member.id === selectedStaffId;

            return (
              <div
                key={member.id}
                onClick={() => setSelectedStaffId(member.id)}
                className={`p-5 rounded-xl border transition-all cursor-pointer bg-white relative ${
                  isSelected
                    ? 'border-teal-500 ring-2 ring-teal-500/10 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 shadow-2xs'
                }`}
              >
                {/* Staff Top Lockup */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm ${
                        member.role === 'Administrator'
                          ? 'bg-purple-900 text-purple-200'
                          : member.role === 'Manager'
                          ? 'bg-blue-900 text-blue-200'
                          : 'bg-[#111827] text-teal-400'
                      }`}
                    >
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-gray-900">{member.name}</h4>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.2 rounded ${
                            member.role === 'Administrator'
                              ? 'bg-purple-50 text-purple-700 border border-purple-200'
                              : member.role === 'Manager'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-teal-50 text-teal-700 border border-teal-200'
                          }`}
                        >
                          {member.role}
                        </span>
                        <span className="text-[11px] font-mono text-gray-400">
                          {member.id}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Department & Specialty */}
                <div className="mt-4 pt-3 border-t border-gray-100 text-xs space-y-1.5">
                  <div className="text-gray-800 font-medium">{member.department}</div>
                  <div className="text-[11px] text-gray-500 leading-snug">
                    Focus: {member.specialization}
                  </div>
                </div>

                {/* Contact items */}
                <div className="mt-3 text-[11px] text-gray-500 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span className="truncate">{member.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span className="font-mono">{member.phone}</span>
                  </div>
                </div>

                {/* Workload Metric Bar */}
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-gray-400 text-[10px] uppercase font-bold block">
                      Assigned Enquiries
                    </span>
                    <span className="text-base font-bold text-gray-900 tabular-nums font-mono">
                      {assignedCount}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-gray-400 text-[10px] uppercase font-bold block">
                      Active Tasks
                    </span>
                    <span className="text-sm font-semibold text-amber-600 tabular-nums font-mono">
                      {pendingTasks} pending
                    </span>
                  </div>
                </div>

                {isSelected && (
                  <div className="mt-3 text-center text-[11px] text-teal-600 font-semibold bg-teal-50/50 py-1 rounded">
                    Selected · Viewing Dossier Below
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Staff Member's Detail Dossier */}
      {selectedStaffMember && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-50/60">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-gray-900">
                  {selectedStaffMember.name} — Assigned Enquiries & Activity Pipeline
                </h3>
                <span className="text-[10px] font-mono text-gray-400">
                  {selectedStaffMember.id}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                {selectedStaffMember.department} · {selectedStaffMember.role}
              </p>
            </div>

            <button
              onClick={() => setActivePage('tasks')}
              className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1 self-start sm:self-auto"
            >
              <span>Open Follow-up Task Pipeline</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-5">
            {assignedToSelected.length === 0 ? (
              <div className="py-8 text-center text-gray-400 text-xs">
                No active enquiries currently assigned to {selectedStaffMember.name}. Use the allocation tool above to assign records.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-400 text-[10px] font-bold uppercase tracking-wider">
                      <th className="py-2.5 px-3">Enquiry ID</th>
                      <th className="py-2.5 px-3">Candidate</th>
                      <th className="py-2.5 px-3">Program</th>
                      <th className="py-2.5 px-3">Priority</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {assignedToSelected.map((enq) => (
                      <tr key={enq.id} className="hover:bg-gray-50">
                        <td className="py-2.5 px-3 font-mono font-medium text-gray-900">
                          {enq.id}
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="font-semibold text-gray-900">{enq.fullName}</div>
                          <div className="text-[11px] text-gray-400">{enq.phone}</div>
                        </td>
                        <td className="py-2.5 px-3 text-gray-700">{enq.course}</td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`font-semibold text-[11px] ${
                              enq.priority === 'High'
                                ? 'text-rose-600'
                                : enq.priority === 'Medium'
                                ? 'text-amber-600'
                                : 'text-gray-500'
                            }`}
                          >
                            {enq.priority}
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="font-semibold text-gray-800">{enq.status}</span>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            onClick={() => {
                              setDetailEnquiryId(enq.id);
                              setActivePage('enquiries');
                            }}
                            className="text-teal-600 hover:text-teal-700 font-semibold text-xs"
                          >
                            Inspect →
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
