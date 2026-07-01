/**
 * otService.js — OriginEdge HRMS
 * All API calls for the OT Management module (Person 1).
 *
 * Place at: src/services/otService.js
 */

import apiClient from './apiClient';

export async function getAll(params = {}) {
  return apiClient.get('/ot', { params });
}

export async function getById(id) {
  return apiClient.get(`/ot/${id}`);
}

export async function create(payload) {
  return apiClient.post('/ot', payload);
}

// Approve a pending OT request
export async function approve(id, remarks = '') {
  return apiClient.post(`/ot/${id}/approve`, { remarks });
}

// Reject a pending OT request
export async function reject(id, remarks = '') {
  return apiClient.post(`/ot/${id}/reject`, { remarks });
}

export async function getStats(params = {}) {
  return apiClient.get('/ot/stats', { params });
}