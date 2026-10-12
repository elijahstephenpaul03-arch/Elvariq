/**
 * @license
 * ELVARIQ - Enquiry & Relationship Management System
 * Academic Frontend Prototype | IME Subject Case Study
 * 
 * Feature 1: Enquiry Registration Component
 * Provides complete form controls, strict validation (name, email format, phone digits),
 * auto-generates unique IDs, saves to browser localStorage, and triggers instant system sync.
 */

import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import {
  AVAILABLE_COURSES,
  AVAILABLE_QUALIFICATIONS,
  AVAILABLE_LOCATIONS,
  AVAILABLE_SOURCES,
} from '../../data/initialData';
import { generateNextEnquiryId } from '../../services/storage';
import { EnquiryPriority, EnquiryStatus } from '../../types';
import {
  UserPlus,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

export const EnquiryForm: React.FC = () => {
  const { addEnquiry, enquiries, setActivePage, setAssignEnquiryId, setDetailEnquiryId } = useData();

  // Next ID preview
  const [nextId, setNextId] = useState('');

  useEffect(() => {
    setNextId(generateNextEnquiryId(enquiries));
  }, [enquiries]);

  // Form Field State
  const initialFormState = {
    fullName: '',
    phone: '',
    email: '',
    course: AVAILABLE_COURSES[0],
    qualification: AVAILABLE_QUALIFICATIONS[1], // 12th standard default
    location: AVAILABLE_LOCATIONS[0],
    source: AVAILABLE_SOURCES[0],
    date: new Date().toISOString().split('T')[0],
    priority: 'Medium' as EnquiryPriority,
    status: 'New' as EnquiryStatus,
    remarks: '',
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submittedEnquiryId, setSubmittedEnquiryId] = useState<string | null>(null);

  // Field Validation
  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'fullName':
        if (!value.trim()) return 'Candidate Full Name is required.';
        if (value.trim().length < 3) return 'Name must be at least 3 characters.';
        return '';
      case 'phone':
        if (!value.trim()) return 'Valid contact phone number is required.';
        // Allows digits, spaces, plus, hyphens, min 8 digits
        const digitsOnly = value.replace(/\D/g, '');
        if (digitsOnly.length < 8 || digitsOnly.length > 15) {
          return 'Enter a valid phone number (8–15 digits).';
        }
        return '';
      case 'email':
        if (!value.trim()) return 'Contact email address is required.';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value.trim())) {
          return 'Please provide a valid email format (e.g., student@domain.com).';
        }
        return '';
      case 'course':
        if (!value) return 'Please select an interested course or program.';
        return '';
      case 'date':
        if (!value) return 'Enquiry date is required.';
        return '';
      default:
        return '';
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Real-time validation clearance
    if (errors[name]) {
      const errorMsg = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: errorMsg }));
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const errorMsg = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  const handleReset = () => {
    setFormData(initialFormState);
    setErrors({});
    setSubmittedEnquiryId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Comprehensive validation check across all fields
    const newErrors: Record<string, string> = {
      fullName: validateField('fullName', formData.fullName),
      phone: validateField('phone', formData.phone),
      email: validateField('email', formData.email),
      course: validateField('course', formData.course),
      date: validateField('date', formData.date),
    };

    // Filter out clean fields
    const activeErrors: Record<string, string> = {};
    Object.entries(newErrors).forEach(([key, val]) => {
      if (val) activeErrors[key] = val;
    });

    if (Object.keys(activeErrors).length > 0) {
      setErrors(activeErrors);
      return;
    }

    // Submit and store
    const created = addEnquiry(formData);
    setSubmittedEnquiryId(created.id);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-600 mb-1">
            <span>Feature 1: Ingestion Pipeline</span>
            <span className="text-gray-300">/</span>
            <span>Client Validation</span>
          </div>
          <h2 className="text-lg font-bold text-gray-900">Enquiry Registration Form</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Register new candidate enquiries into ELVARIQ with automatic sequence ID generation.
          </p>
        </div>

        <div className="flex items-center gap-2 p-2 bg-gray-50 border border-gray-200 rounded-lg text-xs self-start sm:self-auto">
          <span className="text-gray-500 font-medium">Next Assigned ID:</span>
          <span className="font-mono font-bold text-teal-700 bg-white px-2 py-0.5 rounded border border-gray-200">
            {nextId}
          </span>
        </div>
      </div>

      {/* Success Notification Banner after submission */}
      {submittedEnquiryId && (
        <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in duration-200">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-teal-900">
                Enquiry Successfully Registered ({submittedEnquiryId})
              </h4>
              <p className="text-xs text-teal-700 mt-0.5">
                The record has been validated and committed to browser localStorage.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                setAssignEnquiryId(submittedEnquiryId);
                setActivePage('enquiries');
              }}
              className="px-3 py-1.5 text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors"
            >
              Assign Staff Member →
            </button>
            <button
              onClick={() => {
                setDetailEnquiryId(submittedEnquiryId);
                setActivePage('enquiries');
              }}
              className="px-3 py-1.5 text-xs font-semibold bg-white border border-teal-300 text-teal-800 hover:bg-teal-100/50 rounded-lg transition-colors"
            >
              View Record
            </button>
            <button
              onClick={handleReset}
              className="px-3 py-1.5 text-xs font-semibold text-teal-700 hover:underline"
            >
              Add Another
            </button>
          </div>
        </div>
      )}

      {/* Main Registration Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden">
        <div className="p-6 space-y-6">
          {/* Section 1: Candidate Basic Information */}
          <div>
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider pb-2 border-b border-gray-100 flex items-center gap-2">
              <span>01. Candidate Contact Details</span>
              <span className="text-[11px] text-rose-500 font-normal">* Mandatory fields</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              {/* Full Name */}
              <div className="space-y-1">
                <label htmlFor="fullName" className="block text-xs font-semibold text-gray-700">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g. Devika Menon"
                  className={`w-full px-3 py-2 text-xs rounded-lg border outline-none transition-colors ${
                    errors.fullName
                      ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500'
                      : 'border-gray-300 focus:border-teal-500 bg-white'
                  }`}
                />
                {errors.fullName && (
                  <p className="text-[11px] text-rose-600 flex items-center gap-1 mt-0.5">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.fullName}</span>
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div className="space-y-1">
                <label htmlFor="phone" className="block text-xs font-semibold text-gray-700">
                  Phone Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g. +91 98470 12345"
                  className={`w-full px-3 py-2 text-xs rounded-lg border outline-none transition-colors ${
                    errors.phone
                      ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500'
                      : 'border-gray-300 focus:border-teal-500 bg-white'
                  }`}
                />
                {errors.phone && (
                  <p className="text-[11px] text-rose-600 flex items-center gap-1 mt-0.5">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.phone}</span>
                  </p>
                )}
              </div>

              {/* Email Address */}
              <div className="space-y-1">
                <label htmlFor="email" className="block text-xs font-semibold text-gray-700">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g. devika.m@example.com"
                  className={`w-full px-3 py-2 text-xs rounded-lg border outline-none transition-colors ${
                    errors.email
                      ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500'
                      : 'border-gray-300 focus:border-teal-500 bg-white'
                  }`}
                />
                {errors.email && (
                  <p className="text-[11px] text-rose-600 flex items-center gap-1 mt-0.5">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.email}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Academic & Program Interest */}
          <div>
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider pb-2 border-b border-gray-100">
              02. Academic Discipline & Preferences
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              {/* Interested Course */}
              <div className="space-y-1">
                <label htmlFor="course" className="block text-xs font-semibold text-gray-700">
                  Interested Course / Program <span className="text-rose-500">*</span>
                </label>
                <select
                  id="course"
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 focus:border-teal-500 bg-white outline-none"
                >
                  {AVAILABLE_COURSES.map((course) => (
                    <option key={course} value={course}>
                      {course}
                    </option>
                  ))}
                </select>
              </div>

              {/* Prior Qualification */}
              <div className="space-y-1">
                <label htmlFor="qualification" className="block text-xs font-semibold text-gray-700">
                  Candidate Qualification
                </label>
                <select
                  id="qualification"
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 focus:border-teal-500 bg-white outline-none"
                >
                  {AVAILABLE_QUALIFICATIONS.map((qual) => (
                    <option key={qual} value={qual}>
                      {qual}
                    </option>
                  ))}
                </select>
              </div>

              {/* Preferred Location / Branch */}
              <div className="space-y-1">
                <label htmlFor="location" className="block text-xs font-semibold text-gray-700">
                  Preferred Campus / Branch
                </label>
                <select
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 focus:border-teal-500 bg-white outline-none"
                >
                  {AVAILABLE_LOCATIONS.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Ingestion Metadata & Categorization */}
          <div>
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider pb-2 border-b border-gray-100">
              03. Ingestion Metadata & Priority
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {/* Enquiry Source */}
              <div className="space-y-1">
                <label htmlFor="source" className="block text-xs font-semibold text-gray-700">
                  Enquiry Source
                </label>
                <select
                  id="source"
                  name="source"
                  value={formData.source}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 focus:border-teal-500 bg-white outline-none"
                >
                  {AVAILABLE_SOURCES.map((src) => (
                    <option key={src} value={src}>
                      {src}
                    </option>
                  ))}
                </select>
              </div>

              {/* Enquiry Date */}
              <div className="space-y-1">
                <label htmlFor="date" className="block text-xs font-semibold text-gray-700">
                  Enquiry Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 focus:border-teal-500 bg-white outline-none font-mono"
                />
              </div>

              {/* Priority */}
              <div className="space-y-1">
                <label htmlFor="priority" className="block text-xs font-semibold text-gray-700">
                  Lead Priority
                </label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 focus:border-teal-500 bg-white outline-none"
                >
                  <option value="High">High Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="Low">Low Priority</option>
                </select>
              </div>

              {/* Initial Status */}
              <div className="space-y-1">
                <label htmlFor="status" className="block text-xs font-semibold text-gray-700">
                  Initial Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 focus:border-teal-500 bg-white outline-none"
                >
                  <option value="New">New (Unassigned)</option>
                  <option value="Assigned">Assigned</option>
                  <option value="In Follow-up">In Follow-up</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 4: Remarks & Initial Notes */}
          <div className="space-y-1">
            <label htmlFor="remarks" className="block text-xs font-semibold text-gray-700">
              Remarks & Intake Observations
            </label>
            <textarea
              id="remarks"
              name="remarks"
              rows={3}
              value={formData.remarks}
              onChange={handleChange}
              placeholder="Candidate query details, specific lab requirements, fee queries, or meeting times..."
              className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 focus:border-teal-500 bg-white outline-none"
            />
          </div>
        </div>

        {/* Form Actions Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Form</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setActivePage('enquiries')}
              className="px-3.5 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 text-xs font-semibold bg-[#14B8A6] hover:bg-teal-600 text-white rounded-lg shadow-xs transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              <span>Submit & Save Enquiry</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
