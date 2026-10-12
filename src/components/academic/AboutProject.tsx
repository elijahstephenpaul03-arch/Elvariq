/**
 * @license
 * ELVARIQ - Enquiry & Relationship Management System
 * Academic Frontend Prototype | IME Subject Case Study
 * 
 * Case Study Page A: About the Project
 * Formal academic documentation covering problem statement, system objectives,
 * existing limitations, proposed solution, expected benefits, and future enhancements.
 */

import React from 'react';
import {
  GraduationCap,
  Target,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  Workflow,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export const AboutProject: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Hero Dossier Banner */}
      <div className="bg-[#111827] text-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-800">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-xs font-bold text-teal-400 font-mono uppercase bg-teal-950/80 px-2.5 py-1 rounded border border-teal-800">
            IME Subject Case Study
          </span>
          <span className="text-xs text-gray-400">·</span>
          <span className="text-xs text-gray-300">Diploma Academic Evaluation</span>
          <span className="text-xs text-gray-400">·</span>
          <span className="text-xs text-teal-300 font-semibold italic">
            &ldquo;Organise. Connect. Progress.&rdquo;
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          ELVARIQ — Enquiry & Relationship Management System
        </h1>
        <p className="text-xs sm:text-sm text-gray-300 mt-2 max-w-3xl leading-relaxed">
          ELVARIQ is a frontend web software prototype engineered to address the critical breakdown in student lead capture, counselling follow-ups, and admissions tracking in academic institutions.
        </p>
      </div>

      {/* Grid: Problem Statement vs. Proposed System */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Problem Statement & Limitations */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 text-rose-700">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <h2 className="text-sm font-bold uppercase tracking-wider">
              Problem Statement & Existing Limitations
            </h2>
          </div>

          <p className="text-xs text-gray-600 leading-relaxed">
            In many educational institutes, student enquiries are managed using dispersed manual spreadsheets, paper intake logs, or informal messaging. This causes several organizational bottlenecks:
          </p>

          <ul className="text-xs text-gray-700 space-y-2.5 list-disc pl-4">
            <li>
              <strong>Lead Slippage & Lost Records:</strong> High-intent enquiries from walk-ins or education fairs fail to be recorded or get overwritten accidentally.
            </li>
            <li>
              <strong>Zero Follow-up Visibility:</strong> Department heads and managers have no clear oversight into whether counselling staff contacted prospective candidates on time.
            </li>
            <li>
              <strong>Lack of Accountability:</strong> When multiple counsellors handle admissions without structured allocation, candidate records lack owner responsibility.
            </li>
            <li>
              <strong>Fragmented Reporting:</strong> Conversion rates and channel return-on-investment (website vs. fairs vs. referrals) cannot be accurately determined.
            </li>
          </ul>
        </div>

        {/* Proposed System & Objectives */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 text-teal-700">
            <Lightbulb className="w-5 h-5 shrink-0" />
            <h2 className="text-sm font-bold uppercase tracking-wider">
              Proposed Solution & System Objectives
            </h2>
          </div>

          <p className="text-xs text-gray-600 leading-relaxed">
            ELVARIQ establishes a unified, structured workflow to streamline enquiry ingestion through to enrollment conversion:
          </p>

          <ul className="text-xs text-gray-700 space-y-2.5 list-disc pl-4">
            <li>
              <strong>Standardised Intake:</strong> Capture full candidate identity, academic preference, source, and initial notes with client-side validation.
            </li>
            <li>
              <strong>Explicit Staff Assignment:</strong> Allocate each enquiry directly to a qualified counsellor, balancing institutional caseload.
            </li>
            <li>
              <strong>Counselling Interaction Logs:</strong> Log timestamps, notes, and rescheduled dates for every candidate touchpoint.
            </li>
            <li>
              <strong>Real-Time Analytics:</strong> Dynamically compute pipeline metrics, conversion percentages, and counsellor workload from actual records.
            </li>
          </ul>
        </div>
      </div>

      {/* Complete Workflow Chain */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-2xs space-y-4">
        <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
          <Workflow className="w-4 h-4 text-teal-600" />
          <span>The Complete ELVARIQ Operational Lifecycle</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 pt-2">
          {[
            { step: '01', title: 'Register', desc: 'Capture candidate details with validation & unique ID' },
            { step: '02', title: 'Inspect', desc: 'View records in searchable and filterable data grid' },
            { step: '03', title: 'Assign', desc: 'Allocate enquiry to designated staff counsellor' },
            { step: '04', title: 'Task Queue', desc: 'Auto-generate follow-up item in staff pipeline' },
            { step: '05', title: 'Interact', desc: 'Log counselling discussions & schedule dates' },
            { step: '06', title: 'Convert', desc: 'Mark enrolled and analyze real-time KPI metrics' },
          ].map((item) => (
            <div key={item.step} className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-xs">
              <span className="font-mono text-[10px] font-bold text-teal-600 block">
                STEP {item.step}
              </span>
              <span className="font-bold text-gray-900 block mt-0.5">{item.title}</span>
              <span className="text-[11px] text-gray-500 mt-1 block leading-snug">{item.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scope, Limitations, and Future Enhancements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Prototype Scope & Limitations */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-2xs space-y-3 text-xs">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
            Prototype Scope & Technical Constraints
          </h2>

          <div className="space-y-2 text-gray-600 leading-relaxed">
            <p>
              In strict accordance with the IME diploma project assignment guidelines:
            </p>
            <ul className="space-y-2 list-disc pl-4 text-gray-700">
              <li>
                <strong>Frontend-Only Execution:</strong> Developed exclusively with React, Tailwind CSS, and HTML5 standard web APIs without a backend server or external database.
              </li>
              <li>
                <strong>Client-Side Persistence:</strong> Uses browser <code className="font-mono text-teal-700 bg-teal-50 px-1 rounded">localStorage</code> to maintain state across browser refreshes during evaluations.
              </li>
              <li>
                <strong>Simulated Access Control:</strong> Demonstration roles (Administrator, Manager, Counsellor) illustrate interface perspective only and do not provide cryptographic server-side authentication.
              </li>
            </ul>
          </div>
        </div>

        {/* Future Enhancements */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-2xs space-y-3 text-xs">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
            Future Enterprise Enhancements (Post-Diploma)
          </h2>

          <ul className="space-y-2 list-disc pl-4 text-gray-700 leading-relaxed">
            <li>
              <strong>Relational PostgreSQL Database:</strong> Transition schema design documented on the Data Fields page into production SQL tables.
            </li>
            <li>
              <strong>Role-Based Access Control (RBAC):</strong> Server-side JWT authentication with multi-factor verification for counsellors.
            </li>
            <li>
              <strong>Automated Notifications:</strong> SMS / WhatsApp API triggers to alert candidates of orientation schedules and fee deadlines.
            </li>
            <li>
              <strong>Live Telephony / CTI Integration:</strong> Click-to-call integration allowing counsellors to dial prospects directly from the browser.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
