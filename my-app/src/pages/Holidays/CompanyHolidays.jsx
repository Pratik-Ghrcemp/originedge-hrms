/**
 * CompanyHolidays.jsx — OriginEdge HRMS
 * Fixed version — injection checks removed, cards max-width added, calendar grid fixed.
 */

import { useState, useMemo } from 'react';
import Card    from '../../components/shared/Card';
import Table   from '../../components/shared/Table';
import Filters from '../../components/shared/Filters';
import Badge   from '../../components/shared/Badge';

const ALL_HOLIDAYS = [
  { id: 1,  date: '2026-01-26', name: 'Republic Day',              type: 'National Holiday',    description: 'Celebrates the adoption of the Constitution of India' },
  { id: 2,  date: '2026-03-14', name: 'Holi',                      type: 'Festival',            description: 'Festival of colors' },
  { id: 3,  date: '2026-03-31', name: 'Eid ul-Fitr',               type: 'Festival',            description: 'Marks the end of Ramadan' },
  { id: 4,  date: '2026-04-10', name: 'Mahavir Jayanti',           type: 'Restricted Holiday',  description: 'Birth anniversary of Lord Mahavir' },
  { id: 5,  date: '2026-04-14', name: 'Dr. B.R. Ambedkar Jayanti', type: 'National Holiday',    description: 'Birth anniversary of Dr. B.R. Ambedkar' },
  { id: 6,  date: '2026-05-01', name: 'Labour Day',                type: 'Optional Holiday',    description: "International Workers' Day" },
  { id: 7,  date: '2026-08-15', name: 'Independence Day',          type: 'National Holiday',    description: "Celebrates India's Independence" },
  { id: 8,  date: '2026-08-27', name: 'Ganesh Chaturthi',          type: 'Festival',            description: 'Birth of Lord Ganesha' },
  { id: 9,  date: '2026-10-02', name: 'Gandhi Jayanti',            type: 'National Holiday',    description: 'Birth anniversary of Mahatma Gandhi' },
  { id: 10, date: '2026-10-20', name: 'Dussehra',                  type: 'Festival',            description: 'Victory of good over evil' },
  { id: 11, date: '2026-11-01', name: 'Karnataka Rajyotsava',      type: 'Restricted Holiday',  description: 'Formation of Karnataka state' },
  { id: 12, date: '2026-11-05', name: 'Diwali',                    type: 'Festival',            description: 'Festival of Lights' },
  { id: 13, date: '2026-11-15', name: 'Guru Nanak Jayanti',        type: 'National Holiday',    description: 'Birth anniversary of Guru Nanak Dev Ji' },
  { id: 14, date: '2026-12-25', name: 'Christmas Day',             type: 'National Holiday',    description: 'Birth of Jesus Christ' },
  { id: 15, date: '2026-04-06', name: 'Ram Navami',                type: 'Optional Holiday',    description: 'Birth anniversary of Lord Rama' },
  { id: 16, date: '2026-09-07', name: 'Onam',                      type: 'Optional Holiday',    description: 'Harvest festival of Kerala' },
];

const TYPE_COLOR = {
  'National Holiday':   { dot: '#378ADD', accent: '#185FA5', bg: '#E6F1FB' },
  'Festival':           { dot: '#22C166', accent: '#1A7A45', bg: '#EDFAF3' },
  'Restricted Holiday': { dot: '#EF9F27', accent: '#854F0B', bg: '#FFF3E0' },
  'Optional Holiday':   { dot: '#7F77DD', accent: '#5B3DA8', bg: '#F3EEFE' },
};

const TODAY     = new Date();
const TODAY_STR = TODAY.toISOString().slice(0, 10);

function formatDate(isoStr) {
  return new Date(isoStr + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
function getDayName(isoStr) {
  return new Date(isoStr + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long' });
}
function daysUntil(isoStr) {
  return Math.ceil((new Date(isoStr + 'T00:00:00') - new Date(TODAY_STR + 'T00:00:00')) / 86400000);
}
function applyFilters(data, filters) {
  return data.filter((h) => {
    if (filters.holidayType && h.type !== filters.holidayType) return false;
    if (filters.name) {
      const q = filters.name.toLowerCase();
      if (!h.name.toLowerCase().includes(q)) return false;
    }
    if (filters.dateRange?.from && h.date < filters.dateRange.from) return false;
    if (filters.dateRange?.to   && h.date > filters.dateRange.to)   return false;
    return true;
  });
}

const WEEKDAYS    = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function MiniCalendar({ holidays }) {
  const [calDate, setCalDate] = useState(() => new Date());
  const year  = calDate.getFullYear();
  const month = calDate.getMonth();

  const holidayMap = useMemo(() => {
    const map = {};
    holidays.forEach((h) => {
      const [y, m] = h.date.split('-').map(Number);
      if (y === year && m - 1 === month) {
        const d = Number(h.date.split('-')[2]);
        if (!map[d]) map[d] = [];
        map[d].push(h);
      }
    });
    return map;
  }, [holidays, year, month]);

  const firstDay    = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayDay    = TODAY.getFullYear() === year && TODAY.getMonth() === month ? TODAY.getDate() : -1;
  const cells = [...Array(firstDay).fill(null), ...Array.from({length: daysInMonth}, (_, i) => i + 1)];

  const upcoming = [...holidays].filter(h => daysUntil(h.date) > 0).sort((a,b) => a.date.localeCompare(b.date)).slice(0, 3);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Calendar grid */}
      <div>
        {/* Nav */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
          <button onClick={() => setCalDate(new Date(year, month-1, 1))} aria-label="Prev month"
            style={{ background:'none', border:'0.5px solid rgba(0,0,0,0.10)', borderRadius:5, width:28, height:28,
              display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'#5F5E5A', fontSize:14 }}>
            <i className="ti ti-chevron-left" />
          </button>
          <span style={{ fontSize:13.5, fontWeight:600, color:'#1C1C1A' }}>{MONTH_NAMES[month]} {year}</span>
          <button onClick={() => setCalDate(new Date(year, month+1, 1))} aria-label="Next month"
            style={{ background:'none', border:'0.5px solid rgba(0,0,0,0.10)', borderRadius:5, width:28, height:28,
              display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'#5F5E5A', fontSize:14 }}>
            <i className="ti ti-chevron-right" />
          </button>
        </div>

        {/* Grid */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(7, 1fr)', gap:2 }}>
          {WEEKDAYS.map(d => (
            <div key={d} style={{ fontSize:10, fontWeight:600, textTransform:'uppercase', color:'#888780', textAlign:'center', padding:'4px 0 6px' }}>{d}</div>
          ))}
          {cells.map((day, i) => {
            if (!day) return <div key={`e-${i}`} />;
            const hols    = holidayMap[day] || [];
            const isToday = day === todayDay;
            return (
              <div key={day} title={hols.map(h=>h.name).join(', ')||undefined}
                style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
                  borderRadius:6, minHeight:34, background: hols.length ? 'rgba(0,0,0,0.02)' : 'none',
                  padding:'2px 0' }}>
                <span style={{
                  fontSize:12, fontWeight:400, color:'#2C2C2A', lineHeight:1,
                  ...(isToday ? { background:'#1B4F8A', color:'#fff', borderRadius:'50%', width:22, height:22,
                    display:'flex', alignItems:'center', justifyContent:'center' } : {})
                }}>{day}</span>
                {hols.length > 0 && (
                  <div style={{ display:'flex', gap:2, marginTop:3 }}>
                    {hols.slice(0,3).map((h,idx) => (
                      <span key={idx} style={{ width:5, height:5, borderRadius:'50%', background: TYPE_COLOR[h.type]?.dot||'#888', flexShrink:0, display:'inline-block' }} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div style={{ display:'flex', flexWrap:'wrap', gap:'10px 16px', marginTop:12, paddingTop:10, borderTop:'0.5px solid rgba(0,0,0,0.07)' }}>
          {Object.entries(TYPE_COLOR).map(([type, c]) => (
            <div key={type} style={{ display:'flex', alignItems:'center', gap:5 }}>
              <span style={{ width:5, height:5, borderRadius:'50%', background:c.dot, display:'inline-block' }} />
              <span style={{ fontSize:11, color:'#5F5E5A' }}>{type}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming */}
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        <div style={{ fontSize:13, fontWeight:600, color:'#1C1C1A', display:'flex', alignItems:'center', gap:6 }}>
          <i className="ti ti-calendar-event" />
          Upcoming Holidays
        </div>
        {upcoming.length === 0
          ? <p style={{ fontSize:12.5, color:'#888780', margin:0 }}>No upcoming holidays.</p>
          : upcoming.map((h) => {
            const c    = TYPE_COLOR[h.type];
            const days = daysUntil(h.date);
            const d    = new Date(h.date + 'T00:00:00');
            return (
              <div key={h.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 10px',
                borderRadius:8, background:'#F8F7F5', border:'0.5px solid rgba(0,0,0,0.06)' }}>
                <div style={{ width:38, height:38, borderRadius:8, display:'flex', flexDirection:'column',
                  alignItems:'center', justifyContent:'center', flexShrink:0, background:c?.bg, color:c?.accent, gap:1 }}>
                  <span style={{ fontSize:14, fontWeight:700, lineHeight:1 }}>{d.getDate()}</span>
                  <span style={{ fontSize:8.5, fontWeight:600, letterSpacing:'0.04em', opacity:0.8 }}>
                    {MONTH_NAMES[d.getMonth()].slice(0,3).toUpperCase()}
                  </span>
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:12.5, fontWeight:600, color:'#1C1C1A', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{h.name}</div>
                  <div style={{ fontSize:11, color:'#888780', marginTop:2 }}>{days} day{days!==1?'s':''} left</div>
                </div>
                <i className="ti ti-calendar-plus" style={{ color:'#C2C0B4', fontSize:15, flexShrink:0 }} />
              </div>
            );
          })
        }
      </div>
    </div>
  );
}

const COLUMNS = [
  { key:'date', label:'Date', sortable:true, render:(val) => <span style={{fontWeight:500}}>{formatDate(val)}</span> },
  { key:'_day', label:'Day', render:(_, row) => <span style={{color:'#5F5E5A'}}>{getDayName(row.date)}</span> },
  { key:'name', label:'Holiday Name', sortable:true, render:(val) => <span style={{fontWeight:500}}>{val}</span> },
  { key:'type', label:'Holiday Type', render:(val) => <Badge status={val} size="sm" /> },
  { key:'_loc', label:'Location', render:() => <span style={{color:'#888780',fontSize:12.5}}>India</span> },
  { key:'description', label:'Description', render:(val) => (
    <span style={{color:'#5F5E5A',fontSize:13,maxWidth:260,display:'block',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}} title={val}>{val}</span>
  )},
  { key:'_action', label:'Action', align:'center', render:(_, row) => (
    <button style={{background:'none',border:'none',cursor:'pointer',color:'#888780',fontSize:18,padding:'2px 6px',borderRadius:4}} aria-label={`Actions for ${row.name}`}>
      <i className="ti ti-dots-vertical" />
    </button>
  )},
];

const FILTER_CONFIG = [
  { type:'dateRange', key:'dateRange', label:'Date Range' },
  { type:'dropdown', key:'holidayType', label:'Holiday Type',
    options:['National Holiday','Festival','Restricted Holiday','Optional Holiday'], placeholder:'All Types' },
  { type:'search', key:'name', label:'Search Holiday', placeholder:'Search by holiday name...' },
];

export default function CompanyHolidays() {
  const [filters, setFilters] = useState({});
  const [loading]             = useState(false);
  const filtered = useMemo(() => applyFilters(ALL_HOLIDAYS, filters), [filters]);

  const stats = useMemo(() => ({
    total:      ALL_HOLIDAYS.length,
    upcoming:   ALL_HOLIDAYS.filter(h => daysUntil(h.date) > 0 && daysUntil(h.date) <= 90).length,
    restricted: ALL_HOLIDAYS.filter(h => h.type === 'Restricted Holiday').length,
    optional:   ALL_HOLIDAYS.filter(h => h.type === 'Optional Holiday').length,
  }), []);

  return (
    <>
      <style>{`
        .hol-page { display:flex; flex-direction:column; gap:20px; padding:24px; max-width:1440px; font-family:'Inter',system-ui,sans-serif; }
        .hol-title { font-size:24px; font-weight:700; color:#1C1C1A; margin:0 0 4px; letter-spacing:-0.02em; }
        .hol-breadcrumb { display:flex; align-items:center; gap:4px; font-size:12.5px; color:#888780; margin:0; }
        .hol-cards { display:flex; flex-wrap:wrap; gap:14px; }
        .hol-cards .oe-card { flex:1 1 150px; max-width:calc(25% - 11px); min-width:140px; }
        .hol-main-grid { display:grid; grid-template-columns:1fr 320px; gap:16px; align-items:start; width:100%; }
        .hol-table-card, .hol-calendar-card { background:#fff; border:0.5px solid rgba(0,0,0,0.08); border-radius:10px; overflow:hidden; }
        .hol-table-header { display:flex; align-items:center; justify-content:space-between; padding:16px 18px 12px; border-bottom:0.5px solid rgba(0,0,0,0.06); }
        .hol-table-title { font-size:15px; font-weight:600; color:#1C1C1A; margin:0; display:flex; align-items:center; gap:6px; }
        .hol-count { font-size:13px; font-weight:400; color:#888780; }
        .hol-note { display:flex; align-items:flex-start; gap:8px; margin:0 14px 14px; padding:10px 12px; background:#E6F1FB; border-radius:8px; border:0.5px solid #B5D4F4; }
        @media (max-width:960px) { .hol-main-grid { grid-template-columns:1fr; } }
        @media (max-width:640px) { .hol-page { padding:16px; } .hol-cards .oe-card { min-width:130px; } }
      `}</style>

      <div className="hol-page">
        <div>
          <h1 className="hol-title">Company Holidays</h1>
          <p className="hol-breadcrumb">
            <span>Dashboard</span>
            <i className="ti ti-chevron-right" style={{fontSize:11}} />
            <span>Company Holidays</span>
          </p>
        </div>

        <div className="hol-cards" role="region" aria-label="Holiday summary">
          <Card label="Total Holidays"      value={stats.total}      subLabel="This Year"                color="blue"   icon={<i className="ti ti-calendar" />}      loading={loading} />
          <Card label="Upcoming Holidays"   value={stats.upcoming}   subLabel="Next 90 Days"             color="green"  icon={<i className="ti ti-calendar-event" />} loading={loading} />
          <Card label="Restricted Holidays" value={stats.restricted} subLabel="Need Approval for Leave"  color="orange" icon={<i className="ti ti-lock" />}           loading={loading} />
          <Card label="Optional Holidays"   value={stats.optional}   subLabel="Organization Optional"    color="purple" icon={<i className="ti ti-calendar-plus" />}  loading={loading} />
        </div>

        <Filters config={FILTER_CONFIG} onApply={f => setFilters(f)} onReset={() => setFilters({})} loading={loading} />

        <div className="hol-main-grid">
          <div className="hol-table-card">
            <div className="hol-table-header">
              <h2 className="hol-table-title">Holidays List <span className="hol-count">({filtered.length})</span></h2>
            </div>
            <Table columns={COLUMNS} data={[...filtered].sort((a,b) => a.date.localeCompare(b.date))}
              loading={loading} rowKey="id" emptyMessage="No holidays found." emptyIcon="calendar-off" skeletonRows={8} />
          </div>

          <div className="hol-calendar-card">
            <div className="hol-table-header">
              <h2 className="hol-table-title">Holiday Calendar</h2>
            </div>
            <div style={{ padding:'12px 14px 16px' }}>
              <MiniCalendar holidays={ALL_HOLIDAYS} />
            </div>
            <div className="hol-note">
              <i className="ti ti-info-circle" style={{ color:'#185FA5', flexShrink:0 }} />
              <p style={{ margin:0, fontSize:12, color:'#5F5E5A', lineHeight:1.5 }}>
                Restricted holidays require manager approval for leaves. Optional holidays are at the organization's discretion.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}