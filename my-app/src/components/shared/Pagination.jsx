/**
 * Pagination.jsx — OriginEdge HRMS
 * Matches mockup: "Showing 1 to 6 of 128 entries | Rows per page: 10 ▾ | « ‹ 1 2 3 … 13 › »"
 */

import PropTypes from 'prop-types';

function buildPageRange(current, total, siblings = 1) {
  if (total <= 1) return [1];
  const left  = Math.max(2, current - siblings);
  const right = Math.min(total - 1, current + siblings);
  const range = [];
  for (let i = left; i <= right; i++) range.push(i);
  const hasLeftDots  = left  > 2;
  const hasRightDots = right < total - 1;
  const pages = [1];
  if (hasLeftDots)        pages.push('…L');
  else if (left === 3)    pages.push(2);
  pages.push(...range);
  if (hasRightDots)       pages.push('…R');
  else if (right === total - 2) pages.push(total - 1);
  if (total > 1) pages.push(total);
  return pages;
}

export default function Pagination({
  total, currentPage, rowsPerPage,
  onPageChange, onRowsPerPageChange,
  rowsPerPageOptions = [10, 25, 50, 100],
  siblingCount = 1, loading = false, className = '',
}) {
  const totalPages = Math.max(1, Math.ceil(total / rowsPerPage));
  const from       = total === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1;
  const to         = Math.min(currentPage * rowsPerPage, total);
  const pages      = buildPageRange(currentPage, totalPages, siblingCount);
  const isFirst    = currentPage <= 1;
  const isLast     = currentPage >= totalPages;

  const go = (page) => {
    if (page < 1 || page > totalPages || page === currentPage || loading) return;
    onPageChange?.(page);
  };

  return (
    <>
      <style>{`
        .oe-pagination {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 10px;
          padding: 12px 18px;
          border-top: 0.5px solid rgba(0,0,0,0.06);
          background: #fff;
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 13px;
        }
        .pg-summary {
          color: #5F5E5A;
          white-space: nowrap;
          font-size: 13px;
        }
        .pg-rpp {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #5F5E5A;
        }
        .pg-rpp-label { white-space: nowrap; font-size: 13px; }
        .pg-select-wrap { position: relative; display: inline-flex; align-items: center; }
        .pg-select {
          height: 32px;
          appearance: none;
          background: #fff;
          border: 0.5px solid rgba(0,0,0,0.12);
          border-radius: 6px;
          padding: 0 24px 0 10px;
          font-size: 13px;
          color: #2C2C2A;
          cursor: pointer;
          font-family: inherit;
        }
        .pg-select:focus {
          outline: none;
          border-color: #185FA5;
          box-shadow: 0 0 0 3px rgba(24,95,165,0.12);
        }
        .pg-chevron {
          position: absolute;
          right: 6px;
          font-size: 12px;
          color: #888780;
          pointer-events: none;
        }
        .pg-controls {
          display: flex;
          align-items: center;
          gap: 3px;
        }
        .pg-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 32px;
          height: 32px;
          padding: 0 6px;
          border: 0.5px solid rgba(0,0,0,0.12);
          border-radius: 6px;
          background: #fff;
          color: #2C2C2A;
          font-size: 13px;
          font-family: inherit;
          cursor: pointer;
          transition: background 0.12s, color 0.12s, border-color 0.12s;
          line-height: 1;
        }
        .pg-btn:hover:not(:disabled) {
          background: #F1EFE8;
          border-color: rgba(0,0,0,0.16);
        }
        .pg-btn:disabled {
          color: rgba(0,0,0,0.25);
          cursor: not-allowed;
          border-color: transparent;
          background: transparent;
        }
        .pg-btn:focus-visible {
          outline: 2px solid #185FA5;
          outline-offset: 1px;
        }
        .pg-btn--num { min-width: 32px; font-weight: 500; }
        .pg-btn--active {
          background: #185FA5 !important;
          color: #fff !important;
          border-color: #185FA5 !important;
          font-weight: 600;
        }
        .pg-dots {
          padding: 0 4px;
          color: #888780;
          user-select: none;
          font-size: 13px;
          line-height: 32px;
        }
        @media (max-width: 640px) {
          .oe-pagination { justify-content: center; }
          .pg-summary { width: 100%; text-align: center; }
          .pg-rpp { justify-content: center; }
          .pg-btn--num:not(.pg-btn--active) { display: none; }
        }
        @media (prefers-color-scheme: dark) {
          .oe-pagination { background: #1C1C1A; border-color: rgba(255,255,255,0.06); }
          .pg-summary { color: #888780; }
          .pg-rpp { color: #888780; }
          .pg-select { background: #2C2C28; border-color: rgba(255,255,255,0.10); color: #D3D1C7; }
          .pg-btn { background: #1C1C1A; border-color: rgba(255,255,255,0.10); color: #D3D1C7; }
          .pg-btn:hover:not(:disabled) { background: #2C2C28; }
          .pg-btn:disabled { color: rgba(255,255,255,0.2); }
          .pg-btn--active { background: #185FA5 !important; }
        }
      `}</style>

      <div className={`oe-pagination ${className}`} role="navigation" aria-label="Table pagination">

        {/* Left: summary */}
        <span className="pg-summary" aria-live="polite">
          {total === 0 ? 'No entries' : `Showing ${from} to ${to} of ${total} entries`}
        </span>

        {/* Center: rows per page */}
        <div className="pg-rpp">
          <label className="pg-rpp-label" htmlFor="pg-rpp-select">Rows per page:</label>
          <div className="pg-select-wrap">
            <select id="pg-rpp-select" className="pg-select"
              value={rowsPerPage}
              onChange={e => { onRowsPerPageChange?.(Number(e.target.value)); onPageChange?.(1); }}
              disabled={loading} aria-label="Rows per page">
              {rowsPerPageOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            <i className="ti ti-chevron-down pg-chevron" aria-hidden="true" />
          </div>
        </div>

        {/* Right: page controls */}
        <div className="pg-controls" role="group" aria-label="Page navigation">
          {/* First */}
          <button className="pg-btn" onClick={() => go(1)} disabled={isFirst || loading} aria-label="First page" title="First page">
            <i className="ti ti-chevrons-left" aria-hidden="true" />
          </button>
          {/* Prev */}
          <button className="pg-btn" onClick={() => go(currentPage - 1)} disabled={isFirst || loading} aria-label="Previous page">
            <i className="ti ti-chevron-left" aria-hidden="true" />
          </button>

          {/* Page numbers */}
          {pages.map((p, i) => {
            if (p === '…L' || p === '…R') return <span key={p} className="pg-dots">…</span>;
            return (
              <button key={`${p}-${i}`}
                className={`pg-btn pg-btn--num${p === currentPage ? ' pg-btn--active' : ''}`}
                onClick={() => go(p)} disabled={loading}
                aria-label={`Page ${p}`} aria-current={p === currentPage ? 'page' : undefined}>
                {p}
              </button>
            );
          })}

          {/* Next */}
          <button className="pg-btn" onClick={() => go(currentPage + 1)} disabled={isLast || loading} aria-label="Next page">
            <i className="ti ti-chevron-right" aria-hidden="true" />
          </button>
          {/* Last */}
          <button className="pg-btn" onClick={() => go(totalPages)} disabled={isLast || loading} aria-label="Last page" title="Last page">
            <i className="ti ti-chevrons-right" aria-hidden="true" />
          </button>
        </div>

      </div>
    </>
  );
}

Pagination.propTypes = {
  total:               PropTypes.number.isRequired,
  currentPage:         PropTypes.number.isRequired,
  rowsPerPage:         PropTypes.number.isRequired,
  onPageChange:        PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  rowsPerPageOptions:  PropTypes.arrayOf(PropTypes.number),
  siblingCount:        PropTypes.number,
  loading:             PropTypes.bool,
  className:           PropTypes.string,
};