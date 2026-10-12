/**
 * @license
 * ELVARIQ - Enquiry & Relationship Management System
 * Academic Frontend Prototype | IME Subject Case Study
 * 
 * Case Study Page D: Proposed Project Pricing
 * Documents the illustrative academic project cost estimation of ₹11,000,
 * deliverables breakdown, and scope boundaries for diploma evaluation.
 */

import React from 'react';
import { IndianRupee, ShieldAlert, Check, X, Layers, Calculator } from 'lucide-react';

export const ProposedPricing: React.FC = () => {
  const costItems = [
    {
      item: 'UI Design & Information Architecture',
      cost: 3000,
      breakdown: [
        'Brand identity guidelines (Deep Navy #111827, Teal #14B8A6 palette)',
        'Geometric vector logo symbol & typographic hierarchy',
        'Wireframes for 10 modular views across desktop (1440px) & mobile',
        'Component state styling (hover, active, badges, modal backdrops)',
      ],
      timeframe: '1.5 Weeks',
    },
    {
      item: 'Frontend Development & Logic Implementation',
      cost: 6000,
      breakdown: [
        'React 19 SPA architecture with TypeScript interfaces',
        '5 core features (Registration, Management, Assignment, Tasks, Reports)',
        'Live browser localStorage data persistence & reset mechanism',
        'Dynamic multi-criteria search, faceted filtering, and sorting algorithms',
        'Real-time calculated summary statistics and SVG chart visualizers',
      ],
      timeframe: '3 Weeks',
    },
    {
      item: 'Testing, Quality Assurance & Academic Documentation',
      cost: 2000,
      breakdown: [
        'Formal test cases (TC-01, TC-02, TC-03) with interactive test harness',
        '6 evaluation tools matrix (Browser, Functional, Validation, Responsive, Usability, Persistence)',
        'Future relational database schema dictionary (3 SQL tables + ER model)',
        'Academic project case study documentation & print-ready layout',
      ],
      timeframe: '1 Week',
    },
  ];

  const totalCost = costItems.reduce((acc, curr) => acc + curr.cost, 0);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-600 mb-1">
            <span>Case Study Page D</span>
            <span className="text-gray-300">/</span>
            <span>Budgetary Estimation</span>
          </div>
          <h2 className="text-lg font-bold text-gray-900">Illustrative Academic Project Cost</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Hypothetical academic costing model developed for the IME subject case study evaluation.
          </p>
        </div>

        {/* Total Cost Badge */}
        <div className="p-3 bg-gray-900 text-white rounded-xl shadow-xs text-right self-start sm:self-auto min-w-[150px]">
          <span className="text-[10px] text-teal-400 font-bold uppercase tracking-wider block">
            Academic Total
          </span>
          <span className="text-2xl font-black font-mono tracking-tight text-white flex items-center justify-end gap-0.5">
            <span>₹</span>
            <span>{totalCost.toLocaleString('en-IN')}</span>
          </span>
        </div>
      </div>

      {/* Mandatory Academic Disclaimer Box */}
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1 leading-relaxed">
          <h4 className="font-bold text-amber-950">Hypothetical Academic Estimate Disclaimer</h4>
          <p>
            The financial figures presented below represent an <strong>illustrative academic estimate</strong> prepared solely to fulfill the project costing requirements of the diploma syllabus. These figures do <strong>not</strong> reflect official commercial market quotations, enterprise vendor pricing, or binding quotes.
          </p>
          <p className="text-amber-800 text-[11px]">
            Backend database provisioning, server cloud hosting, network egress, enterprise security audits, and production maintenance SLAs are strictly outside the scope of this frontend academic prototype.
          </p>
        </div>
      </div>

      {/* Detailed Cost Breakdown Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/70">
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-teal-600" />
            <h3 className="text-sm font-bold text-gray-900">Itemised Phase Cost Breakdown</h3>
          </div>
          <span className="text-xs font-mono text-gray-500">Currency: Indian Rupee (INR)</span>
        </div>

        <div className="divide-y divide-gray-100">
          {costItems.map((item, idx) => (
            <div key={idx} className="p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-gray-400">0{idx + 1}.</span>
                  <h4 className="text-sm font-bold text-gray-900">{item.item}</h4>
                  <span className="text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                    Est. Duration: {item.timeframe}
                  </span>
                </div>

                <ul className="text-xs text-gray-600 space-y-1 list-disc pl-5">
                  {item.breakdown.map((b, bIdx) => (
                    <li key={bIdx} className="leading-relaxed">
                      {b}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="text-right sm:pl-4 shrink-0">
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Phase Cost</span>
                <span className="text-lg font-bold font-mono text-gray-900 tabular-nums">
                  ₹{item.cost.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          ))}

          {/* Total Row */}
          <div className="p-5 bg-gray-50/80 flex items-center justify-between border-t-2 border-gray-200">
            <div>
              <span className="text-sm font-extrabold text-gray-900 block">
                Total Illustrative Project Cost
              </span>
              <span className="text-xs text-gray-500">
                Covers complete frontend UI, logic, validation, testing, and case study documentation
              </span>
            </div>

            <div className="text-right">
              <span className="text-2xl font-black font-mono text-teal-700">
                ₹{totalCost.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Scope Comparison Matrix: Academic Prototype vs Commercial Enterprise */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-900">Scope Inclusions vs Exclusions</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Clear delineation between deliverables included in this frontend project and external infrastructure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100 text-xs">
          {/* Included in Prototype Scope */}
          <div className="p-5 space-y-3">
            <div className="flex items-center gap-2 text-teal-700 font-bold uppercase tracking-wider text-[11px]">
              <Check className="w-4 h-4 text-teal-600" />
              <span>Included in Academic Prototype (₹11,000)</span>
            </div>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-teal-600 font-bold">✓</span>
                <span>Complete responsive Single Page Application (10 views)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-600 font-bold">✓</span>
                <span>Interactive client-side enquiry registration & validation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-600 font-bold">✓</span>
                <span>Counsellor allocation & follow-up task pipeline simulation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-600 font-bold">✓</span>
                <span>Persistent browser localStorage state with default baseline reset</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-600 font-bold">✓</span>
                <span>Live dynamic metrics, charts, and print-ready report layout</span>
              </li>
            </ul>
          </div>

          {/* Excluded from Prototype Scope */}
          <div className="p-5 space-y-3 bg-gray-50/50">
            <div className="flex items-center gap-2 text-rose-700 font-bold uppercase tracking-wider text-[11px]">
              <X className="w-4 h-4 text-rose-600" />
              <span>Excluded from Prototype (Out of Scope)</span>
            </div>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">✕</span>
                <span>Server-side backend API architecture (Node.js/Django/Go)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">✕</span>
                <span>Production SQL database hosting (PostgreSQL / Cloud SQL)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">✕</span>
                <span>Cryptographic server authentication & OAuth identity provider</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">✕</span>
                <span>Transactional SMS / WhatsApp gateway licensing & carrier fees</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">✕</span>
                <span>Cloud deployment infrastructure, domain DNS, and 24/7 SLA</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
