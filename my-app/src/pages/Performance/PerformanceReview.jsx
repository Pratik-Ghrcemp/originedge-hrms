/**
 * PerformanceReview.jsx — OriginEdge HRMS
 * Employee performance review page with star ratings and color-coded scores.
 *
 * Uses: Card, Table, Filters, Badge (all from shared/components)
 * Place at: src/pages/Performance/PerformanceReview.jsx
 */

import { useState, useMemo } from "react";
import Card from "../../components/shared/Card";
import Table from "../../components/shared/Table";
import Filters from "../../components/shared/Filters";
import Badge from "../../components/shared/Badge";

// ---------------------------------------------------------------------------
// Mock data — 10 employees, mixed ratings, 4 departments
// ---------------------------------------------------------------------------

const MOCK_REVIEWS = [
  {
    id: "EMP001",
    name: "John Doe",
    designation: "Senior Team Lead",
    department: "Engineering",
    rating: 4.9,
    reviewDate: "2026-05-15",
    feedback:
      "Exceptional leadership during the Q1 sprint. Delivered all milestones ahead of schedule and mentored 3 junior devs effectively.",
  },
  {
    id: "EMP002",
    name: "Sarah Wilson",
    designation: "HR Executive",
    department: "Human Resources",
    rating: 4.2,
    reviewDate: "2026-05-10",
    feedback:
      "Strong communication skills and proactive in resolving employee concerns. Onboarding process improved significantly under her watch.",
  },
  {
    id: "EMP003",
    name: "Michael Brown",
    designation: "UI/UX Designer",
    department: "Design",
    rating: 4.7,
    reviewDate: "2026-04-28",
    feedback:
      "Outstanding design quality on the HRMS redesign. Great attention to detail and always incorporates feedback constructively.",
  },
  {
    id: "EMP004",
    name: "Emily Johnson",
    designation: "Project Manager",
    department: "Engineering",
    rating: 3.8,
    reviewDate: "2026-04-20",
    feedback:
      "Good project coordination but needs improvement in deadline tracking. Communication with stakeholders can be more structured.",
  },
  {
    id: "EMP005",
    name: "David Lee",
    designation: "Business Analyst",
    department: "Business Analysis",
    rating: 3.5,
    reviewDate: "2026-04-15",
    feedback:
      "Solid analytical skills but requirement documentation needs to be more thorough. Showed improvement in the last two sprints.",
  },
  {
    id: "EMP006",
    name: "Jessica Taylor",
    designation: "QA Engineer",
    department: "Quality Assurance",
    rating: 4.5,
    reviewDate: "2026-05-05",
    feedback:
      "Thorough testing coverage and excellent bug reporting. Her regression suite caught 3 critical production issues before release.",
  },
  {
    id: "EMP007",
    name: "Ryan Martinez",
    designation: "Frontend Developer",
    department: "Engineering",
    rating: 4.0,
    reviewDate: "2026-03-30",
    feedback:
      "Consistent code quality and good collaboration with design team. Can improve on writing unit tests and documentation.",
  },
  {
    id: "EMP008",
    name: "Priya Sharma",
    designation: "Backend Developer",
    department: "Engineering",
    rating: 4.6,
    reviewDate: "2026-03-25",
    feedback:
      "Excellent API architecture and strong problem-solving skills. Volunteered for on-call duty and resolved 2 critical incidents swiftly.",
  },
  {
    id: "EMP009",
    name: "Kevin Chen",
    designation: "DevOps Engineer",
    department: "Engineering",
    rating: 3.5,
    reviewDate: "2026-03-18",
    feedback:
      "Infrastructure work is reliable but deployment pipelines need optimization. Documentation of runbooks is still incomplete.",
  },
  {
    id: "EMP010",
    name: "Ananya Gupta",
    designation: "UI/UX Designer",
    department: "Design",
    rating: 4.3,
    reviewDate: "2026-04-10",
    feedback:
      "Creative and user-centric approach to design. Prototype iterations are fast and the design system contributions have been valuable.",
  },
];

// ---------------------------------------------------------------------------
// Rating helpers
// ---------------------------------------------------------------------------

// Map numeric rating → Badge status
function ratingToStatus(rating) {
  if (rating >= 4.5) return "Excellent";
  if (rating >= 4.0) return "Good";
  if (rating >= 3.0) return "Average";
  return "Needs Improvement";
}

// Star color by rating
function starColor(rating) {
  if (rating >= 4.5) return "#22C166"; // green
  if (rating >= 4.0) return "#378ADD"; // blue
  if (rating >= 3.0) return "#F9A825"; // yellow
  if (rating >= 2.0) return "#EF9F27"; // orange
  return "#E24B4A"; // red
}

// ---------------------------------------------------------------------------
// StarRating component — half-star support via SVG clip
// ---------------------------------------------------------------------------

function StarRating({ value, max = 5, size = 15 }) {
  const color = starColor(value);
  const stars = [];

  for (let i = 1; i <= max; i++) {
    const fill = Math.min(1, Math.max(0, value - (i - 1))); // 0, 0.5, or 1
    const id = `star-clip-${value}-${i}`; // unique per star

    stars.push(
      <svg
        key={i}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        aria-hidden="true"
        style={{ flexShrink: 0 }}
      >
        <defs>
          <clipPath id={id}>
            <rect x="0" y="0" width={`${fill * 100}%`} height="100%" />
          </clipPath>
        </defs>
        {/* Background star (grey) */}
        <path
          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
          fill="#E0DEDB"
        />
        {/* Foreground star (coloured, clipped to fill%) */}
        <path
          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
          fill={color}
          clipPath={`url(#${id})`}
        />
      </svg>,
    );
  }

  return (
    <div
      style={{ display: "inline-flex", alignItems: "center", gap: 2 }}
      role="img"
      aria-label={`Rating: ${value} out of ${max} stars`}
    >
      {stars}
      <span
        style={{
          marginLeft: 5,
          fontSize: 12,
          fontWeight: 700,
          color,
          minWidth: 28,
        }}
      >
        {value.toFixed(1)}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Avatar
// ---------------------------------------------------------------------------

function Avatar({ name }) {
  const initials =
    name
      ?.split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("") ?? "?";
  const hue = ((name?.charCodeAt(0) ?? 0) * 13) % 360;
  return (
    <div
      aria-hidden="true"
      style={{
        width: 32,
        height: 32,
        borderRadius: "50%",
        flexShrink: 0,
        background: `hsl(${hue},55%,88%)`,
        color: `hsl(${hue},55%,35%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 11.5,
        fontWeight: 700,
        userSelect: "none",
      }}
    >
      {initials}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Filter config
// ---------------------------------------------------------------------------

const FILTER_CONFIG = [
  { type: "dateRange", key: "dateRange", label: "Review Date" },
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
    key: "ratingFilter",
    label: "Rating",
    options: [
      "5 Star (4.5–5.0)",
      "4 Star (4.0–4.4)",
      "3 Star (3.0–3.9)",
      "Below 3",
    ],
    placeholder: "All Ratings",
  },
  {
    type: "dropdown",
    key: "status",
    label: "Performance",
    options: ["Excellent", "Good", "Average", "Needs Improvement"],
    placeholder: "All",
  },
];

// ---------------------------------------------------------------------------
// Table columns
// ---------------------------------------------------------------------------

const COLUMNS = [
  {
    key: "name",
    label: "Employee",
    sortable: true,
    render: (val, row) => (
      <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
        <Avatar name={val} />
        <div>
          <div style={{ fontWeight: 600, fontSize: 13.5, lineHeight: 1.2 }}>
            {val}
          </div>
          <div style={{ fontSize: 11, color: "#888780", marginTop: 2 }}>
            {row.designation}
          </div>
        </div>
      </div>
    ),
  },
  { key: "department", label: "Department", sortable: true },
  {
    key: "rating",
    label: "Rating",
    sortable: true,
    render: (val) => <StarRating value={val} />,
  },
  {
    key: "reviewDate",
    label: "Review Date",
    sortable: true,
    render: (val) => (
      <span style={{ color: "#5F5E5A", fontSize: 13 }}>
        {new Date(val + "T00:00:00").toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </span>
    ),
  },
  {
    key: "feedback",
    label: "Feedback",
    render: (val) => (
      <span
        style={{
          maxWidth: 280,
          display: "block",
          fontSize: 12.5,
          color: "#5F5E5A",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
        title={val}
      >
        {val}
      </span>
    ),
  },
  {
    key: "_status",
    label: "Performance",
    render: (_, row) => <Badge status={ratingToStatus(row.rating)} size="sm" />,
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
        }}
        aria-label={`Actions for ${row.name}`}
      >
        <i className="ti ti-dots-vertical" aria-hidden="true" />
      </button>
    ),
  },
];

// ---------------------------------------------------------------------------
// Filter logic
// ---------------------------------------------------------------------------

function applyFilters(data, filters) {
  return data.filter((row) => {
    if (filters.department && row.department !== filters.department)
      return false;
    if (filters.status && ratingToStatus(row.rating) !== filters.status)
      return false;
    if (filters.ratingFilter) {
      const r = row.rating;
      if (filters.ratingFilter === "5 Star (4.5–5.0)" && !(r >= 4.5))
        return false;
      if (filters.ratingFilter === "4 Star (4.0–4.4)" && !(r >= 4.0 && r < 4.5))
        return false;
      if (filters.ratingFilter === "3 Star (3.0–3.9)" && !(r >= 3.0 && r < 4.0))
        return false;
      if (filters.ratingFilter === "Below 3" && !(r < 3.0)) return false;
    }
    if (filters.dateRange?.from && row.reviewDate < filters.dateRange.from)
      return false;
    if (filters.dateRange?.to && row.reviewDate > filters.dateRange.to)
      return false;
    return true;
  });
}

// ---------------------------------------------------------------------------
// Stats computation
// ---------------------------------------------------------------------------

function computeStats(data) {
  if (!data.length) return { avg: "—", total: 0, depts: 0, topPerformer: "—" };
  const avg = data.reduce((s, r) => s + r.rating, 0) / data.length;
  const depts = new Set(data.map((r) => r.department)).size;
  const topPerformer =
    [...data].sort((a, b) => b.rating - a.rating)[0]?.name ?? "—";
  return { avg: avg.toFixed(1), total: data.length, depts, topPerformer };
}

// ---------------------------------------------------------------------------
// Dept breakdown bar chart (pure CSS)
// ---------------------------------------------------------------------------

function DeptBreakdown({ data }) {
  const deptMap = {};
  data.forEach((r) => {
    if (!deptMap[r.department]) deptMap[r.department] = { sum: 0, count: 0 };
    deptMap[r.department].sum += r.rating;
    deptMap[r.department].count += 1;
  });

  const depts = Object.entries(deptMap)
    .map(([name, { sum, count }]) => ({
      name,
      avg: sum / count,
      count,
    }))
    .sort((a, b) => b.avg - a.avg);

  return (
    <div
      className="pr-dept-card"
      role="region"
      aria-label="Department performance breakdown"
    >
      <div className="pr-dept-title">Department Breakdown</div>
      <div className="pr-dept-list">
        {depts.map(({ name, avg, count }) => (
          <div key={name} className="pr-dept-row">
            <div className="pr-dept-meta">
              <span className="pr-dept-name" title={name}>
                {name}
              </span>
              <span className="pr-dept-avg" style={{ color: starColor(avg) }}>
                ★ {avg.toFixed(1)}
              </span>
            </div>
            <div
              className="pr-dept-bar-bg"
              role="progressbar"
              aria-valuenow={avg}
              aria-valuemin={0}
              aria-valuemax={5}
              aria-label={`${name} average rating ${avg.toFixed(1)}`}
            >
              <div
                className="pr-dept-bar-fill"
                style={{
                  width: `${(avg / 5) * 100}%`,
                  background: starColor(avg),
                }}
              />
            </div>
            <span className="pr-dept-count">
              {count} review{count !== 1 ? "s" : ""}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export default function PerformanceReview() {
  const [filters, setFilters] = useState({});
  const [loading] = useState(false);

  const filtered = useMemo(
    () => applyFilters(MOCK_REVIEWS, filters),
    [filters],
  );
  const stats = useMemo(() => computeStats(filtered), [filtered]);

  return (
    <>
      <PerfStyles />

      <div className="pr-page">
        {/* ── Header ──────────────────────────────────────────────────── */}
        <div className="pr-header">
          <div>
            <h1 className="pr-title">Performance Review</h1>
            <p className="pr-breadcrumb">
              <span>Dashboard</span>
              <i className="ti ti-chevron-right" aria-hidden="true" />
              <span>Performance Review</span>
            </p>
          </div>
        </div>

        {/* ── Stats cards ─────────────────────────────────────────────── */}
        <div
          className="pr-cards"
          role="region"
          aria-label="Performance summary"
        >
          <Card
            label="Average Rating"
            value={`${stats.avg} / 5.0`}
            subLabel="Overall score"
            color="blue"
            icon={<i className="ti ti-star" />}
            loading={loading}
          />
          <Card
            label="Total Reviews"
            value={stats.total}
            subLabel="This quarter"
            color="green"
            icon={<i className="ti ti-clipboard-check" />}
            loading={loading}
          />
          <Card
            label="Departments"
            value={stats.depts}
            subLabel="Reviewed"
            color="purple"
            icon={<i className="ti ti-building" />}
            loading={loading}
          />
          <Card
            label="Top Performer"
            value={stats.topPerformer}
            subLabel="Highest rating"
            color="yellow"
            icon={<i className="ti ti-trophy" />}
            loading={loading}
          />
        </div>

        {/* ── Filters ─────────────────────────────────────────────────── */}
        <Filters
          config={FILTER_CONFIG}
          onApply={(f) => setFilters(f)}
          onReset={() => setFilters({})}
          loading={loading}
        />

        {/* ── Main grid: table + dept breakdown ───────────────────────── */}
        <div className="pr-main-grid">
          {/* Table */}
          <div
            className="pr-table-card"
            role="region"
            aria-label="Performance reviews"
          >
            <div className="pr-table-header">
              <h2 className="pr-table-title">
                Employee Reviews
                <span className="pr-count-badge">{filtered.length}</span>
              </h2>
              {/* Rating legend */}
              <div className="pr-legend" aria-label="Rating legend">
                {[
                  { label: "Excellent", color: "#22C166" },
                  { label: "Good", color: "#378ADD" },
                  { label: "Average", color: "#F9A825" },
                  { label: "Needs Improvement", color: "#E24B4A" },
                ].map(({ label, color }) => (
                  <div key={label} className="pr-legend-item">
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: color,
                        flexShrink: 0,
                        display: "inline-block",
                      }}
                      aria-hidden="true"
                    />
                    <span className="pr-legend-label">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            <Table
              columns={COLUMNS}
              data={[...filtered].sort((a, b) => b.rating - a.rating)}
              loading={loading}
              rowKey="id"
              emptyMessage="No reviews found for the selected filters."
              emptyIcon="star-off"
              skeletonRows={8}
            />
          </div>

          {/* Dept breakdown sidebar */}
          <DeptBreakdown data={filtered} />
        </div>
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

function PerfStyles() {
  return (
    <style>{`
      .pr-page {
        display: flex;
        flex-direction: column;
        gap: 20px;
        padding: 24px;
        max-width: 1440px;
        font-family: 'Inter', system-ui, sans-serif;
      }

      .pr-header { display: flex; align-items: flex-start; justify-content: space-between; flex-wrap: wrap; gap: 14px; }
      .pr-title  { font-size: 24px; font-weight: 700; color: #1C1C1A; margin: 0 0 4px; letter-spacing: -0.02em; }
      .pr-breadcrumb { display: flex; align-items: center; gap: 4px; font-size: 12.5px; color: #888780; margin: 0; }
      .pr-breadcrumb i { font-size: 11px; }

      .pr-cards { display: flex; flex-wrap: wrap; gap: 14px; }
      .pr-cards .oe-card { flex: 1 1 150px; max-width: calc(25% - 11px); min-width: 140px; }

      /* Main grid */
      .pr-main-grid {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 16px;
  align-items: start;
  width: 100%;
}

      /* Table card */
      .pr-table-card {
        background: var(--color-background-primary, #fff);
        border: 0.5px solid rgba(0,0,0,0.08);
        border-radius: 10px;
        overflow: hidden;
      }
      .pr-table-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px 18px 12px;
        border-bottom: 0.5px solid rgba(0,0,0,0.06);
        flex-wrap: wrap;
        gap: 10px;
      }
      .pr-table-title {
        font-size: 15px;
        font-weight: 600;
        color: #1C1C1A;
        margin: 0;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .pr-count-badge {
        font-size: 11.5px;
        font-weight: 500;
        background: #F1EFE8;
        color: #5F5E5A;
        padding: 2px 8px;
        border-radius: 20px;
        border: 0.5px solid rgba(0,0,0,0.08);
      }

      /* Legend */
      .pr-legend {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;
        margin-left: auto;
      }
        
      .pr-legend-item { display: flex; align-items: center; gap: 5px; }
      .pr-legend-label { font-size: 11px; color: #5F5E5A; }

      /* Dept breakdown card */
      .pr-dept-card {
        background: var(--color-background-primary, #fff);
        border: 0.5px solid rgba(0,0,0,0.08);
        border-radius: 10px;
        padding: 16px 18px;
      }
      .pr-dept-title {
        font-size: 14px;
        font-weight: 600;
        color: #1C1C1A;
        margin-bottom: 16px;
      }
      .pr-dept-list { display: flex; flex-direction: column; gap: 14px; }
      .pr-dept-row  { display: flex; flex-direction: column; gap: 5px; }
      .pr-dept-meta {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .pr-dept-name {
        font-size: 12.5px;
        font-weight: 500;
        color: #2C2C2A;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 140px;
      }
      .pr-dept-avg  { font-size: 12.5px; font-weight: 700; }
      .pr-dept-bar-bg {
        height: 7px;
        background: #F1EFE8;
        border-radius: 4px;
        overflow: hidden;
      }
      .pr-dept-bar-fill {
        height: 100%;
        border-radius: 4px;
        transition: width 0.5s ease;
      }
      .pr-dept-count { font-size: 11px; color: #888780; }

      /* Dark mode */
      @media (prefers-color-scheme: dark) {
        .pr-title       { color: #D3D1C7; }
        .pr-table-card  { background: #1C1C1A; border-color: rgba(255,255,255,0.08); }
        .pr-dept-card   { background: #1C1C1A; border-color: rgba(255,255,255,0.08); }
        .pr-table-header { border-color: rgba(255,255,255,0.06); }
        .pr-table-title { color: #D3D1C7; }
        .pr-dept-title  { color: #D3D1C7; }
        .pr-dept-name   { color: #D3D1C7; }
        .pr-count-badge { background: #2C2C28; color: #888780; border-color: rgba(255,255,255,0.08); }
        .pr-legend-label { color: #888780; }
        .pr-dept-bar-bg { background: #2C2C28; }
        .pr-dept-count  { color: #5F5E5A; }
      }

      @media (max-width: 960px) {
        .pr-main-grid { grid-template-columns: 1fr; }
      }
      @media (max-width: 640px) {
        .pr-page  { padding: 16px; gap: 14px; }
        .pr-title { font-size: 20px; }
        .pr-cards .oe-card { flex: 1 1 130px; }
        .pr-legend { display: flex; }
      }
    `}</style>
  );
}
