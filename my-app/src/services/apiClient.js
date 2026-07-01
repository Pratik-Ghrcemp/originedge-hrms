/**
 * apiClient.js — OriginEdge HRMS
 * Central Axios instance. All service files import from here.
 *
 * Place at: src/services/apiClient.js
 *
 * Reads VITE_API_URL from .env:
 *   VITE_API_URL=http://localhost:5000/api
 */

import axios from 'axios';

// ---------------------------------------------------------------------------
// Instance
// ---------------------------------------------------------------------------

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ---------------------------------------------------------------------------
// Request interceptor — attach auth token
// ---------------------------------------------------------------------------

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('oe_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ---------------------------------------------------------------------------
// Response interceptor — normalise errors
// ---------------------------------------------------------------------------

apiClient.interceptors.response.use(
  (response) => response.data,   // unwrap .data so callers get the payload directly

  (error) => {
    const status  = error.response?.status;
    const message = error.response?.data?.message || error.message || 'Something went wrong';

    // 401 — token expired or invalid
    if (status === 401) {
      localStorage.removeItem('oe_token');
      window.location.href = '/login';
      return Promise.reject(new Error('Session expired. Please log in again.'));
    }

    // 403 — not authorised
    if (status === 403) {
      return Promise.reject(new Error('You do not have permission to perform this action.'));
    }

    // 404
    if (status === 404) {
      return Promise.reject(new Error('Requested resource not found.'));
    }

    // 5xx
    if (status >= 500) {
      return Promise.reject(new Error('Server error. Please try again later.'));
    }

    return Promise.reject(new Error(message));
  },
);

export default apiClient;