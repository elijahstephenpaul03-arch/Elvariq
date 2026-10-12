/**
 * @license
 * ELVARIQ - Enquiry & Relationship Management System
 * Academic Frontend Prototype | IME Subject Case Study
 * 
 * Feature 2: Enquiry Management Component
 * Comprehensive data grid with live multi-attribute search, faceted filtering,
 * ascending/descending sorting, pagination, delete confirmations, and modals.
 */

import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { EnquiryStatus, EnquiryPriority } from '../../types';
import { AVAILABLE_COURSES } from '../../data/initialData';
import { EnquiryDetailModal } from './EnquiryDetailModal';
import { EnquiryEditModal } from './EnquiryEditModal';
import { AssignStaffModal } from './AssignStaffModal';
import { ConfirmationModal } from '../common/ConfirmationModal';
import {
  Search,
  Filter,
  ArrowUpDown,
  UserPlus,
  Eye,
  Edit,
  Trash2,
  UserCheck,
  Download,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
} from 'lucide-react';

export const EnquiryList: React.FC = () => {
  const {
    enquiries,
    staff,
    deleteEnquiry,
    setActivePage,
    detailEnquiryId,
    setDetailEnquiryId,
    editEnquiryId,
    setEditEnquiryId,
    assignEnquiryId,
    setAssignEnquiryId,
    quickSearchQuery,
    setQuickSearchQuery,
    showToast,
  } = useData();

  // Search & Filters State
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCourse, setFilterCourse] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterStaff, setFilterStaff] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'id'>('date');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  // Delete Confirmation State
  const [enquiryToDelete, setEnquiryToDelete] = useState<string | null>(null);

  // Filtering and Sorting Pipeline
  const filteredEnquiries = useMemo(() => {
    return enquiries.filter((item) => {
      // 1. Text Search (Name, ID, Phone, Email)
      if (quickSearchQuery.trim()) {
        const query = quickSearchQuery.toLowerCase();
        const matchesName = item.fullName.toLowerCase().includes(query);
        const matchesId = item.id.toLowerCase().includes(query);
        const matchesPhone = item.phone.toLowerCase().includes(query);
        const matchesEmail = item.email.toLowerCase().includes(query);
        if (!matchesName && !matchesId && !matchesPhone && !matchesEmail) {
          return false;
        }
      }

      // 2. Status Filter
      if (filterStatus !== 'all' && item.status !== filterStatus) {
        return false;
      }

      // 3. Course Filter
      if (filterCourse !== 'all' && item.course !== filterCourse) {
        return false;
      }

      // 4. Priority Filter
      if (filterPriority !== 'all' && item.priority !== filterPriority) {
        return false;
      }

      // 5. Staff Filter
      if (filterStaff !== 'all') {
        if (filterStaff === 'unassigned' && item.assignedStaffId !== null) return false;
        if (filterStaff !== 'unassigned' && item.assignedStaffId !== filterStaff) return false;
      }

      return true;
    });
  }, [enquiries, quickSearchQuery, filterStatus, filterCourse, filterPriority, filterStaff]);

  // Sorting
  const sortedEnquiries = useMemo(() => {
    return [...filteredEnquiries].sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'date') {
        comparison = a.date.localeCompare(b.date);
      } else if (sortBy === 'name') {
        comparison = a.fullName.localeCompare(b.fullName);
      } else if (sortBy === 'id') {
        comparison = a.id.localeCompare(b.id);
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [filteredEnquiries, sortBy, sortOrder]);

  // Pagination Slice
  const totalPages = Math.ceil(sortedEnquiries.length / pageSize) || 1;
  const paginatedEnquiries = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedEnquiries.slice(startIndex, startIndex + pageSize);
  }, [sortedEnquiries, currentPage, pageSize]);

  // Reset Filters Handler
  const handleResetFilters = () => {
    setQuickSearchQuery('');
    setFilterStatus('all');
    setFilterCourse('all');
    setFilterPriority('all');
    setFilterStaff('all');
    setSortBy('date');
    setSortOrder('desc');
    setCurrentPage(1);
  };

  // CSV Export for Student Demonstration
  const handleExportCSV = () => {
    if (sortedEnquiries.length === 0) {
      showToast('No records available to export.', 'warning');
      return;
    }

    const headers = [
      'Enquiry ID',
      'Candidate Name',
      'Phone',
      'Email',
      'Course',
      'Qualification',
      'Location',
      'Source',
      'Date',
      'Priority',
      'Status',
      'Assigned Staff',
      'Remarks',
    ];

    const rows = sortedEnquiries.map((e) => {
      const assigned = staff.find((s) => s.id === e.assignedStaffId);
      return [
        e.id,
        `"${e.fullName}"`,
        `"${e.phone}"`,
        `"${e.email}"`,
        `"${e.course}"`,
        `"${e.qualification}"`,
        `"${e.location}"`,
        `"${e.source}"`,
        e.date,
        e.priority,
        e.status,
        `"${assigned ? assigned.name : 'Unassigned'}"`,
        `"${e.remarks.replace(/"/g, '""')}"`,
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ELVARIQ_Enquiries_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Exported ${sortedEnquiries.length} enquiry records as CSV.`, 'success');
  };

  return (
    <div className="space-y-4">
      {/* Top Controls Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={quickSearchQuery}
              onChange={(e) => {
                setQuickSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search candidate name, ID, phone, or email..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-gray-50 border border-gray-200 focus:border-teal-500 rounded-lg outline-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-lg transition-colors whitespace-nowrap"
              title="Export filtered records to CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => setActivePage('new-enquiry')}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-[#14B8A6] hover:bg-teal-600 text-white rounded-lg shadow-xs transition-colors whitespace-nowrap"
            >
              <UserPlus className="w-4 h-4" />
              <span>Register New Enquiry</span>
            </button>
          </div>
        </div>

        {/* Filter Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2.5 pt-2 border-t border-gray-100 text-xs">
          {/* Status Filter */}
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
              Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full p-1.5 text-xs rounded-lg border border-gray-200 bg-white outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="New">New</option>
              <option value="Assigned">Assigned</option>
              <option value="In Follow-up">In Follow-up</option>
              <option value="Converted">Converted</option>
              <option value="Lost">Lost</option>
            </select>
          </div>

          {/* Course Filter */}
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
              Program / Course
            </label>
            <select
              value={filterCourse}
              onChange={(e) => {
                setFilterCourse(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full p-1.5 text-xs rounded-lg border border-gray-200 bg-white outline-none truncate"
            >
              <option value="all">All Programs</option>
              {AVAILABLE_COURSES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
              Priority
            </label>
            <select
              value={filterPriority}
              onChange={(e) => {
                setFilterPriority(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full p-1.5 text-xs rounded-lg border border-gray-200 bg-white outline-none"
            >
              <option value="all">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Assigned Staff Filter */}
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
              Staff Member
            </label>
            <select
              value={filterStaff}
              onChange={(e) => {
                setFilterStaff(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full p-1.5 text-xs rounded-lg border border-gray-200 bg-white outline-none"
            >
              <option value="all">All Staff</option>
              <option value="unassigned">(Unassigned Leads)</option>
              {staff.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By Field */}
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full p-1.5 text-xs rounded-lg border border-gray-200 bg-white outline-none"
            >
              <option value="date">Enquiry Date</option>
              <option value="name">Candidate Name</option>
              <option value="id">Enquiry ID</option>
            </select>
          </div>

          {/* Sort Order Toggle */}
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
              Direction
            </label>
            <button
              onClick={() => setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
              className="w-full p-1.5 text-xs rounded-lg border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-between font-medium text-gray-700"
            >
              <span>{sortOrder === 'asc' ? 'Ascending (A-Z)' : 'Descending (Z-A)'}</span>
              <ArrowUpDown className="w-3 h-3 text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden">
        {/* Table Header Summary */}
        <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between text-xs text-gray-500 bg-gray-50/50">
          <div>
            Showing <span className="font-semibold text-gray-900">{sortedEnquiries.length}</span> of{' '}
            <span className="font-semibold text-gray-900">{enquiries.length}</span> total enquiries
          </div>
          {(quickSearchQuery ||
            filterStatus !== 'all' ||
            filterCourse !== 'all' ||
            filterPriority !== 'all' ||
            filterStaff !== 'all') && (
            <button
              onClick={handleResetFilters}
              className="text-teal-600 hover:text-teal-700 font-semibold flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear Filters</span>
            </button>
          )}
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100 text-gray-500 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Enquiry ID</th>
                <th className="py-3 px-4">Candidate Contact</th>
                <th className="py-3 px-4">Interested Course / Program</th>
                <th className="py-3 px-4">Enquiry Date</th>
                <th className="py-3 px-4">Assigned Staff</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {paginatedEnquiries.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-500">
                    <div className="max-w-xs mx-auto space-y-2">
                      <SlidersHorizontal className="w-8 h-8 text-gray-300 mx-auto" />
                      <p className="font-semibold text-gray-700 text-sm">No enquiries match criteria</p>
                      <p className="text-xs text-gray-400">
                        Try clearing active search keywords or filters to see all student enquiries.
                      </p>
                      <button
                        onClick={handleResetFilters}
                        className="mt-2 px-3 py-1.5 text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg"
                      >
                        Reset All Filters
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedEnquiries.map((enq) => {
                  const assignedMember = staff.find((s) => s.id === enq.assignedStaffId);

                  return (
                    <tr key={enq.id} className="hover:bg-gray-50/70 transition-colors">
                      {/* Enquiry ID */}
                      <td className="py-3 px-4 font-mono font-medium text-gray-900">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setDetailEnquiryId(enq.id)}
                            className="hover:text-teal-600 hover:underline font-semibold"
                          >
                            {enq.id}
                          </button>
                          {!enq.isDemoRecord ? (
                            <span className="text-[9px] font-bold text-teal-700 bg-teal-50 px-1 py-0.2 rounded border border-teal-200">
                              NEW
                            </span>
                          ) : (
                            <span className="text-[9px] text-gray-400 bg-gray-100 px-1 py-0.2 rounded">
                              DEMO
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Candidate Name & Contact */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-gray-900">{enq.fullName}</div>
                        <div className="text-[11px] text-gray-500 font-mono">
                          {enq.phone} · <span className="font-sans truncate">{enq.email}</span>
                        </div>
                      </td>

                      {/* Interested Course */}
                      <td className="py-3 px-4 max-w-xs">
                        <div className="text-gray-900 font-medium truncate">{enq.course}</div>
                        <div className="text-[11px] text-gray-400 truncate">{enq.location}</div>
                      </td>

                      {/* Enquiry Date */}
                      <td className="py-3 px-4 font-mono text-gray-600 whitespace-nowrap">
                        {enq.date}
                      </td>

                      {/* Assigned Staff */}
                      <td className="py-3 px-4">
                        {assignedMember ? (
                          <div className="flex items-center gap-1.5">
                            <span className="font-medium text-gray-900">{assignedMember.name}</span>
                            <span className="text-[10px] text-gray-400">({assignedMember.role})</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => setAssignEnquiryId(enq.id)}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700 underline"
                          >
                            <UserCheck className="w-3 h-3" />
                            <span>Assign Staff</span>
                          </button>
                        )}
                      </td>

                      {/* Priority */}
                      <td className="py-3 px-4">
                        <span
                          className={`text-[11px] font-semibold ${
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

                      {/* Status */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block text-[11px] font-bold ${
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

                      {/* Row Actions */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setDetailEnquiryId(enq.id)}
                            className="p-1.5 text-gray-500 hover:text-teal-600 hover:bg-gray-100 rounded-md transition-colors"
                            title="View Full Details"
                            aria-label={`View details for ${enq.id}`}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setAssignEnquiryId(enq.id)}
                            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-md transition-colors"
                            title="Assign to Staff Member"
                            aria-label={`Assign staff for ${enq.id}`}
                          >
                            <UserCheck className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditEnquiryId(enq.id)}
                            className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                            title="Edit Record"
                            aria-label={`Edit ${enq.id}`}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEnquiryToDelete(enq.id)}
                            className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                            title="Delete Record"
                            aria-label={`Delete ${enq.id}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="px-5 py-3 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-gray-50/50">
          <div className="flex items-center gap-2 text-gray-500">
            <span>Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="p-1 text-xs border border-gray-200 rounded-md bg-white outline-none"
            >
              <option value={5}>5</option>
              <option value={8}>8</option>
              <option value={15}>15</option>
              <option value={25}>25</option>
            </select>
            <span>
              Page {currentPage} of {totalPages}
            </span>
          </div>

          <div className="flex items-center gap-1.5 self-end sm:self-auto">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-md border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="px-2 text-gray-700 font-semibold font-mono">
              {currentPage} / {totalPages}
            </div>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="p-1.5 rounded-md border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {detailEnquiryId && (
        <EnquiryDetailModal
          enquiryId={detailEnquiryId}
          onClose={() => setDetailEnquiryId(null)}
          onOpenEdit={() => {
            const id = detailEnquiryId;
            setDetailEnquiryId(null);
            setEditEnquiryId(id);
          }}
          onOpenAssign={() => {
            const id = detailEnquiryId;
            setDetailEnquiryId(null);
            setAssignEnquiryId(id);
          }}
          onDelete={() => {
            const id = detailEnquiryId;
            setDetailEnquiryId(null);
            setEnquiryToDelete(id);
          }}
        />
      )}

      {editEnquiryId && (
        <EnquiryEditModal
          enquiryId={editEnquiryId}
          onClose={() => setEditEnquiryId(null)}
        />
      )}

      {assignEnquiryId && (
        <AssignStaffModal
          enquiryId={assignEnquiryId}
          onClose={() => setAssignEnquiryId(null)}
        />
      )}

      {/* Confirmation Modal for Deleting Record */}
      <ConfirmationModal
        isOpen={enquiryToDelete !== null}
        title="Delete Enquiry Record?"
        message={`Are you sure you want to delete enquiry record ${enquiryToDelete}? This will remove candidate details and associated follow-up tasks from localStorage.`}
        confirmLabel="Yes, Delete Record"
        cancelLabel="Cancel"
        isDestructive={true}
        onConfirm={() => {
          if (enquiryToDelete) {
            deleteEnquiry(enquiryToDelete);
            setEnquiryToDelete(null);
          }
        }}
        onCancel={() => setEnquiryToDelete(null)}
      />
    </div>
  );
};
