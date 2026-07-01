/**
 * Filters.jsx — OriginEdge HRMS
 * Matches mockup exactly: one-line horizontal filter bar
 * Date Range | Department | Designation | Location | Employee Search
 *                                              Reset | Apply Filters
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';

function useDebounce(value, delay = 500) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

function toISODate(date) {
  if (!date) return '';
  const d = new Date(date);
  return isNaN(d) ? '' : d.toISOString().slice(0, 10);
}

function formatDisplayDate(isoStr) {
  if (!isoStr) return '';
  const d = new Date(isoStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// ---------------------------------------------------------------------------
// DateRange field
// ---------------------------------------------------------------------------
function DateRangeField({ label, value, onChange, disabled }) {
  const { from = '', to = '' } = value || {};
  const display = from && to
    ? `${formatDisplayDate(from)} - ${formatDisplayDate(to)}`
    : from ? `From ${formatDisplayDate(from)}`
    : 'Select date range';

  return (
    <div className="oe-filter-field">
      <label className="oe-filter-label">{label}</label>
      <div className="oe-filter-daterange">
        <i className="ti ti-calendar oe-field-icon" aria-hidden="true" />
        <span className="oe-daterange-text">{display}</span>
        <input type="date" className="oe-date-input oe-date-from"
          value={from} max={to || undefined}
          onChange={e => onChange({ from: e.target.value, to })}
          disabled={disabled} aria-label={`${label} from`} />
        <input type="date" className="oe-date-input oe-date-to"
          value={to} min={from || undefined}
          onChange={e => onChange({ from, to: e.target.value })}
          disabled={disabled} aria-label={`${label} to`} />
        {(from || to) && (
          <button className="oe-field-clear" onClick={() => onChange({ from: '', to: '' })}
            aria-label="Clear date" type="button">
            <i className="ti ti-x" />
          </button>
        )}
        <i className="ti ti-search oe-daterange-search" aria-hidden="true" />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Dropdown field
// ---------------------------------------------------------------------------
function DropdownField({ label, value, onChange, options, placeholder, disabled }) {
  return (
    <div className="oe-filter-field">
      <label className="oe-filter-label">{label}</label>
      <div className="oe-filter-select-wrap">
        <select className="oe-filter-select" value={value ?? ''}
          onChange={e => onChange(e.target.value)}
          disabled={disabled} aria-label={label}>
          <option value="">{placeholder || `All ${label}s`}</option>
          {options.filter(o => o !== 'All' && o !== '').map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <i className="ti ti-chevron-down oe-select-chevron" aria-hidden="true" />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Search field
// ---------------------------------------------------------------------------
function SearchField({ label, value, onChange, placeholder, disabled }) {
  const [local, setLocal] = useState(value ?? '');
  const debounced = useDebounce(local, 500);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  useEffect(() => { onChangeRef.current(debounced); }, [debounced]);
  useEffect(() => { setLocal(value ?? ''); }, [value]);

  return (
    <div className="oe-filter-field oe-filter-search-field">
      <label className="oe-filter-label">{label}</label>
      <div className="oe-filter-search-wrap">
        <input type="search" className="oe-filter-search-input"
          value={local} onChange={e => setLocal(e.target.value)}
          placeholder={placeholder || `Search ${label.toLowerCase()}…`}
          disabled={disabled} aria-label={`Search ${label}`} />
        <i className="ti ti-search oe-search-icon" aria-hidden="true" />
        {local && (
          <button className="oe-field-clear oe-search-clear" onClick={() => setLocal('')}
            aria-label="Clear search" type="button">
            <i className="ti ti-x" />
          </button>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Build empty state
// ---------------------------------------------------------------------------
function buildEmpty(config) {
  const empty = {};
  config.forEach(f => {
    const key = f.key || f.label.toLowerCase().replace(/\s+/g, '_');
    empty[key] = f.type === 'dateRange' ? { from: '', to: '' } : '';
  });
  return empty;
}

// ---------------------------------------------------------------------------
// Main Filters component
// ---------------------------------------------------------------------------
export default function Filters({ config = [], onApply, onReset, initialValues, loading = false, className = '' }) {
  const emptyState = buildEmpty(config);
  const [values, setValues] = useState(() => ({ ...emptyState, ...(initialValues || {}) }));

  const hasActive = Object.entries(values).some(([, v]) =>
    typeof v === 'object' && v !== null ? v.from || v.to : v !== ''
  );

  const setField = useCallback((key, val) => setValues(prev => ({ ...prev, [key]: val })), []);

  const handleApply = () => onApply?.(values);
  const handleReset = () => {
    setValues(emptyState);
    onReset?.();
    onApply?.(emptyState);
  };

  return (
    <>
      <style>{`
        .oe-filters-bar {
          background: #fff;
          border: 0.5px solid rgba(0,0,0,0.10);
          border-radius: 10px;
          padding: 16px 20px 14px;
          font-family: 'Inter', system-ui, sans-serif;
        }

        /* Top row — all fields in one line */
        .oe-filters-row {
          display: flex;
          align-items: flex-end;
          gap: 12px;
          flex-wrap: nowrap;
          overflow-x: auto;
        }

        /* Bottom row — More Filters left, Reset+Apply right */
        .oe-filters-actions-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 12px;
          padding-top: 10px;
          border-top: 0.5px solid rgba(0,0,0,0.06);
        }

        /* Each field */
        .oe-filter-field {
          display: flex;
          flex-direction: column;
          gap: 5px;
          flex: 1 1 150px;
          min-width: 130px;
        }
        .oe-filter-search-field { flex: 1.4 1 180px; }

        .oe-filter-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: #5F5E5A;
          white-space: nowrap;
        }

        /* Date range */
        .oe-filter-daterange {
          position: relative;
          height: 38px;
          display: flex;
          align-items: center;
          background: #fff;
          border: 0.5px solid rgba(0,0,0,0.14);
          border-radius: 7px;
          padding: 0 32px 0 32px;
          cursor: pointer;
          transition: border-color 0.15s;
          overflow: hidden;
        }
        .oe-filter-daterange:focus-within {
          border-color: #185FA5;
          box-shadow: 0 0 0 3px rgba(24,95,165,0.12);
        }
        .oe-field-icon {
          position: absolute;
          left: 10px;
          font-size: 14px;
          color: #888780;
          pointer-events: none;
        }
        .oe-daterange-search {
          position: absolute;
          right: 10px;
          font-size: 13px;
          color: #888780;
          pointer-events: none;
        }
        .oe-daterange-text {
          font-size: 13px;
          color: #2C2C2A;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          flex: 1;
          pointer-events: none;
          user-select: none;
        }
        .oe-date-input {
          position: absolute;
          top: 0; height: 100%;
          width: 45%;
          opacity: 0;
          cursor: pointer;
          border: none;
          background: transparent;
        }
        .oe-date-from { left: 0; }
        .oe-date-to   { right: 24px; }

        /* Dropdown */
        .oe-filter-select-wrap {
          position: relative;
          height: 38px;
        }
        .oe-filter-select {
          width: 100%;
          height: 100%;
          appearance: none;
          background: #fff;
          border: 0.5px solid rgba(0,0,0,0.14);
          border-radius: 7px;
          padding: 0 28px 0 12px;
          font-size: 13px;
          color: #2C2C2A;
          cursor: pointer;
          font-family: inherit;
          transition: border-color 0.15s;
        }
        .oe-filter-select:focus {
          outline: none;
          border-color: #185FA5;
          box-shadow: 0 0 0 3px rgba(24,95,165,0.12);
        }
        .oe-filter-select:disabled { opacity: 0.5; cursor: not-allowed; }
        .oe-select-chevron {
          position: absolute;
          right: 9px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 13px;
          color: #888780;
          pointer-events: none;
        }

        /* Search */
        .oe-filter-search-wrap {
          position: relative;
          height: 38px;
        }
        .oe-filter-search-input {
          width: 100%;
          height: 100%;
          border: 0.5px solid rgba(0,0,0,0.14);
          border-radius: 7px;
          background: #fff;
          padding: 0 32px 0 12px;
          font-size: 13px;
          color: #2C2C2A;
          font-family: inherit;
          transition: border-color 0.15s;
        }
        .oe-filter-search-input::placeholder { color: #B4B2A9; }
        .oe-filter-search-input:focus {
          outline: none;
          border-color: #185FA5;
          box-shadow: 0 0 0 3px rgba(24,95,165,0.12);
        }
        .oe-filter-search-input::-webkit-search-cancel-button { display: none; }
        .oe-search-icon {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 14px;
          color: #888780;
          pointer-events: none;
        }

        /* Clear button */
        .oe-field-clear {
          position: absolute;
          right: 6px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #888780;
          font-size: 12px;
          padding: 2px;
          display: flex;
          align-items: center;
          border-radius: 3px;
          z-index: 1;
        }
        .oe-field-clear:hover { color: #2C2C2A; }

        /* Action buttons */
        .oe-filter-more-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          height: 34px;
          padding: 0 14px;
          border: 0.5px solid rgba(0,0,0,0.14);
          border-radius: 7px;
          background: #fff;
          font-size: 13px;
          font-weight: 500;
          color: #5F5E5A;
          cursor: pointer;
          font-family: inherit;
          transition: background 0.12s;
        }
        .oe-filter-more-btn:hover { background: #F5F4F1; }

        .oe-filter-btn-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .oe-filter-reset-btn {
          height: 36px;
          padding: 0 18px;
          border: 0.5px solid rgba(0,0,0,0.14);
          border-radius: 7px;
          background: #fff;
          font-size: 13px;
          font-weight: 500;
          color: #5F5E5A;
          cursor: pointer;
          font-family: inherit;
          transition: background 0.12s;
        }
        .oe-filter-reset-btn:hover:not(:disabled) { background: #F5F4F1; }
        .oe-filter-reset-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        .oe-filter-apply-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          height: 36px;
          padding: 0 18px;
          background: #1B4F8A;
          color: #fff;
          border: none;
          border-radius: 7px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          font-family: inherit;
          transition: background 0.12s;
        }
        .oe-filter-apply-btn:hover:not(:disabled) { background: #174276; }
        .oe-filter-apply-btn:disabled { opacity: 0.45; cursor: not-allowed; }
        .oe-filter-apply-btn:focus-visible,
        .oe-filter-reset-btn:focus-visible { outline: 2px solid #185FA5; outline-offset: 2px; }

        @media (max-width: 900px) {
          .oe-filters-row { flex-wrap: wrap; }
          .oe-filter-field { min-width: 45%; }
        }
        @media (max-width: 600px) {
          .oe-filter-field { min-width: 100%; }
          .oe-filter-btn-group { flex: 1; justify-content: flex-end; }
        }

        @media (prefers-color-scheme: dark) {
          .oe-filters-bar { background: #1C1C1A; border-color: rgba(255,255,255,0.08); }
          .oe-filter-label { color: #888780; }
          .oe-filter-daterange,
          .oe-filter-select,
          .oe-filter-search-input {
            background: #2C2C28;
            border-color: rgba(255,255,255,0.10);
            color: #D3D1C7;
          }
          .oe-filter-more-btn,
          .oe-filter-reset-btn {
            background: #2C2C28;
            border-color: rgba(255,255,255,0.10);
            color: #888780;
          }
          .oe-daterange-text { color: #D3D1C7; }
          .oe-filters-actions-row { border-color: rgba(255,255,255,0.06); }
        }
      `}</style>

      <div className={`oe-filters-bar ${className}`} role="search" aria-label="Filter records">

        {/* One-line fields row */}
        <div className="oe-filters-row">
          {config.map(field => {
            const key = field.key || field.label.toLowerCase().replace(/\s+/g, '_');
            if (field.type === 'dateRange') return (
              <DateRangeField key={key} label={field.label}
                value={values[key]} onChange={val => setField(key, val)} disabled={loading} />
            );
            if (field.type === 'dropdown') return (
              <DropdownField key={key} label={field.label}
                value={values[key]} onChange={val => setField(key, val)}
                options={field.options || []} placeholder={field.placeholder} disabled={loading} />
            );
            if (field.type === 'search') return (
              <SearchField key={key} label={field.label}
                value={values[key]} onChange={val => setField(key, val)}
                placeholder={field.placeholder} disabled={loading} />
            );
            return null;
          })}
        </div>

        {/* Actions row */}
        <div className="oe-filters-actions-row">
          <button className="oe-filter-more-btn" type="button" aria-label="More filters">
            <i className="ti ti-filter" aria-hidden="true" />
            More Filters
          </button>
          <div className="oe-filter-btn-group">
            <button className="oe-filter-reset-btn" type="button"
              onClick={handleReset} disabled={loading || !hasActive} aria-label="Reset filters">
              Reset
            </button>
            <button className="oe-filter-apply-btn" type="button"
              onClick={handleApply} disabled={loading} aria-label="Apply filters">
              <i className="ti ti-filter" aria-hidden="true" />
              Apply Filters
            </button>
          </div>
        </div>

      </div>
    </>
  );
}

Filters.propTypes = {
  config:        PropTypes.arrayOf(PropTypes.shape({
    type:        PropTypes.oneOf(['dateRange', 'dropdown', 'search']).isRequired,
    key:         PropTypes.string,
    label:       PropTypes.string.isRequired,
    options:     PropTypes.arrayOf(PropTypes.string),
    placeholder: PropTypes.string,
  })).isRequired,
  onApply:       PropTypes.func,
  onReset:       PropTypes.func,
  initialValues: PropTypes.object,
  loading:       PropTypes.bool,
  className:     PropTypes.string,
};