/**
 * @license
 * ELVARIQ - Enquiry & Relationship Management System
 * Academic Frontend Prototype | IME Subject Case Study
 * 
 * Dashboard View Component
 * Real-time summary statistics, interactive charts (Status, Source, Staff Workload),
 * and recent enquiries data table. Dynamically calculated from localStorage.
 */

import React from 'react';
import { useData } from '../../context/DataContext';
import {
  Users,
  UserPlus,
  UserCheck,
  Clock,
  CheckCircle,
  ArrowRight,
  TrendingUp,
  Briefcase,
  Layers,
  Calendar,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    enquiries,
    staff,
    tasks,
    metrics,
    setActivePage,
    setDetailEnquiryId,
    setAssignEnquiryId,
  } = useData();

  // 1. Calculations for Enquiry Status distribution
  const statusCounts = {
    New: enquiries.filter((e) => e.status === 'New').length,
    Assigned: enquiries.filter((e) => e.status === 'Assigned').length,
    'In Follow-up': enquiries.filter((e) => e.status === 'In Follow-up').length,
    Converted: enquiries.filter((e) => e.status === 'Converted').length,
    Lost: enquiries.filter((e) => e.status === 'Lost').length,
  };

  const statusColors: Record<string, string> = {
    New: '#3B82F6', // Blue
    Assigned: '#6366F1', // Indigo
    'In Follow-up': '#F59E0B', // Amber
    Converted: '#14B8A6', // Teal
    Lost: '#94A3B8', // Slate
  };

  // 2. Calculations for Enquiry Source breakdown
  const sourceMap: Record<string, number> = {};
  enquiries.forEach((e) => {
    sourceMap[e.source] = (sourceMap[e.source] || 0) + 1;
  });
  const sourceEntries = Object.entries(sourceMap).sort((a, b) => b[1] - a[1]);

  // 3. Staff Workload calculations
  const staffWorkload = staff.map((member) => {
    const assignedCount = enquiries.filter((e) => e.assignedStaffId === member.id).length;
    const activeTasks = tasks.filter(
      (t) => t.staffId === member.id && t.status === 'Pending'
    ).length;
    const percentage = Math.min(
      100,
      Math.round((assignedCount / (member.maxCapacity || 15)) * 100)
    );
    return {
      member,
      assignedCount,
      activeTasks,
      percentage,
    };
  });

  // Recent 6 enquiries
  const recentEnquiries = enquiries.slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Academic Prototype Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-gray-900 via-gray-900 to-gray-800 text-white shadow-sm border border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-teal-400 uppercase tracking-wider font-mono">
              Academic Prototype
            </span>
            <span className="text-gray-500">·</span>
            <span className="text-xs text-gray-300">IME Subject Case Study</span>
          </div>
          <h2 className="text-lg md:text-xl font-bold tracking-tight">
            Enquiry & Relationship Management System
          </h2>
          <p className="text-xs text-gray-400 mt-1 max-w-2xl leading-relaxed">
            Demonstrating structured enquiry ingestion, staff allocation, follow-up tracking, and academic analytics with browser persistence.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setActivePage('new-enquiry')}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold bg-[#14B8A6] hover:bg-teal-600 text-white rounded-lg shadow-sm transition-colors whitespace-nowrap"
          >
            <UserPlus className="w-4 h-4" />
            <span>Register Enquiry</span>
          </button>
          <button
            onClick={() => setActivePage('enquiries')}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 rounded-lg transition-colors whitespace-nowrap"
          >
            <span>View All Records</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 5 Core Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Enquiries */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
          <div className="flex items-center justify-between text-gray-500 text-xs font-medium">
            <span>Total Enquiries</span>
            <Users className="w-4 h-4 text-gray-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900 tabular-nums">
              {metrics.totalEnquiries}
            </span>
            <span className="text-[11px] text-gray-500">all channels</span>
          </div>
          <div className="mt-3 text-[11px] text-gray-500 flex items-center justify-between pt-2 border-t border-gray-100">
            <span>Converted: {metrics.convertedEnquiries}</span>
            <span className="font-semibold text-teal-600 tabular-nums">
              {metrics.conversionRate}% rate
            </span>
          </div>
        </div>

        {/* New Enquiries */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
          <div className="flex items-center justify-between text-gray-500 text-xs font-medium">
            <span>New Enquiries</span>
            <UserPlus className="w-4 h-4 text-blue-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-blue-600 tabular-nums">
              {metrics.newEnquiries}
            </span>
            <span className="text-[11px] text-gray-500">unassigned</span>
          </div>
          <div className="mt-3 text-[11px] text-gray-500 flex items-center justify-between pt-2 border-t border-gray-100">
            <span>Action required</span>
            <button
              onClick={() => setActivePage('enquiries')}
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Assign now →
            </button>
          </div>
        </div>

        {/* Assigned Enquiries */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
          <div className="flex items-center justify-between text-gray-500 text-xs font-medium">
            <span>Assigned</span>
            <UserCheck className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-indigo-600 tabular-nums">
              {metrics.assignedEnquiries}
            </span>
            <span className="text-[11px] text-gray-500">with counsellors</span>
          </div>
          <div className="mt-3 text-[11px] text-gray-500 flex items-center justify-between pt-2 border-t border-gray-100">
            <span>Active pipeline</span>
            <span className="font-mono text-gray-700">
              {metrics.assignedEnquiries + metrics.inFollowUpEnquiries} total
            </span>
          </div>
        </div>

        {/* Pending Follow-ups */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
          <div className="flex items-center justify-between text-gray-500 text-xs font-medium">
            <span>Pending Follow-ups</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-600 tabular-nums">
              {metrics.pendingTasks}
            </span>
            <span className="text-[11px] text-gray-500">tasks queued</span>
          </div>
          <div className="mt-3 text-[11px] text-gray-500 flex items-center justify-between pt-2 border-t border-gray-100">
            <span>Overdue: {metrics.overdueTasks}</span>
            <button
              onClick={() => setActivePage('tasks')}
              className="text-amber-600 hover:text-amber-700 font-semibold"
            >
              View tasks →
            </button>
          </div>
        </div>

        {/* Converted Enquiries */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
          <div className="flex items-center justify-between text-gray-500 text-xs font-medium">
            <span>Converted</span>
            <CheckCircle className="w-4 h-4 text-teal-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-teal-600 tabular-nums">
              {metrics.convertedEnquiries}
            </span>
            <span className="text-[11px] text-gray-500">enrolled</span>
          </div>
          <div className="mt-3 text-[11px] text-gray-500 flex items-center justify-between pt-2 border-t border-gray-100">
            <span>Completion</span>
            <span className="font-semibold text-teal-600 tabular-nums">
              {metrics.followUpCompletionRate}% resolved
            </span>
          </div>
        </div>
      </div>

      {/* Charts Row: Status Breakdown & Lead Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Status Distribution */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Enquiry Status Distribution</h3>
              <p className="text-[11px] text-gray-500">Current lifecycle states across all records</p>
            </div>
            <span className="text-xs font-mono text-gray-400">{metrics.totalEnquiries} Total</span>
          </div>

          {/* Segmented Bar */}
          <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden flex mb-4">
            {Object.entries(statusCounts).map(([status, count]) => {
              const width = metrics.totalEnquiries > 0 ? (count / metrics.totalEnquiries) * 100 : 0;
              if (width === 0) return null;
              return (
                <div
                  key={status}
                  style={{ width: `${width}%`, backgroundColor: statusColors[status] }}
                  title={`${status}: ${count} (${Math.round(width)}%)`}
                />
              );
            })}
          </div>

          {/* Legend with exact dynamic counts */}
          <div className="space-y-2 text-xs">
            {Object.entries(statusCounts).map(([status, count]) => {
              const pct = metrics.totalEnquiries > 0 ? Math.round((count / metrics.totalEnquiries) * 100) : 0;
              return (
                <div key={status} className="flex items-center justify-between py-1 border-b border-gray-50">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-xs shrink-0"
                      style={{ backgroundColor: statusColors[status] }}
                    />
                    <span className="text-gray-700 font-medium">{status}</span>
                  </div>
                  <div className="flex items-center gap-3 font-mono tabular-nums text-gray-600">
                    <span>{count}</span>
                    <span className="text-gray-400 text-[11px] w-8 text-right">{pct}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 2: Enquiry Ingestion Sources */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Enquiry Sources</h3>
              <p className="text-[11px] text-gray-500">Inbound marketing & referral channels</p>
            </div>
            <Layers className="w-4 h-4 text-gray-400" />
          </div>

          <div className="space-y-3">
            {sourceEntries.map(([source, count]) => {
              const pct = metrics.totalEnquiries > 0 ? Math.round((count / metrics.totalEnquiries) * 100) : 0;
              return (
                <div key={source} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium text-gray-700">
                    <span className="truncate">{source}</span>
                    <span className="font-mono tabular-nums text-gray-500">
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-teal-500 rounded-full transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 3: Staff Workload & Active Pipeline */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Staff Workload Balance</h3>
              <p className="text-[11px] text-gray-500">Active assignments per counsellor</p>
            </div>
            <button
              onClick={() => setActivePage('staff')}
              className="text-xs text-teal-600 hover:text-teal-700 font-semibold"
            >
              Manage →
            </button>
          </div>

          <div className="space-y-3.5">
            {staffWorkload.map(({ member, assignedCount, activeTasks, percentage }) => (
              <div key={member.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="font-semibold text-gray-800 truncate">{member.name}</span>
                    <span className="text-[10px] text-gray-600 shrink-0">({member.role})</span>
                  </div>
                  <span className="font-mono text-gray-600 shrink-0 tabular-nums">
                    {assignedCount} enq · {activeTasks} tasks
                  </span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      percentage > 85 ? 'bg-rose-500' : percentage > 50 ? 'bg-amber-500' : 'bg-teal-500'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] text-gray-500 flex justify-between">
            <span>Capacity utilization threshold: 15 enquiries</span>
            <span className="text-teal-600 font-semibold">Balanced</span>
          </div>
        </div>
      </div>

      {/* Recent Enquiries Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden">
        <div className="p-4 sm:px-6 flex items-center justify-between border-b border-gray-100">
          <div>
            <h3 className="text-sm font-bold text-gray-900">Recent Enquiries</h3>
            <p className="text-xs text-gray-500">Latest enquiries registered in the system</p>
          </div>
          <button
            onClick={() => setActivePage('enquiries')}
            className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1"
          >
            <span>View All ({enquiries.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50/75 border-b border-gray-100 text-gray-500 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Enquiry ID</th>
                <th className="py-3 px-4">Candidate Name</th>
                <th className="py-3 px-4">Interested Course</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Assigned Staff</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {recentEnquiries.map((enq) => {
                const assignedMember = staff.find((s) => s.id === enq.assignedStaffId);

                return (
                  <tr key={enq.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-gray-900">
                      <div className="flex items-center gap-1.5">
                        <span>{enq.id}</span>
                        {!enq.isDemoRecord && (
                          <span className="text-[9px] font-bold text-teal-700 bg-teal-50 px-1 py-0.2 rounded border border-teal-200">
                            NEW
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-gray-900">{enq.fullName}</div>
                      <div className="text-[11px] text-gray-500">{enq.phone}</div>
                    </td>
                    <td className="py-3 px-4 max-w-xs truncate text-gray-800">
                      {enq.course}
                    </td>
                    <td className="py-3 px-4 font-mono text-gray-600">
                      {enq.date}
                    </td>
                    <td className="py-3 px-4">
                      {assignedMember ? (
                        <span className="text-gray-900 font-medium">
                          {assignedMember.name}
                        </span>
                      ) : (
                        <button
                          onClick={() => setAssignEnquiryId(enq.id)}
                          className="text-xs text-blue-600 hover:text-blue-700 underline font-medium"
                        >
                          + Assign Staff
                        </button>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-[11px] font-medium ${
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
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block text-[11px] font-semibold ${
                          enq.status === 'Converted'
                            ? 'text-teal-600'
                            : enq.status === 'New'
                            ? 'text-blue-600'
                            : enq.status === 'In Follow-up'
                            ? 'text-amber-600'
                            : enq.status === 'Assigned'
                            ? 'text-indigo-600'
                            : 'text-gray-500'
                        }`}
                      >
                        {enq.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          setDetailEnquiryId(enq.id);
                          setActivePage('enquiries');
                        }}
                        className="px-2.5 py-1 text-[11px] font-semibold text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
