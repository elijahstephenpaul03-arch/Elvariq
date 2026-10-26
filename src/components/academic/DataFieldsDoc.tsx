/**
 * @license
 * ELVARIQ - Enquiry & Relationship Management System
 * Academic Frontend Prototype | IME Subject Case Study
 * 
 * Case Study Page B: Data Fields & Future Database Documentation
 * Architectural data dictionary documenting field names, SQL data types, constraints,
 * and foreign key relationships for future backend migration.
 */

import React from 'react';
import { Database, Table, KeyRound, ShieldAlert, GitFork } from 'lucide-react';

export const DataFieldsDoc: React.FC = () => {
  const enquiryFields = [
    { name: 'enquiry_id', type: 'VARCHAR(20)', constraints: 'PRIMARY KEY', purpose: 'Unique formatted identifier (e.g., ELV-2026-001)' },
    { name: 'full_name', type: 'VARCHAR(100)', constraints: 'NOT NULL', purpose: 'Candidate legal full name' },
    { name: 'phone', type: 'VARCHAR(20)', constraints: 'NOT NULL', purpose: 'Primary mobile contact number with country code' },
    { name: 'email', type: 'VARCHAR(120)', constraints: 'NOT NULL', purpose: 'Candidate email address for formal communication' },
    { name: 'course_name', type: 'VARCHAR(100)', constraints: 'NOT NULL', purpose: 'Interested diploma program or certification discipline' },
    { name: 'qualification', type: 'VARCHAR(60)', constraints: 'NULLABLE', purpose: 'Prior educational credential (e.g., 12th standard, ITI)' },
    { name: 'location_branch', type: 'VARCHAR(80)', constraints: 'NOT NULL', purpose: 'Preferred institute campus or online mode' },
    { name: 'source', type: 'VARCHAR(50)', constraints: 'NOT NULL', purpose: 'Origin channel (Website, Walk-in, Expo, Referral)' },
    { name: 'enquiry_date', type: 'DATE', constraints: 'NOT NULL', purpose: 'Date candidate first expressed interest' },
    { name: 'priority', type: 'VARCHAR(10)', constraints: 'CHECK(High,Med,Low)', purpose: 'Lead qualification level for counsellor urgency' },
    { name: 'status', type: 'VARCHAR(20)', constraints: 'CHECK(New..Lost)', purpose: 'Current admission pipeline lifecycle stage' },
    { name: 'assigned_staff_id', type: 'VARCHAR(20)', constraints: 'FOREIGN KEY -> staff', purpose: 'Assigned counsellor responsible for the lead' },
    { name: 'follow_up_date', type: 'DATE', constraints: 'NULLABLE', purpose: 'Next scheduled interaction target date' },
    { name: 'remarks', type: 'TEXT', constraints: 'NULLABLE', purpose: 'Intake observations, student queries, notes' },
    { name: 'created_at', type: 'TIMESTAMP', constraints: 'DEFAULT NOW()', purpose: 'Audit creation timestamp' },
    { name: 'updated_at', type: 'TIMESTAMP', constraints: 'DEFAULT NOW()', purpose: 'Audit modification timestamp' },
  ];

  const staffFields = [
    { name: 'staff_id', type: 'VARCHAR(20)', constraints: 'PRIMARY KEY', purpose: 'Unique institutional staff member identifier (e.g., STF-101)' },
    { name: 'full_name', type: 'VARCHAR(100)', constraints: 'NOT NULL', purpose: 'Staff member name' },
    { name: 'email', type: 'VARCHAR(120)', constraints: 'UNIQUE, NOT NULL', purpose: 'Official institutional email address' },
    { name: 'role', type: 'VARCHAR(30)', constraints: 'CHECK(Admin,Mgr,Counsellor)', purpose: 'Functional responsibility level' },
    { name: 'department', type: 'VARCHAR(80)', constraints: 'NOT NULL', purpose: 'Academic division or admissions unit' },
    { name: 'contact_number', type: 'VARCHAR(20)', constraints: 'NOT NULL', purpose: 'Direct office extension or phone number' },
  ];

  const followUpFields = [
    { name: 'follow_up_id', type: 'VARCHAR(20)', constraints: 'PRIMARY KEY', purpose: 'Unique task identifier (e.g., TSK-501)' },
    { name: 'enquiry_id', type: 'VARCHAR(20)', constraints: 'FOREIGN KEY -> enquiries', purpose: 'Cascading reference to the candidate enquiry' },
    { name: 'staff_id', type: 'VARCHAR(20)', constraints: 'FOREIGN KEY -> staff', purpose: 'Counsellor assigned to complete the interaction' },
    { name: 'follow_up_date', type: 'DATE', constraints: 'NOT NULL', purpose: 'Target date scheduled for calling or meeting' },
    { name: 'notes', type: 'JSONB / TEXT', constraints: 'NULLABLE', purpose: 'Structured interaction history array with timestamps' },
    { name: 'completion_status', type: 'VARCHAR(20)', constraints: 'CHECK(Pending,Completed,Overdue)', purpose: 'Current execution status of the counselling action' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-600 mb-1">
            <span>Case Study Page B</span>
            <span className="text-gray-300">/</span>
            <span>Relational Schema Blueprint</span>
          </div>
          <h2 className="text-lg font-bold text-gray-900">Database Schema Documentation</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Formal architectural blueprint specifying tables, data types, keys, and constraints for future backend implementation.
          </p>
        </div>

        {/* Cloud SQL Live Status Note */}
        <div className="p-3 bg-teal-50 rounded-lg border border-teal-200 text-xs max-w-sm text-teal-900 flex items-start gap-2">
          <Database className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-tight">
            <strong>Live Relational Engine:</strong> Deployed on Google Cloud SQL (PostgreSQL Developer Edition in region <code>asia-southeast1</code>) via Drizzle ORM and Express REST APIs.
          </p>
        </div>
      </div>

      {/* Relational Entity Relationship Diagram Visualization */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-2xs space-y-4">
        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
          <GitFork className="w-4 h-4 text-teal-600" />
          <span>Entity-Relationship (ER) Architecture</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Staff Entity */}
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-2 text-xs">
            <div className="flex items-center justify-between border-b border-gray-200 pb-2">
              <span className="font-bold text-gray-900">tbl_staff</span>
              <span className="text-[10px] font-mono text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200">
                PARENT ENTITY
              </span>
            </div>
            <div className="text-[11px] font-mono space-y-1 text-gray-600">
              <div className="text-purple-700 font-bold">PK: staff_id</div>
              <div>full_name, email</div>
              <div>role, department</div>
              <div>contact_number</div>
            </div>
            <div className="pt-2 text-[10px] text-gray-400 border-t border-gray-200">
              1 Staff Member can have Many Enquiries (1:N)
            </div>
          </div>

          {/* Enquiry Entity */}
          <div className="p-4 rounded-xl bg-teal-50/50 border border-teal-200 space-y-2 text-xs">
            <div className="flex items-center justify-between border-b border-teal-200 pb-2">
              <span className="font-bold text-teal-900">tbl_enquiries</span>
              <span className="text-[10px] font-mono text-teal-700 bg-white px-1.5 py-0.5 rounded border border-teal-200">
                CORE ENTITY
              </span>
            </div>
            <div className="text-[11px] font-mono space-y-1 text-gray-700">
              <div className="text-teal-800 font-bold">PK: enquiry_id</div>
              <div>full_name, phone, email</div>
              <div>course_name, qualification</div>
              <div>source, status, priority</div>
              <div className="text-purple-700">FK: assigned_staff_id</div>
            </div>
            <div className="pt-2 text-[10px] text-teal-600 border-t border-teal-200">
              1 Enquiry belongs to 1 Staff Member (N:1)
            </div>
          </div>

          {/* Follow-up Entity */}
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-2 text-xs">
            <div className="flex items-center justify-between border-b border-gray-200 pb-2">
              <span className="font-bold text-gray-900">tbl_follow_ups</span>
              <span className="text-[10px] font-mono text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                DEPENDENT ENTITY
              </span>
            </div>
            <div className="text-[11px] font-mono space-y-1 text-gray-600">
              <div className="text-amber-800 font-bold">PK: follow_up_id</div>
              <div className="text-teal-800">FK: enquiry_id</div>
              <div className="text-purple-700">FK: staff_id</div>
              <div>follow_up_date, notes</div>
              <div>completion_status</div>
            </div>
            <div className="pt-2 text-[10px] text-gray-400 border-t border-gray-200">
              1 Enquiry has 1 or Many Follow-up Tasks (1:N)
            </div>
          </div>
        </div>
      </div>

      {/* Table 1: Enquiry Fields Documentation */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/70">
          <div className="flex items-center gap-2">
            <Table className="w-4 h-4 text-teal-600" />
            <h3 className="text-sm font-bold text-gray-900">Table 1: tbl_enquiries Schema Specification</h3>
          </div>
          <span className="text-xs font-mono text-gray-400">16 Columns</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 font-bold uppercase text-[10px] tracking-wider border-b border-gray-200">
                <th className="py-2.5 px-4">Field Name</th>
                <th className="py-2.5 px-4 font-mono">Suggested Data Type</th>
                <th className="py-2.5 px-4">Constraints</th>
                <th className="py-2.5 px-4">Business Purpose / Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-normal">
              {enquiryFields.map((f) => (
                <tr key={f.name} className="hover:bg-gray-50/60">
                  <td className="py-2 px-4 font-mono font-semibold text-gray-900">{f.name}</td>
                  <td className="py-2 px-4 font-mono text-teal-700">{f.type}</td>
                  <td className="py-2 px-4 font-mono text-gray-500 text-[11px]">{f.constraints}</td>
                  <td className="py-2 px-4 text-gray-600">{f.purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Table 2: Staff Fields Documentation */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/70">
          <div className="flex items-center gap-2">
            <Table className="w-4 h-4 text-teal-600" />
            <h3 className="text-sm font-bold text-gray-900">Table 2: tbl_staff Schema Specification</h3>
          </div>
          <span className="text-xs font-mono text-gray-400">6 Columns</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 font-bold uppercase text-[10px] tracking-wider border-b border-gray-200">
                <th className="py-2.5 px-4">Field Name</th>
                <th className="py-2.5 px-4 font-mono">Suggested Data Type</th>
                <th className="py-2.5 px-4">Constraints</th>
                <th className="py-2.5 px-4">Business Purpose / Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {staffFields.map((f) => (
                <tr key={f.name} className="hover:bg-gray-50/60">
                  <td className="py-2 px-4 font-mono font-semibold text-gray-900">{f.name}</td>
                  <td className="py-2 px-4 font-mono text-teal-700">{f.type}</td>
                  <td className="py-2 px-4 font-mono text-gray-500 text-[11px]">{f.constraints}</td>
                  <td className="py-2 px-4 text-gray-600">{f.purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Table 3: Follow-up Fields Documentation */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/70">
          <div className="flex items-center gap-2">
            <Table className="w-4 h-4 text-teal-600" />
            <h3 className="text-sm font-bold text-gray-900">Table 3: tbl_follow_ups Schema Specification</h3>
          </div>
          <span className="text-xs font-mono text-gray-400">6 Columns</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 font-bold uppercase text-[10px] tracking-wider border-b border-gray-200">
                <th className="py-2.5 px-4">Field Name</th>
                <th className="py-2.5 px-4 font-mono">Suggested Data Type</th>
                <th className="py-2.5 px-4">Constraints</th>
                <th className="py-2.5 px-4">Business Purpose / Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {followUpFields.map((f) => (
                <tr key={f.name} className="hover:bg-gray-50/60">
                  <td className="py-2 px-4 font-mono font-semibold text-gray-900">{f.name}</td>
                  <td className="py-2 px-4 font-mono text-teal-700">{f.type}</td>
                  <td className="py-2 px-4 font-mono text-gray-500 text-[11px]">{f.constraints}</td>
                  <td className="py-2 px-4 text-gray-600">{f.purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
