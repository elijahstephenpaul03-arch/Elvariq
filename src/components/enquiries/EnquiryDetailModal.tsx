/**
 * @license
 * ELVARIQ - Enquiry & Relationship Management System
 * Academic Frontend Prototype | IME Subject Case Study
 * 
 * Enquiry Detail Modal
 * Full-record inspector displaying complete enquiry lifecycle,
 * contact details, academic preference, and related follow-up tasks.
 */

import React from 'react';
import { useData } from '../../context/DataContext';
import {
  X,
  Phone,
  Mail,
  BookOpen,
  MapPin,
  Calendar,
  UserCheck,
  Tag,
  Clock,
  Edit,
  Trash2,
  CheckCircle,
} from 'lucide-react';

interface EnquiryDetailModalProps {
  enquiryId: string;
  onClose: () => void;
  onOpenEdit: () => void;
  onOpenAssign: () => void;
  onDelete: () => void;
}

export const EnquiryDetailModal: React.FC<EnquiryDetailModalProps> = ({
  enquiryId,
  onClose,
  onOpenEdit,
  onOpenAssign,
  onDelete,
}) => {
  const { enquiries, staff, tasks, updateEnquiry } = useData();

  const enquiry = enquiries.find((e) => e.id === enquiryId);
  if (!enquiry) return null;

  const assignedMember = staff.find((s) => s.id === enquiry.assignedStaffId);
  const relatedTask = tasks.find((t) => t.enquiryId === enquiry.id);

  const handleQuickStatusChange = (newStatus: typeof enquiry.status) => {
    updateEnquiry(enquiry.id, { status: newStatus });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-gray-100 flex items-start justify-between bg-gray-50/70">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-teal-800 bg-teal-100/70 px-2 py-0.5 rounded border border-teal-200">
                {enquiry.id}
              </span>
              {!enquiry.isDemoRecord ? (
                <span className="text-[10px] font-bold text-teal-700 bg-white px-2 py-0.5 rounded border border-teal-300">
                  User Created
                </span>
              ) : (
                <span className="text-[10px] font-medium text-gray-500 bg-gray-200/70 px-2 py-0.5 rounded">
                  Demo Baseline
                </span>
              )}
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded ${
                  enquiry.priority === 'High'
                    ? 'text-rose-700 bg-rose-50 border border-rose-200'
                    : enquiry.priority === 'Medium'
                    ? 'text-amber-700 bg-amber-50 border border-amber-200'
                    : 'text-gray-700 bg-gray-100 border border-gray-200'
                }`}
              >
                {enquiry.priority} Priority
              </span>
            </div>
            <h3 className="text-lg font-bold text-gray-900">{enquiry.fullName}</h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Status Quick Bar */}
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <span className="text-gray-600 font-medium">Quick Lifecycle Status:</span>
            <div className="flex flex-wrap items-center gap-1.5">
              {(['New', 'Assigned', 'In Follow-up', 'Converted', 'Lost'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => handleQuickStatusChange(st)}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                    enquiry.status === st
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Contact & Program Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-lg border border-gray-100 bg-gray-50/50 space-y-2">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                Candidate Contact
              </span>
              <div className="flex items-center gap-2 text-gray-800">
                <Phone className="w-4 h-4 text-teal-600 shrink-0" />
                <span className="font-mono">{enquiry.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-800 truncate">
                <Mail className="w-4 h-4 text-teal-600 shrink-0" />
                <span className="truncate">{enquiry.email}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Tag className="w-4 h-4 text-gray-400 shrink-0" />
                <span>Qualification: {enquiry.qualification}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-lg border border-gray-100 bg-gray-50/50 space-y-2">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                Program & Location
              </span>
              <div className="flex items-center gap-2 text-gray-800">
                <BookOpen className="w-4 h-4 text-teal-600 shrink-0" />
                <span className="font-semibold">{enquiry.course}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4 text-teal-600 shrink-0" />
                <span>{enquiry.location}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
                <span className="font-mono">Enquired on: {enquiry.date}</span>
              </div>
            </div>
          </div>

          {/* Assigned Staff Section */}
          <div className="p-4 rounded-lg border border-gray-200 bg-white space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Assigned Staff Counsellor
              </span>
              <button
                onClick={onOpenAssign}
                className="text-xs font-semibold text-teal-600 hover:text-teal-700 underline"
              >
                {assignedMember ? 'Reassign Staff' : '+ Assign Staff Member'}
              </button>
            </div>

            {assignedMember ? (
              <div className="flex items-center gap-3 p-2.5 rounded-lg bg-gray-50 border border-gray-100 text-xs">
                <div className="w-8 h-8 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center shrink-0">
                  {assignedMember.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 truncate">
                    {assignedMember.name}
                  </div>
                  <div className="text-gray-500 text-[11px] truncate">
                    {assignedMember.role} · {assignedMember.department}
                  </div>
                </div>
                <span className="font-mono text-gray-400 text-[11px]">
                  {assignedMember.id}
                </span>
              </div>
            ) : (
              <div className="p-3 text-center text-xs text-amber-700 bg-amber-50 rounded-lg border border-amber-200">
                No staff counsellor assigned yet. Assign a team member to initiate follow-up.
              </div>
            )}
          </div>

          {/* Intake Remarks */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
              Intake Remarks & Observations
            </span>
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-xs text-gray-700 leading-relaxed min-h-[60px]">
              {enquiry.remarks || 'No remarks provided during intake.'}
            </div>
          </div>

          {/* Linked Follow-up Notes Timeline if available */}
          {relatedTask && relatedTask.notes.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                Follow-up Discussion Log ({relatedTask.notes.length})
              </span>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {relatedTask.notes.map((note) => (
                  <div
                    key={note.id}
                    className="p-2.5 bg-gray-50 rounded-lg border border-gray-100 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between text-[11px] text-gray-500">
                      <span className="font-semibold text-gray-800">
                        {note.authorName} ({note.authorRole})
                      </span>
                      <span className="font-mono text-gray-400">
                        {new Date(note.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700 leading-normal">{note.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <button
            onClick={onDelete}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Record</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-semibold text-gray-600 hover:text-gray-800"
            >
              Close
            </button>
            <button
              onClick={onOpenEdit}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-colors"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Edit Details</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
