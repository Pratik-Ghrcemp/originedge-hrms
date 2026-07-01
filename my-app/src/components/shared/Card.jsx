/**
 * Card.jsx — OriginEdge HRMS
 * Stats summary card used in Attendance, OT, Performance, Holidays pages.
 *
 * Props:
 *   label       {string}    Required. e.g. "Present"
 *   value       {number|string} Required. e.g. 96
 *   percentage  {string}    Optional. e.g. "75.00%"
 *   subLabel    {string}    Optional. e.g. "Employees" (below value)
 *   color       {string}    'green'|'red'|'yellow'|'orange'|'purple'|'blue'|'neutral'
 *   icon        {ReactNode} Optional. Any icon element (lucide-react, tabler, etc.)
 *   trend       {object}    Optional. { direction: 'up'|'down', value: '2.4%' }
 *   loading     {boolean}   Show skeleton. Default: false.
 *   onClick     {Function}  Makes card clickable / filterable.
 *   active      {boolean}   Highlight border when this card's filter is active.
 *   className   {string}
 */

import PropTypes from 'prop-types';

// ---------------------------------------------------------------------------
// Color palette — matches Badge.jsx tokens exactly
// ---------------------------------------------------------------------------

const COLOR = {
  green:   { bg: '#EDFAF3', text: '#1A7A45', accent: '#22C166', light: '#AEECD0',
             bgDark: '#0D3322', textDark: '#5DCAA5', accentDark: '#5DCAA5' },
  red:     { bg: '#FFECEC', text: '#A32D2D', accent: '#E24B4A', light: '#F7BFBF',
             bgDark: '#3A1010', textDark: '#F09595', accentDark: '#F09595' },
  yellow:  { bg: '#FFF8E1', text: '#8A6200', accent: '#F9A825', light: '#FFE082',
             bgDark: '#362800', textDark: '#FAC775', accentDark: '#FAC775' },
  orange:  { bg: '#FFF3E0', text: '#854F0B', accent: '#EF9F27', light: '#FFCC80',
             bgDark: '#3A1E00', textDark: '#FAC775', accentDark: '#FAC775' },
  purple:  { bg: '#F3EEFE', text: '#5B3DA8', accent: '#7F77DD', light: '#C9B4F5',
             bgDark: '#1E1040', textDark: '#AFA9EC', accentDark: '#AFA9EC' },
  blue:    { bg: '#E6F1FB', text: '#185FA5', accent: '#378ADD', light: '#B5D4F4',
             bgDark: '#04233A', textDark: '#85B7EB', accentDark: '#85B7EB' },
  neutral: { bg: '#F1EFE8', text: '#2C2C2A', accent: '#888780', light: '#D3D1C7',
             bgDark: '#232320', textDark: '#B4B2A9', accentDark: '#888780' },
};

// ---------------------------------------------------------------------------
// Skeleton shimmer
// ---------------------------------------------------------------------------

function CardSkeleton() {
  return (
    <>
      <style>{`
        @keyframes oe-card-shimmer {
          0%   { background-position: -400px 0; }
          100% { background-position:  400px 0; }
        }
        .card-skeleton { animation: oe-card-shimmer 1.4s infinite linear; }
        @media (prefers-reduced-motion: reduce) { .card-skeleton { animation: none; } }
      `}</style>
      <div className="oe-card oe-card--loading" aria-busy="true" aria-label="Loading…"
        style={{ background: '#F8F7F5', border: '0.5px solid rgba(0,0,0,0.07)', padding: '16px 18px',
                 borderRadius: 10, display: 'flex', flexDirection: 'column', gap: 10, minWidth: 140 }}>
        {[40, 60, 28].map((w, i) => (
          <span key={i} className="card-skeleton" aria-hidden="true"
            style={{ display: 'block', height: i === 1 ? 28 : 11, width: `${w}%`, borderRadius: 6,
                     background: 'linear-gradient(90deg,#EDEDEA 25%,#F8F8F6 50%,#EDEDEA 75%)',
                     backgroundSize: '800px 100%' }} />
        ))}
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Main Card
// ---------------------------------------------------------------------------

export default function Card({
  label, value, percentage, subLabel, color = 'neutral',
  icon, trend, loading = false, onClick, active = false, className = '',
}) {
  if (loading) return <CardSkeleton />;

  const c      = COLOR[color] ?? COLOR.neutral;
  const isBtn  = !!onClick;

  const wrapStyle = {
    '--c-bg':     c.bg,     '--c-text':   c.text,
    '--c-accent': c.accent, '--c-light':  c.light,
    '--c-bg-dk':  c.bgDark, '--c-txt-dk': c.textDark, '--c-acc-dk': c.accentDark,
  };

  return (
    <>
      <CardStyles />
      <div
        className={`oe-card oe-card--${color}${active ? ' oe-card--active' : ''}${isBtn ? ' oe-card--clickable' : ''} ${className}`}
        style={wrapStyle}
        role={isBtn ? 'button' : undefined}
        tabIndex={isBtn ? 0 : undefined}
        onClick={onClick}
        onKeyDown={isBtn ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } } : undefined}
        aria-pressed={isBtn ? active : undefined}
        aria-label={isBtn ? `Filter by ${label}` : undefined}
      >
        {/* Top row: label + icon */}
        <div className="card-top">
          <span className="card-label">{label}</span>
          {icon && <span className="card-icon" aria-hidden="true">{icon}</span>}
        </div>

        {/* Value */}
        <div className="card-value" aria-live="polite">
          {value ?? '—'}
        </div>

        {/* Bottom row: sublabel + percentage + trend */}
        <div className="card-bottom">
          {subLabel && <span className="card-sublabel">{subLabel}</span>}
          {percentage && (
            <span className="card-percentage">{percentage}</span>
          )}
          {trend && (
            <span className={`card-trend card-trend--${trend.direction}`} aria-label={`${trend.direction === 'up' ? 'Up' : 'Down'} ${trend.value}`}>
              <i className={`ti ti-trending-${trend.direction}`} aria-hidden="true" />
              {trend.value}
            </span>
          )}
        </div>

        {/* Accent bar at bottom */}
        <span className="card-accent-bar" aria-hidden="true" />
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------


function CardStyles() {
  return (
    <style>{`
      .oe-card {
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 6px;
        padding: 16px 18px 20px;
        background: var(--color-background-primary, #fff);
        border: 0.5px solid rgba(0,0,0,0.08);
        border-radius: 10px;
        overflow: hidden;
        min-width: 140px;
        flex: 1 1 140px;
        transition: box-shadow 0.15s, border-color 0.15s;
        font-family: 'Inter', system-ui, sans-serif;
      }
      .oe-card--clickable { cursor: pointer; }
      .oe-card--clickable:hover { box-shadow: 0 2px 12px rgba(0,0,0,0.09); }
      .oe-card--clickable:focus-visible { outline: 2px solid #185FA5; outline-offset: 2px; }
      .oe-card--active { border-color: var(--c-accent) !important; box-shadow: 0 0 0 3px color-mix(in srgb, var(--c-accent) 15%, transparent); }

      .card-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; }
      .card-label { font-size: 11.5px; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; color: #5F5E5A; }
      .card-icon { font-size: 18px; color: var(--c-accent); flex-shrink: 0; line-height: 1; }

      .card-value { font-size: 28px; font-weight: 700; line-height: 1; color: #1C1C1A; letter-spacing: -0.02em; }

      .card-bottom { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
      .card-sublabel { font-size: 11px; color: #888780; }
      .card-percentage { font-size: 12px; font-weight: 600; color: var(--c-text); }
      .card-trend { display: inline-flex; align-items: center; gap: 3px; font-size: 11.5px; font-weight: 500; }
      .card-trend--up   { color: #1A7A45; }
      .card-trend--down { color: #A32D2D; }

      .card-accent-bar {
        position: absolute;
        bottom: 0; left: 0; right: 0;
        height: 3px;
        background: var(--c-accent);
        border-radius: 0 0 10px 10px;
      }

      @media (prefers-color-scheme: dark) {
        .oe-card { background: var(--c-bg-dk, #1C1C1A); border-color: rgba(255,255,255,0.08); }
        .card-label { color: #888780; }
        .card-value { color: var(--c-txt-dk, #D3D1C7); }
        .card-sublabel { color: #5F5E5A; }
        .card-percentage { color: var(--c-txt-dk); }
        .card-icon { color: var(--c-acc-dk); }
        .card-accent-bar { background: var(--c-acc-dk); }
      }
    `}</style>
  );
}

Card.propTypes = {
  label:      PropTypes.string.isRequired,
  value:      PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  percentage: PropTypes.string,
  subLabel:   PropTypes.string,
  color:      PropTypes.oneOf(['green','red','yellow','orange','purple','blue','neutral']),
  icon:       PropTypes.node,
  trend:      PropTypes.shape({ direction: PropTypes.oneOf(['up','down']), value: PropTypes.string }),
  loading:    PropTypes.bool,
  onClick:    PropTypes.func,
  active:     PropTypes.bool,
  className:  PropTypes.string,
};