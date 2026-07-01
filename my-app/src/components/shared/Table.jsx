/**
 * Table.jsx — OriginEdge HRMS
 * Reusable data table component for Person 1 modules
 * (Attendance, OT, Performance, Holidays)
 *
 * Props:
 *   columns       {Array}    Required. Column definitions:
 *                            [{ key, label, sortable?, width?, align?, render? }]
 *   data          {Array}    Required. Array of row objects.
 *   loading       {boolean}  Shows skeleton rows when true.
 *   selectable    {boolean}  Enables row checkboxes. Default: false.
 *   selectedRows  {Array}    Array of selected row keys.
 *   onSelectRow   {Function} (key, checked) => void
 *   onSelectAll   {Function} (checked) => void
 *   rowKey        {string}   Field to use as unique row key. Default: 'id'.
 *   sortConfig    {Object}   { key, direction: 'asc'|'desc' }
 *   onSort        {Function} ({ key, direction }) => void
 *   emptyMessage  {string}   Custom empty state message.
 *   emptyIcon     {string}   Tabler icon name for empty state. Default: 'table-off'.
 *   skeletonRows  {number}   How many skeleton rows to show. Default: 8.
 *   stickyHeader  {boolean}  Makes header sticky on scroll. Default: false.
 *   onRowClick    {Function} (row) => void  Optional row click handler.
 *   className     {string}   Extra class on the outer wrapper.
 */

import { useState, useCallback } from 'react';
import PropTypes from 'prop-types';

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/** Sort icon — shows current direction or neutral chevrons */
function SortIcon({ columnKey, sortConfig }) {
  const isActive = sortConfig?.key === columnKey;
  const dir = sortConfig?.direction;

  return (
    <span
      className="table-sort-icon"
      aria-hidden="true"
    >
      <svg
        width="12"
        height="16"
        viewBox="0 0 12 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Up chevron */}
        <path
          d="M6 2L10 7H2L6 2Z"
          fill={isActive && dir === 'asc' ? 'var(--color-up-active)' : 'var(--color-chevron-inactive)'}
        />
        {/* Down chevron */}
        <path
          d="M6 14L2 9H10L6 14Z"
          fill={isActive && dir === 'desc' ? 'var(--color-up-active)' : 'var(--color-chevron-inactive)'}
        />
      </svg>
    </span>
  );
}

SortIcon.propTypes = {
  columnKey: PropTypes.string.isRequired,
  sortConfig: PropTypes.shape({
    key: PropTypes.string,
    direction: PropTypes.oneOf(['asc', 'desc']),
  }),
};


/** Single skeleton row — shimmer placeholder while data loads */
function SkeletonRow({ colCount, selectable }) {
  return (
    <tr className="table-skeleton-row" aria-hidden="true">
      {selectable && (
        <td className="table-cell table-cell--checkbox">
          <span className="skeleton skeleton--checkbox" />
        </td>
      )}
      {Array.from({ length: colCount }).map((_, i) => (
        <td key={i} className="table-cell">
          <span
            className="skeleton"
            style={{ width: i === 0 ? '60%' : i % 3 === 0 ? '40%' : '55%' }}
          />
        </td>
      ))}
    </tr>
  );
}

SkeletonRow.propTypes = {
  colCount: PropTypes.number.isRequired,
  selectable: PropTypes.bool,
};


/** Empty state — shown when data is [] and not loading */
function EmptyState({ message, iconName, colSpan }) {
  return (
    <tr>
      <td colSpan={colSpan} className="table-empty-cell">
        <div className="table-empty-content">
          <i
            className={`ti ti-${iconName}`}
            style={{ fontSize: 36, opacity: 0.25 }}
            aria-hidden="true"
          />
          <p className="table-empty-message">{message}</p>
        </div>
      </td>
    </tr>
  );
}

EmptyState.propTypes = {
  message: PropTypes.string.isRequired,
  iconName: PropTypes.string.isRequired,
  colSpan: PropTypes.number.isRequired,
};


// ---------------------------------------------------------------------------
// Main Table component
// ---------------------------------------------------------------------------

export default function Table({
  columns = [],
  data = [],
  loading = false,
  selectable = false,
  selectedRows = [],
  onSelectRow,
  onSelectAll,
  rowKey = 'id',
  sortConfig,
  onSort,
  emptyMessage = 'No records found.',
  emptyIcon = 'table-off',
  skeletonRows = 8,
  stickyHeader = false,
  onRowClick,
  className = '',
}) {
  // Internal sort state (used when parent doesn't control it)
  const [internalSort, setInternalSort] = useState(null);

  const activeSort = sortConfig !== undefined ? sortConfig : internalSort;

  const handleSort = useCallback(
    (colKey) => {
      const isCurrentKey = activeSort?.key === colKey;
      const newDir =
        isCurrentKey && activeSort?.direction === 'asc' ? 'desc' : 'asc';
      const next = { key: colKey, direction: newDir };

      if (onSort) {
        onSort(next);
      } else {
        setInternalSort(next);
      }
    },
    [activeSort, onSort],
  );

  // When sort is internal, sort the data in place
  const displayData =
    !onSort && activeSort
      ? [...data].sort((a, b) => {
          const va = a[activeSort.key];
          const vb = b[activeSort.key];
          if (va == null) return 1;
          if (vb == null) return -1;
          const cmp =
            typeof va === 'string'
              ? va.localeCompare(vb)
              : va < vb
              ? -1
              : va > vb
              ? 1
              : 0;
          return activeSort.direction === 'asc' ? cmp : -cmp;
        })
      : data;

  // Checkbox helpers
  const allSelected =
    data.length > 0 && data.every((row) => selectedRows.includes(row[rowKey]));
  const someSelected =
    !allSelected && data.some((row) => selectedRows.includes(row[rowKey]));

  const totalCols = columns.length + (selectable ? 1 : 0);

  return (
    <>
      {/* ------------------------------------------------------------------ */}
      {/* Scoped styles — no Tailwind classes needed; pure CSS for full       */}
      {/* control over table internals like sticky header and scroll.         */}
      {/* ------------------------------------------------------------------ */}
      <style>{`
        /* OriginEdge table tokens */
        .oe-table-wrapper {
          --color-up-active:        #185FA5;
          --color-chevron-inactive: #C2C0B4;
          --color-header-bg:        #F8F7F5;
          --color-header-text:      #5F5E5A;
          --color-row-hover:        #F4F3F0;
          --color-row-selected:     #EBF3FC;
          --color-row-border:       rgba(0,0,0,0.06);
          --color-skeleton-base:    #EDEDEA;
          --color-skeleton-shine:   #F8F8F6;
          --color-empty-text:       #888780;
          --font-table:             'Inter', 'Segoe UI', system-ui, sans-serif;
          --row-height:             52px;
          --header-height:          44px;
        }

        @media (prefers-color-scheme: dark) {
          .oe-table-wrapper {
            --color-up-active:        #85B7EB;
            --color-chevron-inactive: #5F5E5A;
            --color-header-bg:        #232320;
            --color-header-text:      #888780;
            --color-row-hover:        #2C2C28;
            --color-row-selected:     #0C2840;
            --color-row-border:       rgba(255,255,255,0.06);
            --color-skeleton-base:    #2C2C28;
            --color-skeleton-shine:   #3A3A36;
            --color-empty-text:       #5F5E5A;
          }
        }

        /* Wrapper */
        .oe-table-wrapper {
          width: 100%;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          border-radius: 8px;
          border: 0.5px solid var(--color-row-border);
          background: var(--color-background-primary, #fff);
          font-family: var(--font-table);
        }

        /* Table */
        .oe-table {
          width: 100%;
          border-collapse: collapse;
          table-layout: auto;
          min-width: 640px;
        }

        /* Header */
        .table-thead {
          background: var(--color-header-bg);
        }
        .table-thead.sticky {
          position: sticky;
          top: 0;
          z-index: 2;
        }
        .table-th {
          height: var(--header-height);
          padding: 0 14px;
          text-align: left;
          font-size: 11.5px;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: var(--color-header-text);
          border-bottom: 0.5px solid var(--color-row-border);
          white-space: nowrap;
          user-select: none;
        }
        .table-th.sortable {
          cursor: pointer;
        }
        .table-th.sortable:hover {
          color: #185FA5;
        }
        .table-th.align-right  { text-align: right; }
        .table-th.align-center { text-align: center; }
        .table-th--checkbox {
          width: 44px;
          padding: 0 6px 0 14px;
        }

        /* Sort icon */
        .table-th-inner {
          display: inline-flex;
          align-items: center;
          gap: 5px;
        }
        .table-sort-icon {
          display: inline-flex;
          align-items: center;
          flex-shrink: 0;
          opacity: 0.55;
        }
        .table-th.sortable:hover .table-sort-icon { opacity: 0.9; }

        /* Body rows */
        .table-tr {
          border-bottom: 0.5px solid var(--color-row-border);
          transition: background 0.1s;
        }
        .table-tr:last-child { border-bottom: none; }
        .table-tr:hover { background: var(--color-row-hover); }
        .table-tr.clickable { cursor: pointer; }
        .table-tr.selected { background: var(--color-row-selected); }
        .table-tr.selected:hover { background: var(--color-row-selected); filter: brightness(0.97); }

        /* Cells */
        .table-cell {
          height: var(--row-height);
          padding: 0 14px;
          font-size: 13.5px;
          color: var(--color-text-primary, #2C2C2A);
          vertical-align: middle;
          white-space: nowrap;
        }
        .table-cell.align-right  { text-align: right; }
        .table-cell.align-center { text-align: center; }
        .table-cell--checkbox {
          width: 44px;
          padding: 0 6px 0 14px;
        }

        /* Checkbox */
        .table-checkbox {
          width: 16px;
          height: 16px;
          accent-color: #185FA5;
          cursor: pointer;
        }

        /* Skeleton shimmer */
        @keyframes oe-shimmer {
          0%   { background-position: -400px 0; }
          100% { background-position:  400px 0; }
        }
        .skeleton {
          display: block;
          height: 12px;
          border-radius: 6px;
          background: linear-gradient(
            90deg,
            var(--color-skeleton-base)  25%,
            var(--color-skeleton-shine) 50%,
            var(--color-skeleton-base)  75%
          );
          background-size: 800px 100%;
          animation: oe-shimmer 1.4s infinite linear;
        }
        @media (prefers-reduced-motion: reduce) {
          .skeleton { animation: none; }
        }
        .skeleton--checkbox {
          width: 16px;
          height: 16px;
          border-radius: 3px;
        }
        .table-skeleton-row .table-cell { padding-top: 4px; padding-bottom: 4px; }

        /* Empty state */
        .table-empty-cell {
          padding: 56px 0;
        }
        .table-empty-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          color: var(--color-empty-text);
        }
        .table-empty-message {
          margin: 0;
          font-size: 14px;
          color: var(--color-empty-text);
        }

        /* Action menu cell */
        .table-action-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--color-header-text);
          padding: 4px 6px;
          border-radius: 4px;
          font-size: 18px;
          line-height: 1;
          transition: background 0.1s, color 0.1s;
        }
        .table-action-btn:hover {
          background: var(--color-row-hover);
          color: var(--color-text-primary, #2C2C2A);
        }
        .table-action-btn:focus-visible {
          outline: 2px solid #185FA5;
          outline-offset: 2px;
        }
      `}</style>

      <div
        className={`oe-table-wrapper ${className}`}
        role="region"
        aria-label="Data table"
        tabIndex={0}
      >
        <table
          className="oe-table"
          role="table"
          aria-busy={loading}
          aria-rowcount={loading ? -1 : data.length}
        >
          {/* ---------------------------------------------------------------- */}
          {/* Header                                                            */}
          {/* ---------------------------------------------------------------- */}
          <thead className={`table-thead${stickyHeader ? ' sticky' : ''}`}>
            <tr role="row">
              {/* Select-all checkbox */}
              {selectable && (
                <th
                  className="table-th table-th--checkbox"
                  scope="col"
                  aria-label="Select all rows"
                >
                  <input
                    type="checkbox"
                    className="table-checkbox"
                    checked={allSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = someSelected;
                    }}
                    onChange={(e) => onSelectAll?.(e.target.checked)}
                    aria-label="Select all rows"
                  />
                </th>
              )}

              {columns.map((col) => {
                const isActive = activeSort?.key === col.key;
                return (
                  <th
                    key={col.key}
                    className={[
                      'table-th',
                      col.sortable ? 'sortable' : '',
                      col.align === 'right' ? 'align-right' : '',
                      col.align === 'center' ? 'align-center' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    scope="col"
                    style={col.width ? { width: col.width } : undefined}
                    onClick={col.sortable ? () => handleSort(col.key) : undefined}
                    aria-sort={
                      col.sortable && isActive
                        ? activeSort.direction === 'asc'
                          ? 'ascending'
                          : 'descending'
                        : col.sortable
                        ? 'none'
                        : undefined
                    }
                  >
                    <span className="table-th-inner">
                      {col.label}
                      {col.sortable && (
                        <SortIcon
                          columnKey={col.key}
                          sortConfig={activeSort}
                        />
                      )}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>

          {/* ---------------------------------------------------------------- */}
          {/* Body                                                              */}
          {/* ---------------------------------------------------------------- */}
          <tbody role="rowgroup">
            {loading ? (
              /* Skeleton rows */
              Array.from({ length: skeletonRows }).map((_, i) => (
                <SkeletonRow
                  key={i}
                  colCount={columns.length}
                  selectable={selectable}
                />
              ))
            ) : displayData.length === 0 ? (
              /* Empty state */
              <EmptyState
                message={emptyMessage}
                iconName={emptyIcon}
                colSpan={totalCols}
              />
            ) : (
              /* Data rows */
              displayData.map((row, rowIndex) => {
                const key = row[rowKey] ?? rowIndex;
                const isSelected = selectedRows.includes(key);

                return (
                  <tr
                    key={key}
                    role="row"
                    className={[
                      'table-tr',
                      isSelected ? 'selected' : '',
                      onRowClick ? 'clickable' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                    aria-selected={selectable ? isSelected : undefined}
                    tabIndex={onRowClick ? 0 : undefined}
                    onKeyDown={
                      onRowClick
                        ? (e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              onRowClick(row);
                            }
                          }
                        : undefined
                    }
                  >
                    {/* Row checkbox */}
                    {selectable && (
                      <td
                        className="table-cell table-cell--checkbox"
                        role="cell"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          className="table-checkbox"
                          checked={isSelected}
                          onChange={(e) =>
                            onSelectRow?.(key, e.target.checked)
                          }
                          aria-label={`Select row ${rowIndex + 1}`}
                        />
                      </td>
                    )}

                    {/* Data cells */}
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        role="cell"
                        className={[
                          'table-cell',
                          col.align === 'right' ? 'align-right' : '',
                          col.align === 'center' ? 'align-center' : '',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                      >
                        {col.render
                          ? col.render(row[col.key], row, rowIndex)
                          : (row[col.key] ?? '—')}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Prop types
// ---------------------------------------------------------------------------

Table.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key:      PropTypes.string.isRequired,
      label:    PropTypes.string.isRequired,
      sortable: PropTypes.bool,
      width:    PropTypes.string,
      align:    PropTypes.oneOf(['left', 'right', 'center']),
      render:   PropTypes.func,
    }),
  ).isRequired,
  data:         PropTypes.arrayOf(PropTypes.object).isRequired,
  loading:      PropTypes.bool,
  selectable:   PropTypes.bool,
  selectedRows: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  ),
  onSelectRow:  PropTypes.func,
  onSelectAll:  PropTypes.func,
  rowKey:       PropTypes.string,
  sortConfig:   PropTypes.shape({
    key:       PropTypes.string,
    direction: PropTypes.oneOf(['asc', 'desc']),
  }),
  onSort:        PropTypes.func,
  emptyMessage:  PropTypes.string,
  emptyIcon:     PropTypes.string,
  skeletonRows:  PropTypes.number,
  stickyHeader:  PropTypes.bool,
  onRowClick:    PropTypes.func,
  className:     PropTypes.string,
};

// ---------------------------------------------------------------------------
// Usage examples (reference — not rendered)
// ---------------------------------------------------------------------------
//
// 1. Basic read-only table (internal sort):
//
//   const columns = [
//     { key: 'name',       label: 'Employee',   sortable: true,
//       render: (val, row) => (
//         <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
//           <img src={row.avatar} style={{ width:28, height:28, borderRadius:'50%' }} alt="" />
//           <div>
//             <div style={{ fontWeight: 500 }}>{val}</div>
//             <div style={{ fontSize:11, color:'#888' }}>{row.designation}</div>
//           </div>
//         </div>
//       )
//     },
//     { key: 'employeeId', label: 'Employee ID', sortable: true },
//     { key: 'department', label: 'Department',  sortable: true },
//     { key: 'checkIn',   label: 'Check In'  },
//     { key: 'checkOut',  label: 'Check Out' },
//     { key: 'status',    label: 'Status',
//       render: (val) => <Badge status={val} />
//     },
//     { key: 'workHours', label: 'Work Hours', align: 'right', sortable: true },
//   ];
//
//   <Table columns={columns} data={attendanceData} loading={isLoading} />
//
// 2. Controlled sort (parent owns sort state):
//
//   const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
//
//   <Table
//     columns={columns}
//     data={data}
//     sortConfig={sortConfig}
//     onSort={setSortConfig}
//   />
//
// 3. Selectable rows (OT approve/reject):
//
//   const [selected, setSelected] = useState([]);
//
//   <Table
//     columns={columns}
//     data={otData}
//     selectable
//     selectedRows={selected}
//     onSelectRow={(key, checked) =>
//       setSelected(prev =>
//         checked ? [...prev, key] : prev.filter(k => k !== key)
//       )
//     }
//     onSelectAll={(checked) =>
//       setSelected(checked ? otData.map(r => r.id) : [])
//     }
//   />
//
// 4. Loading skeleton:
//
//   <Table columns={columns} data={[]} loading={true} skeletonRows={10} />
//
// 5. Empty state:
//
//   <Table
//     columns={columns}
//     data={[]}
//     emptyMessage="No attendance records for this date range."
//     emptyIcon="calendar-off"
//   />