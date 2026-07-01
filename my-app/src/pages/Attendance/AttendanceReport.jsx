/**
 * AttendanceReport.jsx — OriginEdge HRMS
 * Complete attendance report page — matches mockup exactly.
 *
 * Uses: Card, Table, Filters, Pagination, Badge (all from shared/components)
 *
 * Place at: src/pages/Attendance/AttendanceReport.jsx
 */

import { useState, useMemo, useCallback } from "react";
import Card from "../../components/shared/Card";
import Table from "../../components/shared/Table";
import Filters from "../../components/shared/Filters";
import Pagination from "../../components/shared/Pagination";
import Badge from "../../components/shared/Badge";

// ---------------------------------------------------------------------------
// Mock data — 20 employees
// Replace with: const data = await attendanceService.getAll(filters)
// ---------------------------------------------------------------------------

const MOCK_EMPLOYEES = [
  {
    id: "EMP001",
    name: "John Doe",
    designation: "Senior Team Lead",
    department: "Engineering",
    location: "Bangalore",
    checkIn: "09:02 AM",
    checkOut: "06:05 PM",
    status: "Present",
    workHours: "9h 03m",
    late: "02m",
    earlyExit: "-",
    avatar: null,
  },
  {
    id: "EMP002",
    name: "Sarah Wilson",
    designation: "HR Executive",
    department: "Human Resources",
    location: "Bangalore",
    checkIn: "09:15 AM",
    checkOut: "06:00 PM",
    status: "Late",
    workHours: "8h 45m",
    late: "15m",
    earlyExit: "-",
    avatar: null,
  },
  {
    id: "EMP003",
    name: "Michael Brown",
    designation: "UI/UX Designer",
    department: "Design",
    location: "Mumbai",
    checkIn: "09:01 AM",
    checkOut: "06:10 PM",
    status: "Present",
    workHours: "9h 09m",
    late: "01m",
    earlyExit: "-",
    avatar: null,
  },
  {
    id: "EMP004",
    name: "Emily Johnson",
    designation: "Project Manager",
    department: "Engineering",
    location: "Bangalore",
    checkIn: "-",
    checkOut: "-",
    status: "On Leave",
    workHours: "-",
    late: "-",
    earlyExit: "-",
    avatar: null,
  },
  {
    id: "EMP005",
    name: "David Lee",
    designation: "Business Analyst",
    department: "Business Analysis",
    location: "Delhi",
    checkIn: "09:25 AM",
    checkOut: "05:30 PM",
    status: "Early Exit",
    workHours: "8h 05m",
    late: "25m",
    earlyExit: "30m",
    avatar: null,
  },
  {
    id: "EMP006",
    name: "Jessica Taylor",
    designation: "QA Engineer",
    department: "Quality Assurance",
    location: "Mumbai",
    checkIn: "-",
    checkOut: "-",
    status: "Absent",
    workHours: "-",
    late: "-",
    earlyExit: "-",
    avatar: null,
  },
  {
    id: "EMP007",
    name: "Ryan Martinez",
    designation: "Frontend Developer",
    department: "Engineering",
    location: "Bangalore",
    checkIn: "08:58 AM",
    checkOut: "06:02 PM",
    status: "Present",
    workHours: "9h 04m",
    late: "-",
    earlyExit: "-",
    avatar: null,
  },
  {
    id: "EMP008",
    name: "Priya Sharma",
    designation: "Backend Developer",
    department: "Engineering",
    location: "Delhi",
    checkIn: "09:10 AM",
    checkOut: "06:00 PM",
    status: "Late",
    workHours: "8h 50m",
    late: "10m",
    earlyExit: "-",
    avatar: null,
  },
  {
    id: "EMP009",
    name: "Kevin Chen",
    designation: "DevOps Engineer",
    department: "Engineering",
    location: "Bangalore",
    checkIn: "09:00 AM",
    checkOut: "04:30 PM",
    status: "Early Exit",
    workHours: "7h 30m",
    late: "-",
    earlyExit: "90m",
    avatar: null,
  },
  {
    id: "EMP010",
    name: "Ananya Gupta",
    designation: "UI/UX Designer",
    department: "Design",
    location: "Mumbai",
    checkIn: "-",
    checkOut: "-",
    status: "Absent",
    workHours: "-",
    late: "-",
    earlyExit: "-",
    avatar: null,
  },
  {
    id: "EMP011",
    name: "Lucas Patel",
    designation: "Data Analyst",
    department: "Business Analysis",
    location: "Delhi",
    checkIn: "09:03 AM",
    checkOut: "06:05 PM",
    status: "Present",
    workHours: "9h 02m",
    late: "03m",
    earlyExit: "-",
    avatar: null,
  },
  {
    id: "EMP012",
    name: "Meera Nair",
    designation: "HR Executive",
    department: "Human Resources",
    location: "Bangalore",
    checkIn: "-",
    checkOut: "-",
    status: "On Leave",
    workHours: "-",
    late: "-",
    earlyExit: "-",
    avatar: null,
  },
  {
    id: "EMP013",
    name: "Tom Harris",
    designation: "QA Engineer",
    department: "Quality Assurance",
    location: "Mumbai",
    checkIn: "09:05 AM",
    checkOut: "06:00 PM",
    status: "Present",
    workHours: "8h 55m",
    late: "05m",
    earlyExit: "-",
    avatar: null,
  },
  {
    id: "EMP014",
    name: "Divya Rao",
    designation: "Project Manager",
    department: "Engineering",
    location: "Delhi",
    checkIn: "09:00 AM",
    checkOut: "06:10 PM",
    status: "Present",
    workHours: "9h 10m",
    late: "-",
    earlyExit: "-",
    avatar: null,
  },
  {
    id: "EMP015",
    name: "James Kim",
    designation: "Business Analyst",
    department: "Business Analysis",
    location: "Bangalore",
    checkIn: "09:20 AM",
    checkOut: "06:00 PM",
    status: "Late",
    workHours: "8h 40m",
    late: "20m",
    earlyExit: "-",
    avatar: null,
  },
  {
    id: "EMP016",
    name: "Sneha Iyer",
    designation: "Frontend Developer",
    department: "Engineering",
    location: "Mumbai",
    checkIn: "-",
    checkOut: "-",
    status: "Absent",
    workHours: "-",
    late: "-",
    earlyExit: "-",
    avatar: null,
  },
  {
    id: "EMP017",
    name: "Omar Qureshi",
    designation: "Backend Developer",
    department: "Engineering",
    location: "Delhi",
    checkIn: "08:55 AM",
    checkOut: "06:00 PM",
    status: "Present",
    workHours: "9h 05m",
    late: "-",
    earlyExit: "-",
    avatar: null,
  },
  {
    id: "EMP018",
    name: "Aarti Singh",
    designation: "UI/UX Designer",
    department: "Design",
    location: "Bangalore",
    checkIn: "09:30 AM",
    checkOut: "05:45 PM",
    status: "Early Exit",
    workHours: "8h 15m",
    late: "30m",
    earlyExit: "15m",
    avatar: null,
  },
  {
    id: "EMP019",
    name: "Nathan Brooks",
    designation: "DevOps Engineer",
    department: "Engineering",
    location: "Mumbai",
    checkIn: "-",
    checkOut: "-",
    status: "On Leave",
    workHours: "-",
    late: "-",
    earlyExit: "-",
    avatar: null,
  },
  {
    id: "EMP020",
    name: "Ritu Verma",
    designation: "Data Analyst",
    department: "Business Analysis",
    location: "Delhi",
    checkIn: "09:02 AM",
    checkOut: "06:00 PM",
    status: "Present",
    workHours: "8h 58m",
    late: "02m",
    earlyExit: "-",
    avatar: null,
  },
];

// ---------------------------------------------------------------------------
// Filter config — matches mockup exactly
// ---------------------------------------------------------------------------

const FILTER_CONFIG = [
  {
    type: "dateRange",
    key: "dateRange",
    label: "Date Range",
  },
  {
    type: "dropdown",
    key: "department",
    label: "Department",
    options: [
      "Engineering",
      "Human Resources",
      "Design",
      "Business Analysis",
      "Quality Assurance",
    ],
    placeholder: "All Departments",
  },
  {
    type: "dropdown",
    key: "designation",
    label: "Designation",
    options: [
      "Senior Team Lead",
      "HR Executive",
      "UI/UX Designer",
      "Project Manager",
      "Business Analyst",
      "QA Engineer",
      "Frontend Developer",
      "Backend Developer",
      "DevOps Engineer",
      "Data Analyst",
    ],
    placeholder: "All Designations",
  },
  {
    type: "dropdown",
    key: "location",
    label: "Location",
    options: ["Bangalore", "Mumbai", "Delhi"],
    placeholder: "All Locations",
  },
  {
    type: "search",
    key: "employee",
    label: "Employee",
    placeholder: "Search employee...",
  },
];

// ---------------------------------------------------------------------------
// Table column definitions
// ---------------------------------------------------------------------------

const COLUMNS = [
  {
    key: "name",
    label: "Employee",
    sortable: true,
    render: (val, row) => (
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Avatar name={val} />
        <div>
          <div
            style={{
              fontWeight: 600,
              fontSize: 13.5,
              color: "inherit",
              lineHeight: 1.2,
            }}
          >
            {val}
          </div>
          <div style={{ fontSize: 11, color: "#888780", marginTop: 2 }}>
            {row.designation}
          </div>
        </div>
      </div>
    ),
  },
  { key: "id", label: "Employee ID", sortable: true },
  { key: "department", label: "Department", sortable: true },
  {
    key: "checkIn",
    label: "Check In",
    render: (val) => (
      <span
        style={{
          color: val === "-" ? "#888780" : "#22C166",
          fontWeight: val === "-" ? 400 : 500,
        }}
      >
        {val}
      </span>
    ),
  },
  {
    key: "checkOut",
    label: "Check Out",
    render: (val) => (
      <span
        style={{
          color: val === "-" ? "#888780" : "#378ADD",
          fontWeight: val === "-" ? 400 : 500,
        }}
      >
        {val}
      </span>
    ),
  },
  {
    key: "status",
    label: "Status",
    render: (val) => <Badge status={val} size="sm" />,
  },
  { key: "workHours", label: "Work Hours", align: "right", sortable: true },
  {
    key: "late",
    label: "Late",
    align: "right",
    render: (val) => (
      <span
        style={{
          color: val !== "-" ? "#EF9F27" : "#888780",
          fontWeight: val !== "-" ? 600 : 400,
        }}
      >
        {val}
      </span>
    ),
  },
  {
    key: "earlyExit",
    label: "Early Exit",
    align: "right",
    render: (val) => (
      <span
        style={{
          color: val !== "-" ? "#7F77DD" : "#888780",
          fontWeight: val !== "-" ? 600 : 400,
        }}
      >
        {val}
      </span>
    ),
  },
  {
    key: "_action",
    label: "Action",
    align: "center",
    render: (_, row) => (
      <button
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#888780",
          fontSize: 18,
          padding: "2px 6px",
          borderRadius: 4,
          lineHeight: 1,
        }}
        aria-label={`Actions for ${row.name}`}
        title="More actions"
      >
        <i className="ti ti-dots-vertical" aria-hidden="true" />
      </button>
    ),
  },
];

// ---------------------------------------------------------------------------
// Tiny Avatar component
// ---------------------------------------------------------------------------

function Avatar({ name }) {
  const initials =
    name
      ?.split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("") ?? "?";
  const hue = (name?.charCodeAt(0) * 13) % 360 ?? 0;
  return (
    <div
      aria-hidden="true"
      style={{
        width: 34,
        height: 34,
        borderRadius: "50%",
        flexShrink: 0,
        background: `hsl(${hue}, 55%, 88%)`,
        color: `hsl(${hue}, 55%, 35%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 12,
        fontWeight: 700,
        userSelect: "none",
      }}
    >
      {initials}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Excel export (placeholder — swap in xlsx util later)
// ---------------------------------------------------------------------------

function exportToExcel(data) {
  // TODO: import { exportExcel } from '../../utils/exportExcel';
  // exportExcel(data, 'attendance_report');
  alert(
    `Export triggered for ${data.length} records.\nWire up exportExcel util from src/utils/exportExcel.js`,
  );
}

// ---------------------------------------------------------------------------
// Stats computation
// ---------------------------------------------------------------------------

function computeStats(data) {
  const total = data.length;
  const present = data.filter((r) => r.status === "Present").length;
  const absent = data.filter((r) => r.status === "Absent").length;
  const onLeave = data.filter((r) => r.status === "On Leave").length;
  const late = data.filter((r) => r.status === "Late").length;
  const earlyEx = data.filter((r) => r.status === "Early Exit").length;
  const pct = (n) => (total ? `${((n / total) * 100).toFixed(2)}%` : "0%");
  return { total, present, absent, onLeave, late, earlyEx, pct };
}

// ---------------------------------------------------------------------------
// Filter logic (client-side; swap for API call when backend ready)
// ---------------------------------------------------------------------------

function applyFilters(data, filters) {
  return data.filter((row) => {
    if (filters.department && row.department !== filters.department)
      return false;
    if (filters.designation && row.designation !== filters.designation)
      return false;
    if (filters.location && row.location !== filters.location) return false;
    if (filters.employee) {
      const q = filters.employee.toLowerCase();
      if (
        !row.name.toLowerCase().includes(q) &&
        !row.id.toLowerCase().includes(q)
      )
        return false;
    }
    // dateRange filter would hit backend in production; skipped for mock
    return true;
  });
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default function AttendanceReport() {
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading] = useState(false); // flip to true while fetching
  const [selected, setSelected] = useState([]);

  // Filtered + paginated data
  const filtered = useMemo(
    () => applyFilters(MOCK_EMPLOYEES, filters),
    [filters],
  );
  const stats = useMemo(() => computeStats(filtered), [filtered]);

  const paginated = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, page, rowsPerPage]);

  const handleApply = useCallback((f) => {
    setFilters(f);
    setPage(1);
    setSelected([]);
  }, []);

  const handleReset = useCallback(() => {
    setFilters({});
    setPage(1);
    setSelected([]);
  }, []);

  // Selection handlers
  const handleSelectRow = useCallback((key, checked) => {
    setSelected((prev) =>
      checked ? [...prev, key] : prev.filter((k) => k !== key),
    );
  }, []);

  const handleSelectAll = useCallback(
    (checked) => {
      setSelected(checked ? paginated.map((r) => r.id) : []);
    },
    [paginated],
  );

  return (
    <>
      <AttendancePageStyles />

      <div className="ar-page">
        {/* ── Page header ─────────────────────────────────────────────── */}
        <div className="ar-header">
          <div>
            <h1 className="ar-title">Attendance Report</h1>
            <p className="ar-breadcrumb">
              <span>Dashboard</span>
              <i className="ti ti-chevron-right" aria-hidden="true" />
              <span>Attendance Report</span>
            </p>
          </div>
          <button
            className="ar-export-btn"
            onClick={() => exportToExcel(filtered)}
            disabled={filtered.length === 0}
            aria-label="Export attendance report to Excel"
          >
            <i className="ti ti-download" aria-hidden="true" />
            Export Report
          </button>
        </div>

        {/* ── Stats cards ─────────────────────────────────────────────── */}
        <div className="ar-cards" role="region" aria-label="Attendance summary">
          <Card
            label="Total Employees"
            value={stats.total}
            subLabel="Employees"
            color="blue"
            loading={loading}
            icon={<i className="ti ti-users" />}
          />
          <Card
            label="Present"
            value={stats.present}
            percentage={stats.pct(stats.present)}
            color="green"
            loading={loading}
            icon={<i className="ti ti-circle-check" />}
          />
          <Card
            label="Absent"
            value={stats.absent}
            percentage={stats.pct(stats.absent)}
            color="red"
            loading={loading}
            icon={<i className="ti ti-user-x" />}
          />
          <Card
            label="On Leave"
            value={stats.onLeave}
            percentage={stats.pct(stats.onLeave)}
            color="yellow"
            loading={loading}
            icon={<i className="ti ti-calendar-event" />}
          />
          <Card
            label="Late"
            value={stats.late}
            percentage={stats.pct(stats.late)}
            color="orange"
            loading={loading}
            icon={<i className="ti ti-clock-exclamation" />}
          />
          <Card
            label="Early Exit"
            value={stats.earlyEx}
            percentage={stats.pct(stats.earlyEx)}
            color="purple"
            loading={loading}
            icon={<i className="ti ti-logout" />}
          />
        </div>

        {/* ── Filters ─────────────────────────────────────────────────── */}
        <Filters
          config={FILTER_CONFIG}
          onApply={handleApply}
          onReset={handleReset}
          loading={loading}
          initialValues={{ dateRange: { from: "", to: "" } }}
        />

        {/* ── Table section ───────────────────────────────────────────── */}
        <div
          className="ar-table-card"
          role="region"
          aria-label="Attendance details"
        >
          <div className="ar-table-header">
            <h2 className="ar-table-title">
              Attendance Details
              {selected.length > 0 && (
                <span className="ar-selection-badge" aria-live="polite">
                  {selected.length} selected
                </span>
              )}
            </h2>
            {selected.length > 0 && (
              <button
                className="ar-clear-selection"
                onClick={() => setSelected([])}
              >
                Clear selection
              </button>
            )}
          </div>

          <Table
            columns={COLUMNS}
            data={paginated}
            loading={loading}
            rowKey="id"
            selectable
            selectedRows={selected}
            onSelectRow={handleSelectRow}
            onSelectAll={handleSelectAll}
            emptyMessage="No attendance records found for the selected filters."
            emptyIcon="calendar-off"
            skeletonRows={10}
          />

          <Pagination
            total={filtered.length}
            currentPage={page}
            rowsPerPage={rowsPerPage}
            onPageChange={setPage}
            onRowsPerPageChange={(r) => {
              setRowsPerPage(r);
              setPage(1);
            }}
            loading={loading}
          />
        </div>
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Page-level styles
// ---------------------------------------------------------------------------

function AttendancePageStyles() {
  return (
    <style>{`
      .ar-page {
        display: flex;
        flex-direction: column;
        gap: 20px;
        padding: 24px;
        max-width: 1440px;
        font-family: 'Inter', system-ui, sans-serif;
      }

      /* Header */
      .ar-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 16px;
        flex-wrap: wrap;
      }
      .ar-title {
        font-size: 24px;
        font-weight: 700;
        color: #1C1C1A;
        margin: 0 0 4px;
        letter-spacing: -0.02em;
      }
      .ar-breadcrumb {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 12.5px;
        color: #888780;
        margin: 0;
      }
      .ar-breadcrumb i { font-size: 11px; }

      .ar-export-btn {
        display: inline-flex;
        align-items: center;
        gap: 7px;
        height: 38px;
        padding: 0 16px;
        background: #1B4F8A;
        color: #fff;
        border: none;
        border-radius: 7px;
        font-size: 13.5px;
        font-weight: 500;
        cursor: pointer;
        font-family: inherit;
        transition: background 0.15s;
        white-space: nowrap;
        flex-shrink: 0;
      }
      .ar-export-btn:hover:not(:disabled) { background: #174276; }
      .ar-export-btn:disabled { opacity: 0.45; cursor: not-allowed; }
      .ar-export-btn:focus-visible { outline: 2px solid #185FA5; outline-offset: 2px; }

      /* Stats cards row */
      .ar-cards {
        display: flex;
        flex-wrap: wrap;
        gap: 14px;
      }
      .ar-cards { display: flex; flex-wrap: wrap; gap: 14px; }
.ar-cards .oe-card { flex: 1 1 140px; max-width: calc(16.66% - 12px); min-width: 130px; }

      /* Table card */
      .ar-table-card {
        background: var(--color-background-primary, #fff);
        border: 0.5px solid rgba(0,0,0,0.08);
        border-radius: 10px;
        overflow: hidden;
      }
      .ar-table-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px 18px 12px;
        border-bottom: 0.5px solid rgba(0,0,0,0.06);
        gap: 12px;
        flex-wrap: wrap;
      }
      .ar-table-title {
        font-size: 15px;
        font-weight: 600;
        color: #1C1C1A;
        margin: 0;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .ar-selection-badge {
        font-size: 11.5px;
        font-weight: 500;
        background: #E6F1FB;
        color: #185FA5;
        padding: 2px 8px;
        border-radius: 20px;
        border: 0.5px solid #B5D4F4;
      }
      .ar-clear-selection {
        font-size: 12.5px;
        color: #185FA5;
        background: none;
        border: none;
        cursor: pointer;
        padding: 0;
        font-family: inherit;
        text-decoration: underline;
      }
      .ar-clear-selection:hover { color: #174276; }

      /* Dark mode */
      @media (prefers-color-scheme: dark) {
        .ar-title { color: #D3D1C7; }
        .ar-table-card { background: #1C1C1A; border-color: rgba(255,255,255,0.08); }
        .ar-table-header { border-color: rgba(255,255,255,0.06); }
        .ar-table-title { color: #D3D1C7; }
        .ar-breadcrumb { color: #5F5E5A; }
        .ar-selection-badge { background: #04233A; border-color: #0C3A6A; }
      }

      @media (max-width: 768px) {
        .ar-page { padding: 16px; gap: 14px; }
        .ar-cards .oe-card { flex: 1 1 120px; }
        .ar-title { font-size: 20px; }
      }
    `}</style>
  );
}
