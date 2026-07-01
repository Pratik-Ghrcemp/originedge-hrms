/**
 * exportUtils.js — OriginEdge HRMS
 * Excel + CSV export. Replaces the alert() stub in AttendanceReport.jsx.
 *
 * Place at: src/utils/exportUtils.js
 *
 * Dependencies: xlsx (already in package.json)
 *   npm install xlsx   ← if not yet installed
 *
 * Usage in AttendanceReport.jsx:
 *   import { exportToExcel } from '../../utils/exportUtils';
 *   exportToExcel(filteredData, ATTENDANCE_COLUMNS, 'Attendance_Report');
 */

// Dynamic import — xlsx (~900KB) only loads when user clicks Export
async function getXLSX() {
  const xlsx = await import('xlsx');
  return xlsx;
}

// ---------------------------------------------------------------------------
// Column definition type:
//   { key: string, label: string, format?: (value, row) => string }
// ---------------------------------------------------------------------------

/**
 * Export data to .xlsx
 * @param {Object[]} data        - Array of row objects
 * @param {Object[]} columns     - [{ key, label, format? }]
 * @param {string}   fileName    - Without extension
 * @param {string}   sheetName   - Default: 'Sheet1'
 */
export async function exportToExcel(data, columns, fileName = 'export', sheetName = 'Sheet1') {
  if (!data?.length) {
    console.warn('exportToExcel: no data to export');
    return;
  }

  const { utils, writeFile } = await getXLSX();

  // Build header row
  const headers = columns.map((c) => c.label);

  // Build data rows
  const rows = data.map((row) =>
    columns.map((col) =>
      col.format ? col.format(row[col.key], row) : (row[col.key] ?? ''),
    ),
  );

  // Create worksheet
  const ws = utils.aoa_to_sheet([headers, ...rows]);

  // Auto column widths
  ws['!cols'] = headers.map((h, i) => {
    const maxLen = Math.max(
      h.length,
      ...rows.map((r) => String(r[i] ?? '').length),
    );
    return { wch: Math.min(maxLen + 2, 40) };
  });

  // Create workbook
  const wb = utils.book_new();
  utils.book_append_sheet(wb, ws, sheetName);

  // Download
  writeFile(wb, `${fileName}_${formatFileDate()}.xlsx`);
}

/**
 * Export data to .csv
 */
export async function exportToCSV(data, columns, fileName = 'export') {
  if (!data?.length) return;

  const { utils, writeFile } = await getXLSX();

  const headers = columns.map((c) => c.label);
  const rows    = data.map((row) =>
    columns.map((col) =>
      col.format ? col.format(row[col.key], row) : (row[col.key] ?? ''),
    ),
  );

  const ws = utils.aoa_to_sheet([headers, ...rows]);
  const wb = utils.book_new();
  utils.book_append_sheet(wb, ws, 'Data');
  writeFile(wb, `${fileName}_${formatFileDate()}.csv`);
}

// ---------------------------------------------------------------------------
// Pre-built column sets for each module
// ---------------------------------------------------------------------------

export const ATTENDANCE_EXPORT_COLUMNS = [
  { key: 'id',         label: 'Employee ID'  },
  { key: 'name',       label: 'Employee Name'},
  { key: 'department', label: 'Department'   },
  { key: 'designation',label: 'Designation'  },
  { key: 'location',   label: 'Location'     },
  { key: 'checkIn',    label: 'Check In'     },
  { key: 'checkOut',   label: 'Check Out'    },
  { key: 'status',     label: 'Status'       },
  { key: 'workHours',  label: 'Work Hours'   },
  { key: 'late',       label: 'Late By'      },
  { key: 'earlyExit',  label: 'Early Exit'   },
];

export const OT_EXPORT_COLUMNS = [
  { key: 'id',         label: 'Request ID'   },
  { key: 'name',       label: 'Employee'     },
  { key: 'department', label: 'Department'   },
  { key: 'date',       label: 'Date'         },
  { key: 'otHours',    label: 'OT Hours'     },
  { key: 'reason',     label: 'Reason'       },
  { key: 'status',     label: 'Status'       },
];

export const PERFORMANCE_EXPORT_COLUMNS = [
  { key: 'id',         label: 'Employee ID'  },
  { key: 'name',       label: 'Employee'     },
  { key: 'department', label: 'Department'   },
  { key: 'rating',     label: 'Rating', format: (v) => v?.toFixed(1) },
  { key: 'reviewDate', label: 'Review Date'  },
  { key: 'feedback',   label: 'Feedback'     },
];

export const HOLIDAY_EXPORT_COLUMNS = [
  { key: 'date',        label: 'Date'         },
  { key: 'name',        label: 'Holiday Name' },
  { key: 'type',        label: 'Type'         },
  { key: 'description', label: 'Description'  },
];

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------

function formatFileDate() {
  return new Date().toISOString().slice(0, 10).replace(/-/g, '');
}