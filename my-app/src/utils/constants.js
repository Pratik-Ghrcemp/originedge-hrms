/**
 * constants.js — OriginEdge HRMS
 * App-wide constants. Import anywhere.
 *
 * Place at: src/utils/constants.js
 */

// ---------------------------------------------------------------------------
// Attendance
// ---------------------------------------------------------------------------

export const ATTENDANCE_STATUSES = [
  'Present',
  'Absent',
  'On Leave',
  'Late',
  'Early Exit',
];

export const DEPARTMENTS = [
  'Engineering',
  'Human Resources',
  'Design',
  'Business Analysis',
  'Quality Assurance',
];

export const DESIGNATIONS = [
  'Senior Team Lead',
  'HR Executive',
  'UI/UX Designer',
  'Project Manager',
  'Business Analyst',
  'QA Engineer',
  'Frontend Developer',
  'Backend Developer',
  'DevOps Engineer',
  'Data Analyst',
];

export const LOCATIONS = ['Bangalore', 'Mumbai', 'Delhi'];

// ---------------------------------------------------------------------------
// OT
// ---------------------------------------------------------------------------

export const OT_STATUSES = ['Pending', 'Approved', 'Rejected'];

// ---------------------------------------------------------------------------
// Performance
// ---------------------------------------------------------------------------

export const PERFORMANCE_STATUSES = [
  'Excellent',
  'Good',
  'Average',
  'Needs Improvement',
];

export const RATING_RANGES = [
  { label: '5 Star (4.5–5.0)', min: 4.5, max: 5.0 },
  { label: '4 Star (4.0–4.4)', min: 4.0, max: 4.4 },
  { label: '3 Star (3.0–3.9)', min: 3.0, max: 3.9 },
  { label: 'Below 3',          min: 0,   max: 2.9 },
];

// ---------------------------------------------------------------------------
// Holidays
// ---------------------------------------------------------------------------

export const HOLIDAY_TYPES = [
  'National Holiday',
  'Festival',
  'Restricted Holiday',
  'Optional Holiday',
];

// ---------------------------------------------------------------------------
// Pagination
// ---------------------------------------------------------------------------

export const ROWS_PER_PAGE_OPTIONS = [10, 25, 50, 100];

// ---------------------------------------------------------------------------
// App
// ---------------------------------------------------------------------------

export const APP_NAME    = import.meta.env.VITE_APP_NAME || 'OriginEdge HRMS';
export const API_BASE    = import.meta.env.VITE_API_URL  || 'http://localhost:5000/api';
export const DATE_FORMAT = 'MMM DD, YYYY';