/**
 * dateUtils.js — OriginEdge HRMS
 * Date formatting and calculation helpers.
 * No external library needed — uses native Intl + Date.
 *
 * Place at: src/utils/dateUtils.js
 */

// ---------------------------------------------------------------------------
// Format
// ---------------------------------------------------------------------------

// 'YYYY-MM-DD' → 'May 21, 2026'
export function formatDate(isoStr, options = {}) {
  if (!isoStr) return '—';
  const d = new Date(isoStr + 'T00:00:00');
  if (isNaN(d)) return '—';
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day:   'numeric',
    year:  'numeric',
    ...options,
  });
}

// 'YYYY-MM-DD' → 'Wednesday'
export function getDayName(isoStr) {
  if (!isoStr) return '';
  const d = new Date(isoStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'long' });
}

// Date → 'YYYY-MM-DD'
export function toISODate(date) {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d)) return '';
  return d.toISOString().slice(0, 10);
}

// Date → 'hh:mm AM/PM'
export function formatTime(date) {
  if (!date) return '—';
  const d = new Date(date);
  if (isNaN(d)) return '—';
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

// ---------------------------------------------------------------------------
// Calculations
// ---------------------------------------------------------------------------

// Days between today and a future ISO date (negative = past)
export function daysUntil(isoStr) {
  const today = new Date(toISODate(new Date()) + 'T00:00:00');
  const target = new Date(isoStr + 'T00:00:00');
  return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
}

// 'hh:mm' duration strings → total minutes
export function parseMinutes(durationStr) {
  if (!durationStr || durationStr === '-') return 0;
  const hMatch = durationStr.match(/(\d+)h/);
  const mMatch = durationStr.match(/(\d+)m/);
  return (hMatch ? Number(hMatch[1]) * 60 : 0) + (mMatch ? Number(mMatch[1]) : 0);
}

// Total minutes → 'Xh Ym'
export function minutesToDuration(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

// Is today within a date range?
export function isInRange(isoStr, fromISO, toISO) {
  if (!isoStr) return false;
  const d    = isoStr;
  const from = fromISO || '0000-00-00';
  const to   = toISO   || '9999-12-31';
  return d >= from && d <= to;
}

// Current month as 'May 2026'
export function currentMonthLabel() {
  return new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}