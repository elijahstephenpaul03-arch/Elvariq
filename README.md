# ELVARIQ — Enquiry & Relationship Management System
### Academic Frontend Prototype | IME Subject Case Study

> **Tagline:** *"Organise. Connect. Progress."*  
> **Brand Palette:** Deep Navy (`#111827`), Teal (`#14B8A6`), Light Grey (`#F3F4F6`), Pure White (`#FFFFFF`).

---

## 1. Project Overview

**ELVARIQ** is a responsive, frontend-only Enquiry and Relationship Management System designed specifically as an academic case study for an **Industrial Management & Engineering (IME)** diploma subject.

The system addresses the organizational challenge of student enquiry tracking in higher education institutions: capturing prospective student inquiries across multiple channels (website, walk-ins, phone calls, expos), assigning them to specific staff counsellors, logging structured interaction follow-ups, and computing live enrollment conversion analytics.

### Academic Architecture Disclaimer
Per the lecturer's instructions, this application is **100% frontend-only**. It contains **no backend server**, **no API server**, and **no external cloud database**. All data persistence is managed using the browser's standard `localStorage` API with immediate synchronization across all 10 project views.

---

## 2. Core Implemented Features

### Feature 1: Enquiry Registration
- Dedicated candidate registration form.
- Automatic sequence ID generation (`ELV-2026-001`, `ELV-2026-002`, ...).
- Comprehensive validation for mandatory fields, email regex, and phone length.
- Pre-filled options for academic programs, locations, prior qualifications, and lead sources.
- Form reset action and instant localStorage commitment.

### Feature 2: Enquiry Management
- High-density data grid displaying all candidate inquiries.
- Live search filtering by candidate name, enquiry ID, phone number, or email.
- Faceted dropdown filters for status, academic program, priority, and assigned staff member.
- Ascending and descending sorting by enquiry date, name, and ID.
- Inspect full record in detail modal, edit existing records, and safely delete with confirmation dialog.
- Export filtered records to standard CSV file.

### Feature 3: Staff Assignment
- Institutional staff directory across demonstration roles: **Administrator**, **Manager**, and **Counsellor**.
- Real-time caseload calculation and capacity threshold indicators per staff member.
- Direct assignment widget to allocate unassigned candidate inquiries to counsellors.
- Automatic synchronization with counsellor task queues and dashboard workload meters.

### Feature 4: Follow-up & Task Pipeline
- Task queue for admissions counsellors tracking scheduled follow-up dates.
- Interactive timeline log for capturing timestamps and counselling notes.
- Follow-up date rescheduling with reason tracking.
- One-click task completion toggle (`Mark Completed` / `Re-open Task`).
- Direct candidate lifecycle stage conversion (`Convert to Enrolled` or `Mark as Lost`).

### Feature 5: Reports & Analytics
- Live dynamic calculation of Total Enquiries, Conversion Rate, Follow-up Completion Rate, and Active Backlog.
- Visual charts for Enquiry Status Distribution, Academic Program Popularity, and Channel Sources.
- Staff-wise conversion efficiency table.
- Print-friendly layout (`window.print()`) for academic submission and offline reporting.

---

## 3. Academic Case Study Pages

### A. About ELVARIQ
- Problem statement, institutional limitations of manual spreadsheets, system objectives, and workflow chain.
- Explanation of frontend prototype constraints and future enterprise roadmap.

### B. Data Fields Documentation
- Future relational database architecture blueprint.
- Data dictionary tables for `tbl_enquiries`, `tbl_staff`, and `tbl_follow_ups` with suggested SQL data types, keys, and constraints.
- Visual Entity-Relationship (ER) model diagram.

### C. Test Cases & Tools for Evaluation
- Interactive test runner for the three mandatory academic test cases:
  - **TC-01:** Valid Enquiry Registration
  - **TC-02:** Staff Assignment Workflow
  - **TC-03:** Invalid Form Submission & Validation Enforcement
- Ability to execute guided test runs or manually log Pass/Fail statuses.
- Evaluation tools matrix covering Browser, Functional, Validation, Responsive, Usability, and Persistence testing.

### D. Proposed Project Pricing
- Clearly labeled **"Illustrative Academic Project Cost"** of **₹11,000**:
  - UI Design & Information Architecture: ₹3,000
  - Frontend Development & Logic Implementation: ₹6,000
  - Testing, QA & Academic Documentation: ₹2,000
- Mandatory academic disclaimer noting that this is a hypothetical student estimate.
- Scope boundary matrix comparing prototype inclusions vs. external infrastructure exclusions.

---

## 4. Project Directory Structure

```text
├── index.html                    # HTML5 entry point with Plus Jakarta Sans typography
├── metadata.json                 # AI Studio applet metadata & title
├── package.json                  # Dependencies (React 19, Tailwind v4, Lucide icons)
├── tsconfig.json                 # TypeScript strict configuration
├── vite.config.ts                # Vite bundler configuration
└── src/
    ├── main.tsx                  # React DOM mount entry point
    ├── index.css                 # Tailwind CSS v4 imports, scrollbar, and print styles
    ├── App.tsx                   # Master app routing & responsive layout
    ├── types/
    │   └── index.ts              # TypeScript interface definitions (Enquiry, Staff, Task, etc.)
    ├── data/
    │   └── initialData.ts        # Baseline demonstration dataset (12 enquiries, 5 staff, tasks)
    ├── services/
    │   └── storage.ts            # LocalStorage read/write/reset services & ID generators
    ├── context/
    │   └── DataContext.tsx       # Global reactive state provider & metric computations
    └── components/
        ├── common/
        │   ├── Logo.tsx          # Geometric vector logo & brand wordmark
        │   ├── Navbar.tsx        # Top bar with breadcrumbs, notifications, and search
        │   ├── Sidebar.tsx       # Collapsible deep-navy (#111827) navigation bar
        │   ├── ConfirmationModal.tsx # Reusable confirmation dialog
        │   └── ToastContainer.tsx    # Toast notification alert manager
        ├── dashboard/
        │   └── DashboardView.tsx # KPI summary cards, SVG charts, and recent enquiries
        ├── enquiries/
        │   ├── EnquiryForm.tsx   # Feature 1: Registration form with strict validation
        │   ├── EnquiryList.tsx   # Feature 2: Data table, filters, sort, and pagination
        │   ├── EnquiryDetailModal.tsx # Full record inspector & history timeline
        │   ├── EnquiryEditModal.tsx   # Record editor
        │   └── AssignStaffModal.tsx   # Feature 3: Counsellor allocation modal
        ├── staff/
        │   └── StaffManagement.tsx    # Feature 3: Staff directory & workload meters
        ├── tasks/
        │   └── TaskManager.tsx        # Feature 4: Follow-up pipeline & notes logs
        ├── reports/
        │   └── ReportsView.tsx        # Feature 5: Performance reports & print layout
        └── academic/
            ├── AboutProject.tsx       # Case Study Page A: Overview & limitations
            ├── DataFieldsDoc.tsx      # Case Study Page B: Relational schema & ER model
            ├── TestCasesRunner.tsx    # Case Study Page C: TC-01 to TC-03 & testing matrix
            └── ProposedPricing.tsx    # Case Study Page D: Illustrative ₹11,000 pricing
```

---

## 5. Running the Application Locally

1. **Clone or navigate** to the project directory:
   ```bash
   cd elvariq
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to:
   ```text
   http://localhost:3000
   ```

5. **Build for production**:
   ```bash
   npm run build
   ```

---

## 6. How to Demonstrate to Your Lecturer

When presenting ELVARIQ during your academic assessment, follow this recommended demonstration sequence:

1. **Dashboard Overview:** Point out the 5 KPI summary cards and explain that the statistics and chart percentages are dynamically derived from the underlying data in browser storage.
2. **Feature 1 (Registration):** Navigate to *New Enquiry*, show the validation safeguards by clicking submit with blank inputs (triggers error prompts), then fill in a real candidate (e.g., *Devika Menon*) and submit. Note the automatically generated enquiry ID.
3. **Feature 2 (Management):** Show how the newly registered record appears immediately at the top of *Manage Enquiries* tagged with the `NEW` indicator. Demonstrate live search, filtering by program, and CSV export.
4. **Feature 3 (Staff Assignment):** Open *Staff Management*, demonstrate the workload balance across Administrator, Manager, and Counsellors, and assign an unassigned enquiry to *Shravani Mam*.
5. **Feature 4 (Task Pipeline):** Switch to *Follow-up Tasks*, locate the assigned task, log a counselling interaction note, reschedule the date, and mark it as completed.
6. **Feature 5 (Reports):** Open *Reports & Analytics* to show how the conversion rate and staff assignment numbers immediately updated. Click *Print / Export Report* to show the print-ready executive view.
7. **Academic Documentation Pages:** Walk through *About ELVARIQ*, the future database dictionary in *Data Fields*, the interactive *Test Cases* runner (run TC-01 to show automated verification), and the *Proposed Pricing* section (illustrative ₹11,000 breakdown).
8. **Reset Baseline:** If the lecturer asks to restart the demonstration, click the *Reset Demo Data* button in the top bar to safely restore the baseline dataset.
