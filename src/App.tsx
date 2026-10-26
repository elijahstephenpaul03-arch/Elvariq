/**
 * @license
 * ELVARIQ - Enquiry & Relationship Management System
 * Academic Frontend Prototype | IME Subject Case Study
 * 
 * Main Application Root Component
 * Coordinates sidebar navigation, top bar, dynamic page routing,
 * and academic case study components within a single-page architecture.
 */

import React, { useState } from 'react';
import { DataProvider, useData } from './context/DataContext';
import { Sidebar } from './components/common/Sidebar';
import { Navbar } from './components/common/Navbar';
import { ToastContainer } from './components/common/ToastContainer';
import { DashboardView } from './components/dashboard/DashboardView';
import { EnquiryForm } from './components/enquiries/EnquiryForm';
import { EnquiryList } from './components/enquiries/EnquiryList';
import { StaffManagement } from './components/staff/StaffManagement';
import { TaskManager } from './components/tasks/TaskManager';
import { ReportsView } from './components/reports/ReportsView';
import { AboutProject } from './components/academic/AboutProject';
import { DataFieldsDoc } from './components/academic/DataFieldsDoc';
import { TestCasesRunner } from './components/academic/TestCasesRunner';
import { ProposedPricing } from './components/academic/ProposedPricing';

const AppLayout: React.FC = () => {
  const { activePage, setActivePage } = useData();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col md:flex-row text-gray-900 font-sans antialiased">
      {/* Navigation Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Workspace Canvas */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Header */}
        <Navbar onOpenMobileMenu={() => setMobileMenuOpen(true)} />

        {/* Viewport Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activePage === 'dashboard' && <DashboardView />}
          {activePage === 'new-enquiry' && <EnquiryForm />}
          {activePage === 'enquiries' && <EnquiryList />}
          {activePage === 'staff' && <StaffManagement />}
          {activePage === 'tasks' && <TaskManager />}
          {activePage === 'reports' && <ReportsView />}
          {activePage === 'data-fields' && <DataFieldsDoc />}
          {activePage === 'test-cases' && <TestCasesRunner />}
          {activePage === 'pricing' && <ProposedPricing />}
          {activePage === 'about' && <AboutProject />}
        </main>

        {/* Quiet Academic Prototype Footer */}
        <footer className="mt-auto border-t border-gray-200 bg-white py-4 px-6 text-xs text-gray-500 no-print">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-800">ELVARIQ</span>
              <span>·</span>
              <span className="italic text-teal-700 font-medium">
                &ldquo;Organise. Connect. Progress.&rdquo;
              </span>
            </div>

            <div className="flex items-center gap-4 text-[11px] text-gray-400">
              <button
                onClick={() => setActivePage('about')}
                className="hover:text-gray-700 hover:underline"
              >
                Project Documentation
              </button>
              <button
                onClick={() => setActivePage('test-cases')}
                className="hover:text-gray-700 hover:underline"
              >
                Test Cases
              </button>
              <button
                onClick={() => setActivePage('data-fields')}
                className="hover:text-gray-700 hover:underline"
              >
                Database Schema
              </button>
              <span className="font-mono text-gray-400">Full-Stack Cloud SQL v2.0</span>
            </div>
          </div>
        </footer>
      </div>

      {/* Floating Toast Notification Stack */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <DataProvider>
      <AppLayout />
    </DataProvider>
  );
}
