/**
 * holidayService.js — OriginEdge HRMS
 * Place at: src/services/holidayService.js
 */

import apiClient from './apiClient';

export async function getAll(params = {}) {
  return apiClient.get('/holidays', { params });
}

export async function getById(id) {
  return apiClient.get(`/holidays/${id}`);
}

export async function getUpcoming(days = 90) {
  return apiClient.get('/holidays/upcoming', { params: { days } });
}

export async function getStats() {
  return apiClient.get('/holidays/stats');
}