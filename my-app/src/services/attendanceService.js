/**
 * attendanceService.js — OriginEdge HRMS
 * All API calls for the Attendance module (Person 1).
 *
 * Place at: src/services/attendanceService.js
 *
 * Switch AttendanceReport.jsx from mock data to real API:
 *   import * as attendanceService from '../../services/attendanceService';
 *   const data = await attendanceService.getAll(filters);
 */

import apiClient from './apiClient';

// ---------------------------------------------------------------------------
// GET /attendance
// Params: page, limit, startDate, endDate, department, designation, location, search
// ---------------------------------------------------------------------------

export async function getAll(params = {}) {
  return apiClient.get('/attendance', { params });
}

// ---------------------------------------------------------------------------
// GET /attendance/:id
// ---------------------------------------------------------------------------

export async function getById(id) {
  return apiClient.get(`/attendance/${id}`);
}

// ---------------------------------------------------------------------------
// POST /attendance
// Body: { employeeId, date, checkIn, checkOut, status }
// ---------------------------------------------------------------------------

export async function create(payload) {
  return apiClient.post('/attendance', payload);
}

// ---------------------------------------------------------------------------
// PUT /attendance/:id
// Body: { checkIn?, checkOut?, status? }
// ---------------------------------------------------------------------------

export async function update(id, payload) {
  return apiClient.put(`/attendance/${id}`, payload);
}

// ---------------------------------------------------------------------------
// GET /attendance/export
// Returns blob (Excel file)
// ---------------------------------------------------------------------------

export async function exportReport(params = {}) {
  return apiClient.get('/attendance/export', {
    params,
    responseType: 'blob',
  });
}

// ---------------------------------------------------------------------------
// GET /attendance/stats
// Returns summary counts: total, present, absent, onLeave, late, earlyExit
// ---------------------------------------------------------------------------

export async function getStats(params = {}) {
  return apiClient.get('/attendance/stats', { params });
}