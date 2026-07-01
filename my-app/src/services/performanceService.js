/**
 * performanceService.js — OriginEdge HRMS
 * Place at: src/services/performanceService.js
 */

import apiClient from './apiClient';

export async function getAll(params = {}) {
  return apiClient.get('/performance', { params });
}

export async function getById(id) {
  return apiClient.get(`/performance/${id}`);
}

export async function create(payload) {
  return apiClient.post('/performance', payload);
}

export async function update(id, payload) {
  return apiClient.put(`/performance/${id}`, payload);
}

export async function getStats(params = {}) {
  return apiClient.get('/performance/stats', { params });
}