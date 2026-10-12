/**
 * @license
 * ELVARIQ - Enquiry & Relationship Management System
 * Academic Frontend Prototype | IME Subject Case Study
 * 
 * Sidebar Navigation Component
 * Features clean deep-navy (#111827) styling, teal active states (#14B8A6),
 * and links to all 10 project views required by the IME syllabus.
 */

import React from 'react';
import { useData } from '../../context/DataContext';
import { ActivePage } from '../../types';
import { Logo } from './Logo';
import {
  LayoutDashboard,
  UserPlus,
  Users,
  Briefcase,
  CheckSquare,
  BarChart3,
  Database,
  FlaskConical,
  IndianRupee,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

interface NavItemDef {
  id: ActivePage;
  label: string;
  icon: React.ElementType;
  badge?: number | string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}) => {
  const { activePage, setActivePage, metrics, enquiries } = useData();

  const operationsNav: NavItemDef[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'new-enquiry', label: 'New Enquiry', icon: UserPlus },
    {
      id: 'enquiries',
      label: 'Manage Enquiries',
      icon: Users,
      badge: enquiries.length,
    },
    { id: 'staff', label: 'Staff Management', icon: Briefcase },
    {
      id: 'tasks',
      label: 'Follow-up Tasks',
      icon: CheckSquare,
      badge: metrics.pendingTasks > 0 ? metrics.pendingTasks : undefined,
    },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
  ];

  const academicNav: NavItemDef[] = [
    { id: 'data-fields', label: 'Data Fields', icon: Database },
    { id: 'test-cases', label: 'Test Cases', icon: FlaskConical },
    { id: 'pricing', label: 'Proposed Pricing', icon: IndianRupee },
    { id: 'about', label: 'About ELVARIQ', icon: GraduationCap },
  ];

  const handleNavClick = (page: ActivePage) => {
    setActivePage(page);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-gray-950/60 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen transition-all duration-300 flex flex-col bg-[#111827] text-gray-200 border-r border-gray-800 ${
          collapsed ? 'w-20' : 'w-64'
        } ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } shrink-0 select-none`}
      >
        {/* Header / Brand */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-gray-800 shrink-0">
          <Logo collapsed={collapsed} />

          {/* Desktop collapse button */}
          <button
            onClick={onToggleCollapse}
            className="hidden md:flex items-center justify-center w-7 h-7 text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition-colors"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Tagline / Academic Banner */}
        {!collapsed && (
          <div className="px-4 py-2.5 bg-gray-900/60 border-b border-gray-800/80 text-[11px] text-gray-400 font-medium flex items-center justify-between">
            <span className="italic text-teal-400 font-semibold">
              &ldquo;Organise. Connect. Progress.&rdquo;
            </span>
            <span className="text-[10px] text-gray-500 font-mono">IME-2026</span>
          </div>
        )}

        {/* Navigation Links Scrollable Area */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {/* Group 1: Operations */}
          <div>
            {!collapsed && (
              <div className="px-3 mb-2 text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                Core Operations
              </div>
            )}
            <nav className="space-y-1">
              {operationsNav.map((item) => {
                const Icon = item.icon;
                const isActive = activePage === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    title={collapsed ? item.label : undefined}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-[#14B8A6] text-white shadow-xs'
                        : 'text-gray-300 hover:bg-gray-800/70 hover:text-white'
                    } ${collapsed ? 'justify-center' : 'justify-between'}`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon
                        className={`w-4 h-4 shrink-0 ${
                          isActive ? 'text-white' : 'text-gray-400'
                        }`}
                      />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </div>

                    {!collapsed && item.badge !== undefined && (
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full tabular-nums ${
                          isActive
                            ? 'bg-teal-900/40 text-teal-100'
                            : 'bg-gray-800 text-gray-300'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Group 2: IME Academic Case Study */}
          <div>
            {!collapsed && (
              <div className="px-3 mb-2 text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                Case Study Project
              </div>
            )}
            <nav className="space-y-1">
              {academicNav.map((item) => {
                const Icon = item.icon;
                const isActive = activePage === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    title={collapsed ? item.label : undefined}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-[#14B8A6] text-white shadow-xs'
                        : 'text-gray-300 hover:bg-gray-800/70 hover:text-white'
                    } ${collapsed ? 'justify-center' : 'justify-start'}`}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? 'text-white' : 'text-gray-400'
                      }`}
                    />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

      </aside>
    </>
  );
};
