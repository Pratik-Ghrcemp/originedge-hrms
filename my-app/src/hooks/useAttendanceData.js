/**
 * useAttendanceData.js — OriginEdge HRMS
 * Custom hook — handles loading, error, and data states for attendance.
 * Currently returns mock data; swap the import when backend is ready.
 *
 * Place at: src/hooks/useAttendanceData.js
 *
 * Usage:
 *   const { data, stats, loading, error, refetch } = useAttendanceData(filters);
 */

import { useState, useEffect, useCallback } from 'react';

// ---------------------------------------------------------------------------
// Toggle this one line to switch mock ↔ real API
// ---------------------------------------------------------------------------
const USE_MOCK = true;

async function fetchAttendance(filters) {
  if (USE_MOCK) {
    // Dynamic import so mock data is excluded from production bundle
    const { ATTENDANCE_DATA } = await import('../mocks/attendanceData');

    // Client-side filter simulation
    let result = [...ATTENDANCE_DATA];
    if (filters.department) result = result.filter((r) => r.department === filters.department);
    if (filters.location)   result = result.filter((r) => r.location   === filters.location);
    if (filters.employee) {
      const q = filters.employee.toLowerCase();
      result = result.filter(
        (r) => r.name.toLowerCase().includes(q) || r.id.toLowerCase().includes(q),
      );
    }

    // Simulate network delay in dev
    await new Promise((res) => setTimeout(res, 400));
    return result;
  }

  // Real API
  const { getAll } = await import('../services/attendanceService');
  return getAll(filters);
}

function computeStats(data) {
  const total   = data.length;
  const pct     = (n) => (total ? ((n / total) * 100).toFixed(2) + '%' : '0%');
  const present = data.filter((r) => r.status === 'Present').length;
  const absent  = data.filter((r) => r.status === 'Absent').length;
  const onLeave = data.filter((r) => r.status === 'On Leave').length;
  const late    = data.filter((r) => r.status === 'Late').length;
  const earlyEx = data.filter((r) => r.status === 'Early Exit').length;
  return { total, present, absent, onLeave, late, earlyEx, pct };
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useAttendanceData(filters = {}) {
  const [data,    setData]    = useState([]);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchAttendance(filters);
      setData(result);
    } catch (err) {
      setError(err.message || 'Failed to load attendance data.');
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { load(); }, [load]);

  const stats = computeStats(data);

  return { data, stats, loading, error, refetch: load };
}