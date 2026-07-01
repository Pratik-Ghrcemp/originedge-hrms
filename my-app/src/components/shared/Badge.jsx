/**
 * Badge.jsx — OriginEdge HRMS
 * Status badge component for attendance, OT, and performance modules.
 *
 * Props:
 *   status   {string}  Required. One of the STATUS_CONFIG keys below.
 *   size     {string}  'sm' | 'md' | 'lg'  Default: 'md'
 *   dot      {boolean} Show a leading colour dot. Default: true
 *   label    {string}  Override display text (uses status as label if omitted)
 *   className {string} Extra class on the root span
 */

import PropTypes from 'prop-types';

// ---------------------------------------------------------------------------
// Status configuration — single source of truth
// Add new statuses here; everything else derives from this map.
// ---------------------------------------------------------------------------

const STATUS_CONFIG = {
  // ── Attendance statuses ──────────────────────────────────────────────────
  Present: {
    label:       'Present',
    bg:          '#EDFAF3',
    text:        '#1A7A45',
    border:      '#AEECD0',
    dot:         '#22C166',
    bgDark:      '#0D3322',
    textDark:    '#5DCAA5',
    borderDark:  '#1A5E3A',
    dotDark:     '#5DCAA5',
    icon:        'circle-check',
  },
  Absent: {
    label:       'Absent',
    bg:          '#FFECEC',
    text:        '#A32D2D',
    border:      '#F7BFBF',
    dot:         '#E24B4A',
    bgDark:      '#3A1010',
    textDark:    '#F09595',
    borderDark:  '#7A2020',
    dotDark:     '#F09595',
    icon:        'circle-x',
  },
  'On Leave': {
    label:       'On Leave',
    bg:          '#FFF8E1',
    text:        '#8A6200',
    border:      '#FFE082',
    dot:         '#F9A825',
    bgDark:      '#362800',
    textDark:    '#FAC775',
    borderDark:  '#6B4E00',
    dotDark:     '#FAC775',
    icon:        'calendar-event',
  },
  Late: {
    label:       'Late',
    bg:          '#FFF3E0',
    text:        '#854F0B',
    border:      '#FFCC80',
    dot:         '#EF9F27',
    bgDark:      '#3A1E00',
    textDark:    '#FAC775',
    borderDark:  '#7A3F00',
    dotDark:     '#FAC775',
    icon:        'clock-exclamation',
  },
  'Early Exit': {
    label:       'Early Exit',
    bg:          '#F3EEFE',
    text:        '#5B3DA8',
    border:      '#C9B4F5',
    dot:         '#7F77DD',
    bgDark:      '#1E1040',
    textDark:    '#AFA9EC',
    borderDark:  '#4A2E8A',
    dotDark:     '#AFA9EC',
    icon:        'logout',
  },

  // ── OT / Approval statuses ───────────────────────────────────────────────
  Pending: {
    label:       'Pending',
    bg:          '#FFF3E0',
    text:        '#854F0B',
    border:      '#FFCC80',
    dot:         '#EF9F27',
    bgDark:      '#3A1E00',
    textDark:    '#FAC775',
    borderDark:  '#7A3F00',
    dotDark:     '#FAC775',
    icon:        'clock',
  },
  Approved: {
    label:       'Approved',
    bg:          '#EDFAF3',
    text:        '#1A7A45',
    border:      '#AEECD0',
    dot:         '#22C166',
    bgDark:      '#0D3322',
    textDark:    '#5DCAA5',
    borderDark:  '#1A5E3A',
    dotDark:     '#5DCAA5',
    icon:        'circle-check',
  },
  Rejected: {
    label:       'Rejected',
    bg:          '#FFECEC',
    text:        '#A32D2D',
    border:      '#F7BFBF',
    dot:         '#E24B4A',
    bgDark:      '#3A1010',
    textDark:    '#F09595',
    borderDark:  '#7A2020',
    dotDark:     '#F09595',
    icon:        'circle-x',
  },

  // ── Performance / Rating statuses ────────────────────────────────────────
  Excellent: {
    label:       'Excellent',
    bg:          '#EDFAF3',
    text:        '#1A7A45',
    border:      '#AEECD0',
    dot:         '#22C166',
    bgDark:      '#0D3322',
    textDark:    '#5DCAA5',
    borderDark:  '#1A5E3A',
    dotDark:     '#5DCAA5',
    icon:        'star',
  },
  Good: {
    label:       'Good',
    bg:          '#E6F1FB',
    text:        '#185FA5',
    border:      '#B5D4F4',
    dot:         '#378ADD',
    bgDark:      '#04233A',
    textDark:    '#85B7EB',
    borderDark:  '#0C3A6A',
    dotDark:     '#85B7EB',
    icon:        'thumb-up',
  },
  Average: {
    label:       'Average',
    bg:          '#FFF8E1',
    text:        '#8A6200',
    border:      '#FFE082',
    dot:         '#F9A825',
    bgDark:      '#362800',
    textDark:    '#FAC775',
    borderDark:  '#6B4E00',
    dotDark:     '#FAC775',
    icon:        'minus-circle',
  },
  'Needs Improvement': {
    label:       'Needs Improvement',
    bg:          '#FFECEC',
    text:        '#A32D2D',
    border:      '#F7BFBF',
    dot:         '#E24B4A',
    bgDark:      '#3A1010',
    textDark:    '#F09595',
    borderDark:  '#7A2020',
    dotDark:     '#F09595',
    icon:        'trending-down',
  },

  // ── Holiday types ────────────────────────────────────────────────────────
  'National Holiday': {
    label:       'National Holiday',
    bg:          '#E6F1FB',
    text:        '#185FA5',
    border:      '#B5D4F4',
    dot:         '#378ADD',
    bgDark:      '#04233A',
    textDark:    '#85B7EB',
    borderDark:  '#0C3A6A',
    dotDark:     '#85B7EB',
    icon:        'flag',
  },
  Festival: {
    label:       'Festival',
    bg:          '#EDFAF3',
    text:        '#1A7A45',
    border:      '#AEECD0',
    dot:         '#22C166',
    bgDark:      '#0D3322',
    textDark:    '#5DCAA5',
    borderDark:  '#1A5E3A',
    dotDark:     '#5DCAA5',
    icon:        'confetti',
  },
  'Restricted Holiday': {
    label:       'Restricted Holiday',
    bg:          '#FFF3E0',
    text:        '#854F0B',
    border:      '#FFCC80',
    dot:         '#EF9F27',
    bgDark:      '#3A1E00',
    textDark:    '#FAC775',
    borderDark:  '#7A3F00',
    dotDark:     '#FAC775',
    icon:        'lock',
  },
  'Optional Holiday': {
    label:       'Optional Holiday',
    bg:          '#F3EEFE',
    text:        '#5B3DA8',
    border:      '#C9B4F5',
    dot:         '#7F77DD',
    bgDark:      '#1E1040',
    textDark:    '#AFA9EC',
    borderDark:  '#4A2E8A',
    dotDark:     '#AFA9EC',
    icon:        'calendar-plus',
  },

  // ── Leave types (for Person 2 interop) ───────────────────────────────────
  'Privilege Leave': {
    label: 'PL', bg: '#E6F1FB', text: '#185FA5', border: '#B5D4F4', dot: '#378ADD',
    bgDark: '#04233A', textDark: '#85B7EB', borderDark: '#0C3A6A', dotDark: '#85B7EB', icon: 'calendar',
  },
  'Sick Leave': {
    label: 'SL', bg: '#FFECEC', text: '#A32D2D', border: '#F7BFBF', dot: '#E24B4A',
    bgDark: '#3A1010', textDark: '#F09595', borderDark: '#7A2020', dotDark: '#F09595', icon: 'heart-rate-monitor',
  },
  'Casual Leave': {
    label: 'CL', bg: '#FFF8E1', text: '#8A6200', border: '#FFE082', dot: '#F9A825',
    bgDark: '#362800', textDark: '#FAC775', borderDark: '#6B4E00', dotDark: '#FAC775', icon: 'umbrella',
  },
  'Earned Leave': {
    label: 'EL', bg: '#EDFAF3', text: '#1A7A45', border: '#AEECD0', dot: '#22C166',
    bgDark: '#0D3322', textDark: '#5DCAA5', borderDark: '#1A5E3A', dotDark: '#5DCAA5', icon: 'gift',
  },
  'Comp Off': {
    label: 'CO', bg: '#F3EEFE', text: '#5B3DA8', border: '#C9B4F5', dot: '#7F77DD',
    bgDark: '#1E1040', textDark: '#AFA9EC', borderDark: '#4A2E8A', dotDark: '#AFA9EC', icon: 'replace',
  },
};

// Fallback for unknown statuses
const UNKNOWN_CONFIG = {
  label: '',
  bg: '#F1EFE8', text: '#5F5E5A', border: '#D3D1C7', dot: '#888780',
  bgDark: '#2C2C2A', textDark: '#B4B2A9', borderDark: '#444441', dotDark: '#888780',
  icon: 'circle',
};

// ---------------------------------------------------------------------------
// Size scale
// ---------------------------------------------------------------------------

const SIZE = {
  sm: { fontSize: 10.5, padding: '2px 7px',  dotSize: 5,  gap: 4,  borderRadius: 4  },
  md: { fontSize: 12,   padding: '3px 9px',  dotSize: 6,  gap: 5,  borderRadius: 5  },
  lg: { fontSize: 13.5, padding: '4px 12px', dotSize: 7,  gap: 6,  borderRadius: 6  },
};

// ---------------------------------------------------------------------------
// Badge component
// ---------------------------------------------------------------------------

export default function Badge({ status, size = 'md', dot = true, label, className = '' }) {
  const config = STATUS_CONFIG[status] ?? { ...UNKNOWN_CONFIG, label: status ?? '—' };
  const scale  = SIZE[size] ?? SIZE.md;
  const text   = label ?? config.label;

  const style = {
    // Light-mode values as CSS custom props; dark-mode overrides via @media
    '--badge-bg':     config.bg,
    '--badge-text':   config.text,
    '--badge-border': config.border,
    '--badge-dot':    config.dot,

    display:        'inline-flex',
    alignItems:     'center',
    gap:            scale.gap,
    padding:        scale.padding,
    fontSize:       scale.fontSize,
    fontWeight:     600,
    letterSpacing:  '0.02em',
    lineHeight:     1,
    whiteSpace:     'nowrap',
    borderRadius:   scale.borderRadius,
    background:     'var(--badge-bg)',
    color:          'var(--badge-text)',
    border:         '0.5px solid var(--badge-border)',
    userSelect:     'none',
    verticalAlign:  'middle',
  };

  return (
    <>
      {/* Inject dark-mode token overrides once (idempotent by ID) */}
      <BadgeDarkStyles />

      <span
        className={`oe-badge oe-badge--${status?.toLowerCase().replace(/\s+/g, '-')} ${className}`}
        style={{
          ...style,
          '--badge-bg-dark':     config.bgDark,
          '--badge-text-dark':   config.textDark,
          '--badge-border-dark': config.borderDark,
          '--badge-dot-dark':    config.dotDark,
        }}
        role="status"
        aria-label={`Status: ${text}`}
      >
        {dot && (
          <span
            aria-hidden="true"
            style={{
              width:        scale.dotSize,
              height:       scale.dotSize,
              borderRadius: '50%',
              background:   'var(--badge-dot)',
              flexShrink:   0,
            }}
          />
        )}
        {text}
      </span>
    </>
  );
}

// ---------------------------------------------------------------------------
// Dark-mode style injection (runs once; idempotent)
// ---------------------------------------------------------------------------

let _darkStyleInjected = false;

function BadgeDarkStyles() {
  if (_darkStyleInjected) return null;
  _darkStyleInjected = true;

  return (
    <style>{`
      @media (prefers-color-scheme: dark) {
        .oe-badge {
          --badge-bg:     var(--badge-bg-dark);
          --badge-text:   var(--badge-text-dark);
          --badge-border: var(--badge-border-dark);
          --badge-dot:    var(--badge-dot-dark);
        }
      }
    `}</style>
  );
}

// ---------------------------------------------------------------------------
// Prop types
// ---------------------------------------------------------------------------

Badge.propTypes = {
  status:    PropTypes.oneOf(Object.keys(STATUS_CONFIG)).isRequired,
  size:      PropTypes.oneOf(['sm', 'md', 'lg']),
  dot:       PropTypes.bool,
  label:     PropTypes.string,
  className: PropTypes.string,
};

// ---------------------------------------------------------------------------
// Named export of config — useful for filters/dropdowns
// e.g. Object.keys(BADGE_STATUS_CONFIG) gives all valid status strings
// ---------------------------------------------------------------------------

export { STATUS_CONFIG as BADGE_STATUS_CONFIG };

// ---------------------------------------------------------------------------
// Usage examples
// ---------------------------------------------------------------------------
//
// Basic:
//   <Badge status="Present" />
//   <Badge status="Absent" />
//   <Badge status="On Leave" />
//   <Badge status="Late" />
//   <Badge status="Early Exit" />
//   <Badge status="Pending" />
//   <Badge status="Approved" />
//   <Badge status="Rejected" />
//
// Sizes:
//   <Badge status="Present" size="sm" />
//   <Badge status="Present" size="md" />   ← default
//   <Badge status="Present" size="lg" />
//
// Without dot:
//   <Badge status="Approved" dot={false} />
//
// Custom label:
//   <Badge status="Approved" label="✓ Done" />
//
// In Table.jsx render prop:
//   {
//     key: 'status',
//     label: 'Status',
//     render: (val) => <Badge status={val} />,
//   }
//
// In a filter dropdown, list all statuses:
//   import { BADGE_STATUS_CONFIG } from './Badge';
//   const options = Object.keys(BADGE_STATUS_CONFIG);