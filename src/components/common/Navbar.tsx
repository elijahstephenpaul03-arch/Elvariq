/**
 * @license
 * ELVARIQ - Enquiry & Relationship Management System
 * Academic Frontend Prototype | IME Subject Case Study
 * 
 * Top Navigation Bar Component
 * Displays breadcrumbs, quick search, notification dropdown,
 * role switcher, and "Reset Demo Data" action.
 */

import React, { useState, useRef, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { StaffRole, ActivePage } from '../../types';
import { ConfirmationModal } from './ConfirmationModal';
import {
  Menu,
  Search,
  Bell,
  RotateCcw,
  UserCheck,
  CheckCircle2,
  Calendar,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

interface NavbarProps {
  onOpenMobileMenu: () => void;
}

const PAGE_LABELS: Record<ActivePage, { title: string; category: string }> = {
  dashboard: { title: 'Operational Dashboard', category: 'Overview' },
  'new-enquiry': { title: 'Register New Enquiry', category: 'Operations' },
  enquiries: { title: 'Manage Enquiries', category: 'Operations' },
  staff: { title: 'Staff Workload & Assignment', category: 'Operations' },
  tasks: { title: 'Follow-up & Task Pipeline', category: 'Operations' },
  reports: { title: 'Reports & Analytics', category: 'Analytics' },
  'data-fields': { title: 'Database Schema Documentation', category: 'Case Study' },
  'test-cases': { title: 'Test Cases & Verification', category: 'Case Study' },
  pricing: { title: 'Illustrative Project Costing', category: 'Case Study' },
  about: { title: 'About ELVARIQ Project', category: 'Case Study' },
};

export const Navbar: React.FC<NavbarProps> = ({ onOpenMobileMenu }) => {
  const {
    activePage,
    setActivePage,
    quickSearchQuery,
    setQuickSearchQuery,
    currentDemoRole,
    setCurrentDemoRole,
    resetSystemData,
    enquiries,
    tasks,
    setDetailEnquiryId,
  } = useData();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);

  // Close popovers when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (roleRef.current && !roleRef.current.contains(event.target as Node)) {
        setShowRoleMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (activePage !== 'enquiries') {
        setActivePage('enquiries');
      }
    }
  };

  // Recent 3 enquiries for notifications
  const recentEnquiries = enquiries.slice(0, 3);
  const pendingTasksList = tasks.filter((t) => t.status === 'Pending').slice(0, 2);

  const currentMeta = PAGE_LABELS[activePage] || { title: 'Dashboard', category: 'Operations' };

  return (
    <>
      <header className="sticky top-0 z-30 h-16 bg-white border-b border-gray-200 px-4 md:px-6 flex items-center justify-between gap-4 select-none">
        {/* Left: Mobile hamburger & Breadcrumbs */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onOpenMobileMenu}
            className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
              <span>ELVARIQ</span>
              <span className="text-gray-300">/</span>
              <span>{currentMeta.category}</span>
            </div>
            <h1 className="text-sm md:text-base font-bold text-gray-900 truncate tracking-tight">
              {currentMeta.title}
            </h1>
          </div>
        </div>

        {/* Center: Search Box */}
        <div className="hidden lg:flex items-center flex-1 max-w-xs mx-4">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={quickSearchQuery}
              onChange={(e) => {
                setQuickSearchQuery(e.target.value);
                if (activePage !== 'enquiries' && e.target.value.trim() !== '') {
                  setActivePage('enquiries');
                }
              }}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search candidate, ID, phone..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 hover:bg-gray-100/80 focus:bg-white border border-gray-200 focus:border-teal-500 rounded-lg outline-none transition-all placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Right: Actions (Notification, Persona Switcher, Reset Demo Data) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Reset Demo Data Button */}
          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg transition-colors"
            title="Reset demonstration data to original case study state"
          >
            <RotateCcw className="w-3.5 h-3.5 text-gray-600" />
            <span className="hidden sm:inline">Reset Demo Data</span>
          </button>

          {/* Notifications Popover */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifications((prev) => !prev)}
              className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              title="Notifications & Activity Feed"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4" />
              {recentEnquiries.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-teal-500 rounded-full ring-2 ring-white" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                    Recent Enquiries & Follow-ups
                  </span>
                  <span className="text-[10px] text-teal-600 font-semibold bg-teal-50 px-1.5 py-0.5 rounded">
                    Live Local
                  </span>
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
                  {recentEnquiries.map((enq) => (
                    <button
                      key={enq.id}
                      onClick={() => {
                        setDetailEnquiryId(enq.id);
                        setActivePage('enquiries');
                        setShowNotifications(false);
                      }}
                      className="w-full text-left p-3 hover:bg-gray-50 transition-colors flex items-start gap-2.5"
                    >
                      <div className="w-2 h-2 rounded-full bg-teal-500 mt-1.5 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-semibold text-gray-900 truncate">
                            {enq.fullName}
                          </span>
                          <span className="text-[10px] text-gray-400 font-mono">
                            {enq.id}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500 truncate mt-0.5">
                          {enq.course}
                        </p>
                        <span className="text-[10px] text-gray-400">
                          Status: {enq.status} · Source: {enq.source}
                        </span>
                      </div>
                    </button>
                  ))}

                  {pendingTasksList.length > 0 && (
                    <div className="p-3 bg-amber-50/50">
                      <div className="text-[11px] font-semibold text-amber-800 flex items-center gap-1.5 mb-1">
                        <Calendar className="w-3 h-3 text-amber-600" />
                        <span>Upcoming Follow-ups</span>
                      </div>
                      {pendingTasksList.map((t) => (
                        <div key={t.id} className="text-[11px] text-gray-600 truncate py-0.5">
                          Follow-up on <span className="font-mono text-gray-900">{t.scheduledDate}</span> for {t.enquiryId}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="px-3 pt-2 border-t border-gray-100 flex justify-between items-center text-[11px]">
                  <button
                    onClick={() => {
                      setActivePage('enquiries');
                      setShowNotifications(false);
                    }}
                    className="text-teal-600 hover:text-teal-700 font-semibold"
                  >
                    View All Enquiries →
                  </button>
                  <span className="text-gray-400">Academic Demo Data</span>
                </div>
              </div>
            )}
          </div>

          {/* Demonstration Role Switcher */}
          <div className="relative" ref={roleRef}>
            <button
              onClick={() => setShowRoleMenu((prev) => !prev)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 transition-colors text-left"
              title="Switch demonstration role perspective"
              aria-label="Switch demonstration role"
            >
              <div className="w-6 h-6 rounded-md bg-[#111827] text-teal-400 flex items-center justify-center font-bold text-xs shrink-0">
                {currentDemoRole.charAt(0)}
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-semibold text-gray-900 leading-tight">
                  {currentDemoRole}
                </span>
                <span className="text-[10px] text-gray-500 font-medium leading-tight">
                  Demo Perspective
                </span>
              </div>
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-1.5 border-b border-gray-100">
                  <span className="text-[11px] font-bold text-gray-900 uppercase tracking-wider block">
                    Demonstration Role Persona
                  </span>
                  <p className="text-[10px] text-gray-500 mt-0.5 leading-snug">
                    Simulates UI perspective for the lecturer. No backend auth.
                  </p>
                </div>

                <div className="py-1">
                  {(['Administrator', 'Manager', 'Counsellor'] as StaffRole[]).map((role) => (
                    <button
                      key={role}
                      onClick={() => {
                        setCurrentDemoRole(role);
                        setShowRoleMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-gray-50 transition-colors ${
                        currentDemoRole === role
                          ? 'font-bold text-teal-700 bg-teal-50/50'
                          : 'text-gray-700'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span>{role}</span>
                        <span className="text-[10px] text-gray-400 font-normal">
                          {role === 'Administrator' && 'Institutional policy & reports'}
                          {role === 'Manager' && 'Workload & enquiry allocation'}
                          {role === 'Counsellor' && 'Active counselling & task pipeline'}
                        </span>
                      </div>
                      {currentDemoRole === role && (
                        <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Confirmation Modal for Resetting Demo Data */}
      <ConfirmationModal
        isOpen={showResetConfirm}
        title="Reset Demonstration Data?"
        message="This will re-initialize browser localStorage back to the original IME case study baseline dataset. Any custom enquiries or changes added during your evaluation session will be reverted."
        confirmLabel="Reset to Baseline"
        cancelLabel="Keep Current Data"
        isDestructive={true}
        onConfirm={() => {
          resetSystemData();
          setShowResetConfirm(false);
        }}
        onCancel={() => setShowResetConfirm(false)}
      />
    </>
  );
};
