/**
 * @license
 * ELVARIQ - Enquiry & Relationship Management System
 * Academic Frontend Prototype | IME Subject Case Study
 * 
 * Feature 5: Reports & Analytics Component
 * Calculates live conversion figures, channel intake ratios, staff conversion efficiencies,
 * and renders a print-ready executive summary for academic demonstration.
 */

import React from 'react';
import { useData } from '../../context/DataContext';
import {
  BarChart3,
  Printer,
  Download,
  CheckCircle,
  PieChart,
  Users,
  Target,
  FileSpreadsheet,
  Award,
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { enquiries, staff, tasks, metrics } = useData();

  // 1. Enquiries by Status
  const statusStats = {
    New: enquiries.filter((e) => e.status === 'New').length,
    Assigned: enquiries.filter((e) => e.status === 'Assigned').length,
    'In Follow-up': enquiries.filter((e) => e.status === 'In Follow-up').length,
    Converted: enquiries.filter((e) => e.status === 'Converted').length,
    Lost: enquiries.filter((e) => e.status === 'Lost').length,
  };

  // 2. Enquiries by Course
  const courseCounts: Record<string, number> = {};
  enquiries.forEach((e) => {
    courseCounts[e.course] = (courseCounts[e.course] || 0) + 1;
  });
  const courseList = Object.entries(courseCounts).sort((a, b) => b[1] - a[1]);

  // 3. Enquiries by Source
  const sourceCounts: Record<string, number> = {};
  enquiries.forEach((e) => {
    sourceCounts[e.source] = (sourceCounts[e.source] || 0) + 1;
  });
  const sourceList = Object.entries(sourceCounts).sort((a, b) => b[1] - a[1]);

  // 4. Staff-wise Performance
  const staffPerformance = staff.map((member) => {
    const assigned = enquiries.filter((e) => e.assignedStaffId === member.id);
    const converted = assigned.filter((e) => e.status === 'Converted').length;
    const inProgress = assigned.filter(
      (e) => e.status === 'In Follow-up' || e.status === 'Assigned'
    ).length;
    const lost = assigned.filter((e) => e.status === 'Lost').length;
    const convRate = assigned.length > 0 ? Math.round((converted / assigned.length) * 100) : 0;

    return {
      member,
      assignedTotal: assigned.length,
      converted,
      inProgress,
      lost,
      convRate,
    };
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Print Action */}
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-600 mb-1">
            <span>Feature 5: Academic Reporting</span>
            <span className="text-gray-300">/</span>
            <span>Analytics Engine</span>
          </div>
          <h2 className="text-lg font-bold text-gray-900">Enquiry Performance & Analytical Reports</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Real-time analytics aggregated directly from live browser storage records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-[#111827] hover:bg-gray-800 text-white rounded-lg shadow-xs transition-colors"
          >
            <Printer className="w-4 h-4 text-teal-400" />
            <span>Print / Export Report</span>
          </button>
        </div>
      </div>

      {/* Printable Report Header (Visible when printing or on screen) */}
      <div className="hidden print:block p-6 border-b border-gray-300 mb-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">ELVARIQ</h1>
            <p className="text-sm font-semibold text-gray-700">
              Enquiry & Relationship Management System — IME Subject Case Study Report
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Generated: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()} · Academic Frontend Evaluation
            </p>
          </div>
          <div className="text-right text-xs font-mono text-gray-500">
            <div>Baseline: Browser localStorage</div>
            <div>Status: Validated Prototype</div>
          </div>
        </div>
      </div>

      {/* 4 Primary KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
            Total Ingested Enquiries
          </span>
          <div className="mt-2 text-3xl font-extrabold text-gray-900 font-mono tabular-nums">
            {metrics.totalEnquiries}
          </div>
          <span className="text-[11px] text-gray-500 mt-1 block">
            Across 7 academic programs & 6 ingestion channels
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
            Admission Conversion Rate
          </span>
          <div className="mt-2 text-3xl font-extrabold text-teal-600 font-mono tabular-nums">
            {metrics.conversionRate}%
          </div>
          <span className="text-[11px] text-gray-500 mt-1 block">
            {metrics.convertedEnquiries} enrolled admissions out of {metrics.totalEnquiries} total
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
            Follow-up Completion Rate
          </span>
          <div className="mt-2 text-3xl font-extrabold text-indigo-600 font-mono tabular-nums">
            {metrics.followUpCompletionRate}%
          </div>
          <span className="text-[11px] text-gray-500 mt-1 block">
            {metrics.completedTasks} completed tasks out of {tasks.length} total scheduled
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
            Active Counselling Backlog
          </span>
          <div className="mt-2 text-3xl font-extrabold text-amber-600 font-mono tabular-nums">
            {metrics.assignedEnquiries + metrics.inFollowUpEnquiries}
          </div>
          <span className="text-[11px] text-gray-500 mt-1 block">
            Assigned & ongoing follow-up pipeline
          </span>
        </div>
      </div>

      {/* Grid 1: Status Breakdown & Course Popularity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enquiries by Status */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900">Enquiries by Lifecycle Status</h3>
            <span className="text-xs font-mono text-gray-400">100% Ingestion Base</span>
          </div>

          <div className="space-y-3">
            {Object.entries(statusStats).map(([status, count]) => {
              const pct = metrics.totalEnquiries > 0 ? Math.round((count / metrics.totalEnquiries) * 100) : 0;
              return (
                <div key={status} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-gray-700">
                    <span>{status}</span>
                    <span className="font-mono tabular-nums text-gray-500">
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        status === 'Converted'
                          ? 'bg-teal-500'
                          : status === 'New'
                          ? 'bg-blue-500'
                          : status === 'In Follow-up'
                          ? 'bg-amber-500'
                          : status === 'Assigned'
                          ? 'bg-indigo-500'
                          : 'bg-gray-400'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Enquiries by Course / Program */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900">Enquiries by Academic Program</h3>
            <span className="text-xs font-mono text-gray-400">{courseList.length} Programs</span>
          </div>

          <div className="space-y-3">
            {courseList.map(([course, count]) => {
              const pct = metrics.totalEnquiries > 0 ? Math.round((count / metrics.totalEnquiries) * 100) : 0;
              return (
                <div key={course} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-gray-700">
                    <span className="truncate max-w-[280px]">{course}</span>
                    <span className="font-mono tabular-nums text-gray-500">
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-teal-600 rounded-full transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grid 2: Lead Sources & Staff Assignments Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Enquiries by Source */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900">Marketing & Lead Channels</h3>
            <span className="text-xs font-mono text-gray-400">Source Mix</span>
          </div>

          <div className="space-y-3">
            {sourceList.map(([source, count]) => {
              const pct = metrics.totalEnquiries > 0 ? Math.round((count / metrics.totalEnquiries) * 100) : 0;
              return (
                <div key={source} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-gray-700">
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

        {/* Staff-wise Assignments & Conversion Rates Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900">Staff-wise Assignment & Conversion Efficiency</h3>
            <span className="text-xs text-gray-400 font-mono">Counsellor KPIs</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50/70 border-b border-gray-100 text-gray-400 text-[10px] font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Staff Member</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4 text-center">Assigned</th>
                  <th className="py-3 px-4 text-center">In Progress</th>
                  <th className="py-3 px-4 text-center">Converted</th>
                  <th className="py-3 px-4 text-right">Conversion Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {staffPerformance.map(({ member, assignedTotal, converted, inProgress, convRate }) => (
                  <tr key={member.id} className="hover:bg-gray-50/70">
                    <td className="py-3 px-4 font-semibold text-gray-900">{member.name}</td>
                    <td className="py-3 px-4 text-gray-500">{member.role}</td>
                    <td className="py-3 px-4 text-center font-mono font-medium">{assignedTotal}</td>
                    <td className="py-3 px-4 text-center font-mono text-amber-600">{inProgress}</td>
                    <td className="py-3 px-4 text-center font-mono text-teal-600 font-bold">{converted}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-gray-900">
                      {convRate}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
