/**
 * @license
 * ELVARIQ - Enquiry & Relationship Management System
 * Academic Frontend Prototype | IME Subject Case Study
 * 
 * Feature 4: Follow-up & Task Pipeline Component
 * Tracks counsellors' pending & completed actions, interaction logs,
 * follow-up date scheduling, and lifecycle conversions.
 */

import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { FollowUpTask, TaskStatus, EnquiryPriority, EnquiryStatus } from '../../types';
import {
  CheckSquare,
  Clock,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Phone,
  Mail,
  User,
  MessageSquare,
  Plus,
  Filter,
  Check,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export const TaskManager: React.FC = () => {
  const {
    tasks,
    enquiries,
    staff,
    updateTaskStatus,
    addTaskNote,
    scheduleFollowUp,
    updateEnquiry,
    setDetailEnquiryId,
    setActivePage,
  } = useData();

  // Filters State
  const [statusFilter, setStatusFilter] = useState<'all' | 'Pending' | 'Completed' | 'Overdue'>('all');
  const [staffFilter, setStaffFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'upcoming' | 'overdue'>('all');

  // Active interaction note modal / drawer
  const [activeTaskForNote, setActiveTaskForNote] = useState<string | null>(null);
  const [noteContent, setNoteContent] = useState('');

  // Reschedule follow-up modal state
  const [activeTaskForSchedule, setActiveTaskForSchedule] = useState<string | null>(null);
  const [newScheduleDate, setNewScheduleDate] = useState('');
  const [scheduleRemark, setScheduleRemark] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];

  // Filter Tasks
  const filteredTasks = tasks.filter((t) => {
    // Status filter
    if (statusFilter === 'Pending' && t.status !== 'Pending') return false;
    if (statusFilter === 'Completed' && t.status !== 'Completed') return false;
    if (statusFilter === 'Overdue') {
      if (t.status !== 'Pending' || t.scheduledDate >= todayStr) return false;
    }

    // Staff filter
    if (staffFilter !== 'all' && t.staffId !== staffFilter) return false;

    // Priority filter
    if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false;

    // Date filter
    if (dateFilter === 'today' && t.scheduledDate !== todayStr) return false;
    if (dateFilter === 'upcoming' && t.scheduledDate <= todayStr) return false;
    if (dateFilter === 'overdue' && (t.status === 'Completed' || t.scheduledDate >= todayStr)) {
      return false;
    }

    return true;
  });

  const handleAddNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTaskForNote || !noteContent.trim()) return;

    addTaskNote(activeTaskForNote, noteContent.trim());
    setNoteContent('');
    setActiveTaskForNote(null);
  };

  const handleRescheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTaskForSchedule || !newScheduleDate) return;

    const task = tasks.find((t) => t.id === activeTaskForSchedule);
    if (task) {
      scheduleFollowUp(task.enquiryId, newScheduleDate, scheduleRemark);
    }

    setActiveTaskForSchedule(null);
    setNewScheduleDate('');
    setScheduleRemark('');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-600 mb-1">
            <span>Feature 4: Counsellor Pipeline</span>
            <span className="text-gray-300">/</span>
            <span>Follow-up Management</span>
          </div>
          <h2 className="text-lg font-bold text-gray-900">Follow-up Tasks & Pipelines</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Maintain counselling interaction timelines, schedule appointments, and advance candidate decisions.
          </p>
        </div>

        {/* Task Counters summary */}
        <div className="flex items-center gap-2 text-xs">
          <div className="px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 flex items-center gap-1.5 font-semibold">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>{tasks.filter((t) => t.status === 'Pending').length} Pending</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 flex items-center gap-1.5 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
            <span>{tasks.filter((t) => t.status === 'Completed').length} Completed</span>
          </div>
        </div>
      </div>

      {/* Task Filters Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Tabs */}
          <div className="flex items-center bg-gray-100 p-1 rounded-lg">
            {(['all', 'Pending', 'Overdue', 'Completed'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                  statusFilter === st
                    ? 'bg-white text-gray-900 shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {st === 'all' ? 'All Tasks' : st}
              </button>
            ))}
          </div>

          {/* Date Range Filter */}
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value as any)}
            className="p-1.5 border border-gray-200 rounded-lg bg-white outline-none"
          >
            <option value="all">All Dates</option>
            <option value="today">Today's Queue</option>
            <option value="upcoming">Upcoming Follow-ups</option>
            <option value="overdue">Overdue Items</option>
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="p-1.5 border border-gray-200 rounded-lg bg-white outline-none"
          >
            <option value="all">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          {/* Staff Filter */}
          <select
            value={staffFilter}
            onChange={(e) => setStaffFilter(e.target.value)}
            className="p-1.5 border border-gray-200 rounded-lg bg-white outline-none"
          >
            <option value="all">All Staff Members</option>
            {staff.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <span className="text-gray-400 font-mono text-xs">
          Showing {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Task Cards Pipeline List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-xl border border-gray-200 text-gray-400">
            <CheckSquare className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="font-semibold text-gray-700 text-sm">No tasks match selected filters</p>
            <p className="text-xs text-gray-400 mt-1">
              Select another status tab or assign new enquiries to generate counselling tasks.
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const enquiry = enquiries.find((e) => e.id === task.enquiryId);
            const assignedMember = staff.find((s) => s.id === task.staffId);
            const isCompleted = task.status === 'Completed';
            const isOverdue = !isCompleted && task.scheduledDate < todayStr;

            return (
              <div
                key={task.id}
                className={`bg-white rounded-xl border transition-all p-5 shadow-2xs ${
                  isCompleted
                    ? 'border-gray-200 opacity-80 bg-gray-50/40'
                    : isOverdue
                    ? 'border-rose-200 ring-1 ring-rose-200/50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  {/* Left: Task Identity & Enquiry Candidate Info */}
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                        {task.id}
                      </span>
                      <span className="text-gray-300">·</span>
                      <span className="font-mono text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                        {task.enquiryId}
                      </span>

                      {/* Status Tag */}
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          isCompleted
                            ? 'text-teal-700 bg-teal-50 border border-teal-200'
                            : isOverdue
                            ? 'text-rose-700 bg-rose-50 border border-rose-200'
                            : 'text-amber-700 bg-amber-50 border border-amber-200'
                        }`}
                      >
                        {isCompleted ? 'COMPLETED' : isOverdue ? 'OVERDUE' : 'PENDING'}
                      </span>

                      <span
                        className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                          task.priority === 'High'
                            ? 'text-rose-600'
                            : task.priority === 'Medium'
                            ? 'text-amber-600'
                            : 'text-gray-500'
                        }`}
                      >
                        {task.priority} Priority
                      </span>
                    </div>

                    {/* Candidate Name & Course */}
                    {enquiry ? (
                      <div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setDetailEnquiryId(enquiry.id);
                              setActivePage('enquiries');
                            }}
                            className="text-base font-bold text-gray-900 hover:text-teal-600 hover:underline"
                          >
                            {enquiry.fullName}
                          </button>
                          <span className="text-xs text-gray-400">({enquiry.status})</span>
                        </div>
                        <div className="text-xs text-gray-600 mt-0.5">{enquiry.course}</div>
                        <div className="flex flex-wrap items-center gap-4 text-[11px] text-gray-500 mt-1 font-mono">
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-teal-600" />
                            {enquiry.phone}
                          </span>
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3 text-teal-600" />
                            {enquiry.email}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-rose-500">Linked enquiry record not found.</div>
                    )}
                  </div>

                  {/* Center / Right: Counsellor & Scheduled Due Date */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-xs">
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 min-w-[160px]">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                        Assigned Counsellor
                      </span>
                      <span className="font-semibold text-gray-900 block mt-0.5">
                        {assignedMember?.name || 'Unassigned'}
                      </span>
                      <span className="text-[11px] text-gray-500">{assignedMember?.role}</span>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 min-w-[160px]">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                        Scheduled Follow-up
                      </span>
                      <span
                        className={`font-mono font-bold text-sm block mt-0.5 ${
                          isOverdue ? 'text-rose-600' : 'text-gray-900'
                        }`}
                      >
                        {task.scheduledDate}
                      </span>
                      <button
                        onClick={() => {
                          setActiveTaskForSchedule(task.id);
                          setNewScheduleDate(task.scheduledDate);
                        }}
                        className="text-[11px] text-teal-600 hover:text-teal-700 font-semibold underline mt-0.5 block"
                      >
                        Reschedule Date
                      </button>
                    </div>

                    {/* Completion Toggle Button */}
                    <div className="self-end sm:self-center">
                      <button
                        onClick={() =>
                          updateTaskStatus(task.id, isCompleted ? 'Pending' : 'Completed')
                        }
                        className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors shadow-xs ${
                          isCompleted
                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                            : 'bg-teal-600 hover:bg-teal-700 text-white'
                        }`}
                      >
                        {isCompleted ? (
                          <>
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Re-open Task</span>
                          </>
                        ) : (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Mark Completed</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Interaction Notes History */}
                <div className="mt-4 pt-3 border-t border-gray-100 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-gray-700 flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-teal-600" />
                      <span>Counsellor Interaction Log ({task.notes.length})</span>
                    </span>

                    <button
                      onClick={() => setActiveTaskForNote(task.id)}
                      className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Note</span>
                    </button>
                  </div>

                  {task.notes.length === 0 ? (
                    <div className="text-[11px] text-gray-400 italic py-1">
                      No follow-up notes logged yet. Click &quot;Add Note&quot; to record counselling outcomes.
                    </div>
                  ) : (
                    <div className="space-y-1.5 max-h-36 overflow-y-auto">
                      {task.notes.map((note) => (
                        <div
                          key={note.id}
                          className="p-2.5 rounded-lg bg-gray-50 border border-gray-100 text-xs flex flex-col gap-1"
                        >
                          <div className="flex items-center justify-between text-[11px] text-gray-500">
                            <span className="font-semibold text-gray-800">
                              {note.authorName} · {note.authorRole}
                            </span>
                            <span className="font-mono text-gray-400">
                              {new Date(note.timestamp).toLocaleString([], {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                          <p className="text-gray-700 leading-snug">{note.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quick Status Conversion for Enquiry right from Task */}
                {enquiry && !isCompleted && (
                  <div className="mt-3 pt-2 border-t border-gray-50 flex items-center justify-between text-[11px]">
                    <span className="text-gray-500">Candidate Stage Conversion:</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          updateEnquiry(enquiry.id, { status: 'Converted' });
                          updateTaskStatus(task.id, 'Completed');
                        }}
                        className="font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 px-2.5 py-1 rounded border border-teal-200 transition-colors"
                      >
                        ✓ Convert to Enrolled
                      </button>
                      <button
                        onClick={() => {
                          updateEnquiry(enquiry.id, { status: 'Lost' });
                          updateTaskStatus(task.id, 'Completed');
                        }}
                        className="font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 px-2.5 py-1 rounded transition-colors"
                      >
                        Mark as Lost
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Modal: Add Interaction Note */}
      {activeTaskForNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-xl shadow-xl border border-gray-200 p-5 space-y-4">
            <h3 className="font-bold text-sm text-gray-900">
              Add Follow-up Note ({activeTaskForNote})
            </h3>

            <form onSubmit={handleAddNoteSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Interaction Summary / Outcome
                </label>
                <textarea
                  rows={4}
                  required
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="e.g. Telephoned student regarding lab visit. Aarav confirmed he will attend Saturday open house with parents."
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-teal-500 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTaskForNote(null)}
                  className="px-3.5 py-1.5 font-semibold text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-semibold bg-teal-600 hover:bg-teal-700 text-white rounded-lg shadow-xs"
                >
                  Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Reschedule Date */}
      {activeTaskForSchedule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-xl shadow-xl border border-gray-200 p-5 space-y-4">
            <h3 className="font-bold text-sm text-gray-900">
              Reschedule Follow-up Date ({activeTaskForSchedule})
            </h3>

            <form onSubmit={handleRescheduleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  New Follow-up Date *
                </label>
                <input
                  type="date"
                  required
                  value={newScheduleDate}
                  onChange={(e) => setNewScheduleDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-teal-500 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Reason / Reschedule Note
                </label>
                <input
                  type="text"
                  value={scheduleRemark}
                  onChange={(e) => setScheduleRemark(e.target.value)}
                  placeholder="e.g. Candidate travelling until next Tuesday."
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-teal-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTaskForSchedule(null)}
                  className="px-3.5 py-1.5 font-semibold text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-semibold bg-teal-600 hover:bg-teal-700 text-white rounded-lg shadow-xs"
                >
                  Confirm Date
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
