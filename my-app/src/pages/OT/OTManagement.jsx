/**
 * OTManagement.jsx — OriginEdge HRMS
 * Overtime request management page with approve/reject functionality.
 *
 * Uses: Card, Table, Filters, Badge (all from shared/components)
 * Place at: src/pages/OT/OTManagement.jsx
 */

import { useState, useMemo, useCallback, useReducer } from 'react';
import Card    from '../../components/shared/Card';
import Table   from '../../components/shared/Table';
import Filters from '../../components/shared/Filters';
import Badge   from '../../components/shared/Badge';

// ---------------------------------------------------------------------------
// Mock data — 10 OT requests (4 Pending, 4 Approved, 2 Rejected)
// Replace with: const data = await otService.getAll(filters)
// ---------------------------------------------------------------------------

const INITIAL_OT_DATA = [
  { id: 'OT2026-001', name: 'John Doe',       designation: 'Senior Team Lead',  department: 'Engineering',       date: 'May 20, 2026', otHours: '2h 30m', reason: 'Sprint release deployment',        status: 'Pending'  },
  { id: 'OT2026-002', name: 'Sarah Wilson',   designation: 'HR Executive',       department: 'Human Resources',   date: 'May 19, 2026', otHours: '1h 00m', reason: 'Payroll processing deadline',      status: 'Approved' },
  { id: 'OT2026-003', name: 'Michael Brown',  designation: 'UI/UX Designer',     department: 'Design',            date: 'May 18, 2026', otHours: '3h 00m', reason: 'Client presentation assets',       status: 'Approved' },
  { id: 'OT2026-004', name: 'Emily Johnson',  designation: 'Project Manager',    department: 'Engineering',       date: 'May 17, 2026', otHours: '1h 30m', reason: 'Project status report',            status: 'Pending'  },
  { id: 'OT2026-005', name: 'David Lee',      designation: 'Business Analyst',   department: 'Business Analysis', date: 'May 16, 2026', otHours: '2h 00m', reason: 'Requirement documentation review', status: 'Rejected' },
  { id: 'OT2026-006', name: 'Jessica Taylor', designation: 'QA Engineer',        department: 'Quality Assurance', date: 'May 15, 2026', otHours: '1h 45m', reason: 'Pre-release regression testing',   status: 'Approved' },
  { id: 'OT2026-007', name: 'Ryan Martinez',  designation: 'Frontend Developer', department: 'Engineering',       date: 'May 14, 2026', otHours: '2h 15m', reason: 'Critical bug fix – production',    status: 'Pending'  },
  { id: 'OT2026-008', name: 'Priya Sharma',   designation: 'Backend Developer',  department: 'Engineering',       date: 'May 13, 2026', otHours: '3h 30m', reason: 'API integration deadline',         status: 'Approved' },
  { id: 'OT2026-009', name: 'Kevin Chen',     designation: 'DevOps Engineer',    department: 'Engineering',       date: 'May 12, 2026', otHours: '1h 00m', reason: 'Server maintenance window',        status: 'Rejected' },
  { id: 'OT2026-010', name: 'Ananya Gupta',   designation: 'UI/UX Designer',     department: 'Design',            date: 'May 11, 2026', otHours: '2h 00m', reason: 'Design system update',             status: 'Pending'  },
];

// ---------------------------------------------------------------------------
// State reducer — keeps approve/reject logic clean
// ---------------------------------------------------------------------------

function otReducer(state, action) {
  switch (action.type) {
    case 'APPROVE':
      return state.map((r) =>
        r.id === action.id ? { ...r, status: 'Approved' } : r,
      );
    case 'REJECT':
      return state.map((r) =>
        r.id === action.id ? { ...r, status: 'Rejected' } : r,
      );
    default:
      return state;
  }
}

// ---------------------------------------------------------------------------
// Filter config
// ---------------------------------------------------------------------------

const FILTER_CONFIG = [
  { type: 'dateRange', key: 'dateRange', label: 'Date Range' },
  {
    type: 'dropdown', key: 'department', label: 'Department',
    options: ['Engineering', 'Human Resources', 'Design', 'Business Analysis', 'Quality Assurance'],
    placeholder: 'All Departments',
  },
  { type: 'search', key: 'employee', label: 'Employee', placeholder: 'Search employee...' },
];

// ---------------------------------------------------------------------------
// Approve / Reject inline buttons (shown only for Pending rows)
// ---------------------------------------------------------------------------

function ActionCell({ row, onApprove, onReject }) {
  if (row.status !== 'Pending') {
    return <span style={{ color: '#C2C0B4', fontSize: 12 }}>—</span>;
  }
  return (
    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
      <button
        className="ot-action-btn ot-action-btn--approve"
        onClick={(e) => { e.stopPropagation(); onApprove(row.id); }}
        aria-label={`Approve OT request for ${row.name}`}
      >
        <i className="ti ti-check" aria-hidden="true" />
        Approve
      </button>
      <button
        className="ot-action-btn ot-action-btn--reject"
        onClick={(e) => { e.stopPropagation(); onReject(row.id); }}
        aria-label={`Reject OT request for ${row.name}`}
      >
        <i className="ti ti-x" aria-hidden="true" />
        Reject
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Avatar (same as AttendanceReport — extract to shared/ if needed)
// ---------------------------------------------------------------------------

function Avatar({ name }) {
  const initials = name?.split(' ').map((n) => n[0]).slice(0, 2).join('') ?? '?';
  const hue = (name?.charCodeAt(0) ?? 0) * 13 % 360;
  return (
    <div aria-hidden="true" style={{
      width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
      background: `hsl(${hue},55%,88%)`, color: `hsl(${hue},55%,35%)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 11.5, fontWeight: 700, userSelect: 'none',
    }}>
      {initials}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Stats helpers
// ---------------------------------------------------------------------------

function computeStats(data) {
  const totalHours = data.reduce((acc, r) => {
    const [h, m] = r.otHours.replace('h', '').replace('m', '').trim().split(' ').map(Number);
    return acc + (h || 0) + (m || 0) / 60;
  }, 0);
  const hh = Math.floor(totalHours);
  const mm = Math.round((totalHours - hh) * 60);

  return {
    totalHours:  `${hh}h ${mm}m`,
    pending:     data.filter((r) => r.status === 'Pending').length,
    approved:    data.filter((r) => r.status === 'Approved').length,
    rejected:    data.filter((r) => r.status === 'Rejected').length,
  };
}

function applyFilters(data, filters) {
  return data.filter((row) => {
    if (filters.department && row.department !== filters.department) return false;
    if (filters.employee) {
      const q = filters.employee.toLowerCase();
      if (!row.name.toLowerCase().includes(q) && !row.id.toLowerCase().includes(q)) return false;
    }
    return true;
  });
}

// ---------------------------------------------------------------------------
// Confirmation toast (lightweight — no external lib)
// ---------------------------------------------------------------------------

function Toast({ message, type }) {
  if (!message) return null;
  const bg    = type === 'approve' ? '#EDFAF3' : '#FFECEC';
  const color = type === 'approve' ? '#1A7A45' : '#A32D2D';
  const icon  = type === 'approve' ? 'circle-check' : 'circle-x';
  return (
    <div role="alert" aria-live="polite" style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 999,
      display: 'flex', alignItems: 'center', gap: 8,
      background: bg, color, border: `0.5px solid ${color}`,
      padding: '10px 16px', borderRadius: 8,
      fontSize: 13.5, fontWeight: 500, boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
      animation: 'ot-toast-in 0.2s ease',
    }}>
      <i className={`ti ti-${icon}`} style={{ fontSize: 16 }} aria-hidden="true" />
      {message}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function OTManagement() {
  const [otData,  dispatch]   = useReducer(otReducer, INITIAL_OT_DATA);
  const [filters, setFilters] = useState({});
  const [loading]             = useState(false);
  const [toast,   setToast]   = useState(null);

  // Show toast for 2.5s
  const showToast = useCallback((message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  }, []);

  const handleApprove = useCallback((id) => {
    const row = otData.find((r) => r.id === id);
    dispatch({ type: 'APPROVE', id });
    showToast(`OT approved for ${row?.name}`, 'approve');
  }, [otData, showToast]);

  const handleReject = useCallback((id) => {
    const row = otData.find((r) => r.id === id);
    dispatch({ type: 'REJECT', id });
    showToast(`OT rejected for ${row?.name}`, 'reject');
  }, [otData, showToast]);

  const filtered = useMemo(() => applyFilters(otData, filters), [otData, filters]);
  const stats    = useMemo(() => computeStats(otData), [otData]);   // stats from full data

  // Column definitions — defined inside component so callbacks close over handlers
  const columns = useMemo(() => [
    {
      key: 'name', label: 'Employee', sortable: true,
      render: (val, row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <Avatar name={val} />
          <div>
            <div style={{ fontWeight: 600, fontSize: 13.5, lineHeight: 1.2 }}>{val}</div>
            <div style={{ fontSize: 11, color: '#888780', marginTop: 2 }}>{row.designation}</div>
          </div>
        </div>
      ),
    },
    { key: 'id',         label: 'Request ID', sortable: true },
    { key: 'date',       label: 'Date',        sortable: true },
    { key: 'department', label: 'Department',  sortable: true },
    {
      key: 'otHours', label: 'OT Hours', align: 'right', sortable: true,
      render: (val) => (
        <span style={{ fontWeight: 600, color: '#185FA5' }}>{val}</span>
      ),
    },
    {
      key: 'reason', label: 'Reason',
      render: (val) => (
        <span style={{ maxWidth: 220, display: 'block', overflow: 'hidden',
          whiteSpace: 'nowrap', textOverflow: 'ellipsis', color: '#5F5E5A', fontSize: 13 }}
          title={val}>
          {val}
        </span>
      ),
    },
    {
      key: 'status', label: 'Status',
      render: (val) => <Badge status={val} size="sm" />,
    },
    {
      key: '_action', label: 'Action',
      render: (_, row) => (
        <ActionCell row={row} onApprove={handleApprove} onReject={handleReject} />
      ),
    },
  ], [handleApprove, handleReject]);

  const handleApply = useCallback((f) => { setFilters(f); }, []);
  const handleReset = useCallback(()  => { setFilters({}); }, []);

  return (
    <>
      <OTStyles />
      {toast && <Toast message={toast.message} type={toast.type} />}

      <div className="ot-page">

        {/* ── Header ──────────────────────────────────────────────────── */}
        <div className="ot-header">
          <div>
            <h1 className="ot-title">OT Management</h1>
            <p className="ot-breadcrumb">
              <span>Dashboard</span>
              <i className="ti ti-chevron-right" aria-hidden="true" />
              <span>OT Management</span>
            </p>
          </div>
          {/* Pending badge in header for quick visibility */}
          {stats.pending > 0 && (
            <div className="ot-pending-alert" role="status" aria-live="polite">
              <i className="ti ti-clock-exclamation" aria-hidden="true" />
              {stats.pending} request{stats.pending > 1 ? 's' : ''} awaiting approval
            </div>
          )}
        </div>

        {/* ── Stats cards ─────────────────────────────────────────────── */}
        <div className="ot-cards" role="region" aria-label="OT summary">
          <Card
            label="Total OT (Month)"
            value={stats.totalHours}
            subLabel="This month"
            color="blue"
            icon={<i className="ti ti-clock" />}
            loading={loading}
          />
          <Card
            label="Pending"
            value={stats.pending}
            subLabel="Awaiting approval"
            color="orange"
            icon={<i className="ti ti-hourglass" />}
            loading={loading}
          />
          <Card
            label="Approved"
            value={stats.approved}
            subLabel="This month"
            color="green"
            icon={<i className="ti ti-circle-check" />}
            loading={loading}
          />
          <Card
            label="Rejected"
            value={stats.rejected}
            subLabel="This month"
            color="red"
            icon={<i className="ti ti-circle-x" />}
            loading={loading}
          />
        </div>

        {/* ── Filters ─────────────────────────────────────────────────── */}
        <Filters
          config={FILTER_CONFIG}
          onApply={handleApply}
          onReset={handleReset}
          loading={loading}
        />

        {/* ── Table ───────────────────────────────────────────────────── */}
        <div className="ot-table-card" role="region" aria-label="OT requests">
          <div className="ot-table-header">
            <h2 className="ot-table-title">
              OT Requests
              <span className="ot-count-badge">{filtered.length}</span>
            </h2>
            <div className="ot-legend">
              <span className="ot-legend-item"><Badge status="Pending"  size="sm" dot={false} /></span>
              <span className="ot-legend-item"><Badge status="Approved" size="sm" dot={false} /></span>
              <span className="ot-legend-item"><Badge status="Rejected" size="sm" dot={false} /></span>
            </div>
          </div>

          <Table
            columns={columns}
            data={filtered}
            loading={loading}
            rowKey="id"
            emptyMessage="No OT requests found for the selected filters."
            emptyIcon="clock-off"
            skeletonRows={8}
          />

          {/* Simple entry count footer (no pagination needed for 10 records) */}
          {!loading && filtered.length > 0 && (
            <div className="ot-footer">
              Showing {filtered.length} of {otData.length} requests
            </div>
          )}
        </div>

      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

function OTStyles() {
  return (
    <style>{`
      /* Page layout */
      .ot-page {
        display: flex;
        flex-direction: column;
        gap: 20px;
        padding: 24px;
        max-width: 1440px;
        font-family: 'Inter', system-ui, sans-serif;
      }

      /* Header */
      .ot-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 14px;
      }
      .ot-title {
        font-size: 24px;
        font-weight: 700;
        color: #1C1C1A;
        margin: 0 0 4px;
        letter-spacing: -0.02em;
      }
      .ot-breadcrumb {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 12.5px;
        color: #888780;
        margin: 0;
      }
      .ot-breadcrumb i { font-size: 11px; }

      /* Pending alert pill */
      .ot-pending-alert {
        display: inline-flex;
        align-items: center;
        gap: 7px;
        padding: 8px 14px;
        background: #FFF3E0;
        color: #854F0B;
        border: 0.5px solid #FFCC80;
        border-radius: 8px;
        font-size: 13px;
        font-weight: 500;
      }

      /* Stats cards */
      .ot-cards {
        display: flex;
        flex-wrap: wrap;
        gap: 14px;
      }
      .ot-cards .oe-card { flex: 1 1 150px; max-width: calc(25% - 11px); min-width: 140px; }

      /* Table card */
      .ot-table-card {
        background: var(--color-background-primary, #fff);
        border: 0.5px solid rgba(0,0,0,0.08);
        border-radius: 10px;
        overflow: hidden;
      }
      .ot-table-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px 18px 12px;
        border-bottom: 0.5px solid rgba(0,0,0,0.06);
        flex-wrap: wrap;
        gap: 10px;
      }
      .ot-table-title {
        font-size: 15px;
        font-weight: 600;
        color: #1C1C1A;
        margin: 0;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .ot-count-badge {
        font-size: 11.5px;
        font-weight: 500;
        background: #F1EFE8;
        color: #5F5E5A;
        padding: 2px 8px;
        border-radius: 20px;
        border: 0.5px solid rgba(0,0,0,0.08);
      }
      .ot-legend {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
      }
      .ot-legend-item { display: flex; align-items: center; }

      /* Footer */
      .ot-footer {
        padding: 12px 18px;
        font-size: 12.5px;
        color: #888780;
        border-top: 0.5px solid rgba(0,0,0,0.06);
      }

      /* Approve / Reject buttons */
      .ot-action-btn {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        height: 28px;
        padding: 0 10px;
        border-radius: 5px;
        font-size: 12px;
        font-weight: 500;
        font-family: inherit;
        cursor: pointer;
        border: 0.5px solid transparent;
        transition: background 0.12s, opacity 0.12s;
        white-space: nowrap;
      }
      .ot-action-btn i { font-size: 13px; }

      .ot-action-btn--approve {
        background: #EDFAF3;
        color: #1A7A45;
        border-color: #AEECD0;
      }
      .ot-action-btn--approve:hover {
        background: #D4F5E5;
      }

      .ot-action-btn--reject {
        background: #FFECEC;
        color: #A32D2D;
        border-color: #F7BFBF;
      }
      .ot-action-btn--reject:hover {
        background: #FFD9D9;
      }

      .ot-action-btn:focus-visible {
        outline: 2px solid #185FA5;
        outline-offset: 2px;
      }
      .ot-action-btn:active { opacity: 0.8; }

      /* Toast animation */
      @keyframes ot-toast-in {
        from { opacity: 0; transform: translateY(10px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @media (prefers-reduced-motion: reduce) {
        .ot-action-btn, .ot-pending-alert { transition: none; }
      }

      /* Dark mode */
      @media (prefers-color-scheme: dark) {
        .ot-title  { color: #D3D1C7; }
        .ot-table-card { background: #1C1C1A; border-color: rgba(255,255,255,0.08); }
        .ot-table-header { border-color: rgba(255,255,255,0.06); }
        .ot-table-title { color: #D3D1C7; }
        .ot-footer { border-color: rgba(255,255,255,0.06); color: #5F5E5A; }
        .ot-count-badge { background: #2C2C28; color: #888780; border-color: rgba(255,255,255,0.08); }
        .ot-pending-alert { background: #3A1E00; border-color: #7A3F00; }
        .ot-action-btn--approve { background: #0D3322; border-color: #1A5E3A; color: #5DCAA5; }
        .ot-action-btn--approve:hover { background: #174232; }
        .ot-action-btn--reject  { background: #3A1010; border-color: #7A2020; color: #F09595; }
        .ot-action-btn--reject:hover { background: #4A1818; }
      }

      @media (max-width: 768px) {
        .ot-page { padding: 16px; gap: 14px; }
        .ot-title { font-size: 20px; }
        .ot-cards .oe-card { flex: 1 1 130px; }
        .ot-legend { display: none; }
      }
    `}</style>
  );
}
