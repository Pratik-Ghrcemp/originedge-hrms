/**
 * MainLayout.jsx — OriginEdge HRMS
 * Sidebar + Header layout matching the UI mockup exactly.
 * Place at: src/components/layout/MainLayout.jsx
 */

import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

// ---------------------------------------------------------------------------
// Nav items — Person 1 owns: Attendance, OT, Performance, Holidays
// ---------------------------------------------------------------------------

const NAV_ITEMS = [
  { label: 'Dashboard',        path: '/dashboard',    icon: 'layout-dashboard' },
  { label: 'Attendance Report',path: '/attendance',   icon: 'clock' },
  { label: 'Leave Management', path: '/leave',        icon: 'calendar-event' },
  { label: 'Leave Summary',    path: '/leave-summary',icon: 'calendar-stats' },
  { label: 'Other Employees Leave', path: '/team-leaves', icon: 'users' },
  { label: 'WFH Management',   path: '/wfh',          icon: 'home' },
  { label: 'OT Management',    path: '/ot',           icon: 'clock-exclamation' },
  { label: 'Performance Review',path: '/performance', icon: 'trending-up' },
  { label: 'Applications',     path: '/applications', icon: 'briefcase' },
  { label: 'Interviews',       path: '/interviews',   icon: 'microphone' },
  { label: 'My Profile',       path: '/profile',      icon: 'user' },
  { label: 'My Documents',     path: '/documents',    icon: 'file-text' },
  { label: 'Company Holidays', path: '/holidays',     icon: 'calendar' },
  { label: 'Company Policy',   path: '/policies',     icon: 'bell' },
];

// ---------------------------------------------------------------------------
// Main Layout
// ---------------------------------------------------------------------------

export default function MainLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  return (
    <>
      <style>{`
        /* ── Reset & tokens ─────────────────────────────────────── */
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .oe-layout {
          display: flex;
          min-height: 100vh;
          background: #F5F5F3;
          font-family: 'Inter', system-ui, sans-serif;
        }

        /* ── Sidebar ────────────────────────────────────────────── */
        .oe-sidebar {
          width: 240px;
          flex-shrink: 0;
          background: #fff;
          border-right: 0.5px solid rgba(0,0,0,0.08);
          display: flex;
          flex-direction: column;
          position: fixed;
          top: 0; left: 0; bottom: 0;
          z-index: 100;
          transition: width 0.2s ease;
          overflow: hidden;
        }
        .oe-sidebar.collapsed { width: 64px; }

        /* Logo area */
        .oe-sidebar-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 18px 16px;
          border-bottom: 0.5px solid rgba(0,0,0,0.06);
          flex-shrink: 0;
          min-height: 64px;
        }
        .oe-logo-icon {
          width: 32px; height: 32px;
          background: #1B4F8A;
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          color: #fff;
          font-size: 16px;
          font-weight: 700;
        }
        .oe-logo-text {
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .oe-logo-text span:first-child {
          font-size: 13.5px;
          font-weight: 700;
          color: #1B4F8A;
          white-space: nowrap;
          letter-spacing: -0.01em;
        }
        .oe-logo-text span:last-child {
          font-size: 10px;
          color: #888780;
          white-space: nowrap;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        /* Portal tabs */
        .oe-portal-tabs {
          display: flex;
          margin: 10px 12px;
          background: #F1EFE8;
          border-radius: 7px;
          padding: 3px;
          flex-shrink: 0;
        }
        .oe-portal-tab {
          flex: 1;
          text-align: center;
          padding: 5px 8px;
          font-size: 11.5px;
          font-weight: 500;
          border-radius: 5px;
          cursor: pointer;
          color: #888780;
          border: none;
          background: none;
          font-family: inherit;
          transition: all 0.15s;
          white-space: nowrap;
        }
        .oe-portal-tab.active {
          background: #fff;
          color: #1B4F8A;
          font-weight: 600;
          box-shadow: 0 1px 4px rgba(0,0,0,0.1);
        }

        /* Nav section label */
        .oe-nav-label {
          font-size: 9.5px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #B4B2A9;
          padding: 10px 16px 4px;
          white-space: nowrap;
          overflow: hidden;
        }

        /* Nav scroll area */
        .oe-nav-scroll {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          padding-bottom: 16px;
        }
        .oe-nav-scroll::-webkit-scrollbar { width: 4px; }
        .oe-nav-scroll::-webkit-scrollbar-thumb { background: #E0DEDB; border-radius: 2px; }

        /* Nav item */
        .oe-nav-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 16px;
          font-size: 13px;
          font-weight: 400;
          color: #5F5E5A;
          text-decoration: none;
          border-radius: 0;
          transition: background 0.12s, color 0.12s;
          white-space: nowrap;
          overflow: hidden;
          position: relative;
          cursor: pointer;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
          font-family: inherit;
        }
        .oe-nav-item:hover { background: #F5F4F1; color: #1C1C1A; }
        .oe-nav-item.active {
          background: #EBF3FC;
          color: #185FA5;
          font-weight: 500;
        }
        .oe-nav-item.active::before {
          content: '';
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 3px;
          background: #185FA5;
          border-radius: 0 2px 2px 0;
        }
        .oe-nav-item i {
          font-size: 17px;
          flex-shrink: 0;
          width: 20px;
          text-align: center;
        }

        /* Sidebar footer — Tajmahal image area */
        .oe-sidebar-footer {
          flex-shrink: 0;
          height: 80px;
          background: linear-gradient(to top, rgba(27,79,138,0.05), transparent);
          display: flex;
          align-items: flex-end;
          justify-content: center;
          padding-bottom: 8px;
          overflow: hidden;
        }
        .oe-sidebar-footer i {
          font-size: 48px;
          color: rgba(27,79,138,0.12);
        }

        /* ── Main area ──────────────────────────────────────────── */
        .oe-main {
          margin-left: 240px;
          flex: 1;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          transition: margin-left 0.2s ease;
        }
        .oe-main.collapsed { margin-left: 64px; }

        /* ── Header ─────────────────────────────────────────────── */
        .oe-header {
          height: 64px;
          background: #fff;
          border-bottom: 0.5px solid rgba(0,0,0,0.08);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          position: sticky;
          top: 0;
          z-index: 50;
          flex-shrink: 0;
        }

        /* Left: hamburger + E-Time */
        .oe-header-left {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .oe-hamburger {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 20px;
          color: #5F5E5A;
          padding: 4px;
          border-radius: 5px;
          display: flex;
          align-items: center;
          transition: background 0.12s;
        }
        .oe-hamburger:hover { background: #F1EFE8; }
        .oe-etime {
          font-size: 13.5px;
          color: #5F5E5A;
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .oe-etime strong { color: #1B4F8A; font-weight: 600; }

        /* Right: actions */
        .oe-header-right {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .oe-header-btn {
          position: relative;
          background: none;
          border: none;
          cursor: pointer;
          width: 36px; height: 36px;
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          color: #5F5E5A;
          font-size: 18px;
          transition: background 0.12s;
        }
        .oe-header-btn:hover { background: #F1EFE8; }
        .oe-notif-badge {
          position: absolute;
          top: 4px; right: 4px;
          width: 16px; height: 16px;
          background: #E24B4A;
          color: #fff;
          border-radius: 50%;
          font-size: 9px;
          font-weight: 700;
          display: flex; align-items: center; justify-content: center;
        }
        .oe-header-divider {
          width: 1px; height: 28px;
          background: rgba(0,0,0,0.08);
          margin: 0 6px;
        }

        /* User pill */
        .oe-user-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 4px 10px 4px 4px;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.12s;
          border: none;
          background: none;
          font-family: inherit;
        }
        .oe-user-pill:hover { background: #F1EFE8; }
        .oe-avatar {
          width: 32px; height: 32px;
          border-radius: 50%;
          background: #1B4F8A;
          color: #fff;
          font-size: 12px;
          font-weight: 700;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .oe-user-info { text-align: left; }
        .oe-user-name { font-size: 13px; font-weight: 600; color: #1C1C1A; line-height: 1.2; }
        .oe-user-role { font-size: 10.5px; color: #888780; line-height: 1.2; }

        /* ── Page content ───────────────────────────────────────── */
        .oe-content {
          flex: 1;
          overflow-y: auto;
        }

        /* Dark mode */
        @media (prefers-color-scheme: dark) {
          .oe-layout    { background: #141412; }
          .oe-sidebar   { background: #1C1C1A; border-color: rgba(255,255,255,0.06); }
          .oe-header    { background: #1C1C1A; border-color: rgba(255,255,255,0.06); }
          .oe-nav-label { color: #444441; }
          .oe-nav-item  { color: #888780; }
          .oe-nav-item:hover { background: #2C2C28; color: #D3D1C7; }
          .oe-nav-item.active { background: #04233A; color: #85B7EB; }
          .oe-portal-tabs { background: #2C2C28; }
          .oe-portal-tab.active { background: #1C1C1A; color: #85B7EB; }
          .oe-logo-text span:first-child { color: #85B7EB; }
          .oe-etime { color: #888780; }
          .oe-etime strong { color: #85B7EB; }
          .oe-user-name { color: #D3D1C7; }
          .oe-hamburger { color: #888780; }
          .oe-hamburger:hover { background: #2C2C28; }
          .oe-header-btn { color: #888780; }
          .oe-header-btn:hover { background: #2C2C28; }
          .oe-header-divider { background: rgba(255,255,255,0.08); }
          .oe-user-pill:hover { background: #2C2C28; }
        }

        @media (max-width: 768px) {
          .oe-sidebar { transform: translateX(-100%); }
          .oe-sidebar.mobile-open { transform: translateX(0); }
          .oe-main { margin-left: 0 !important; }
        }
      `}</style>

      <div className="oe-layout">

        {/* ── Sidebar ─────────────────────────────────────────────── */}
        <aside className={`oe-sidebar${sidebarOpen ? '' : ' collapsed'}`}>

          {/* Logo */}
          <div className="oe-sidebar-logo">
            <div className="oe-logo-icon">OE</div>
            {sidebarOpen && (
              <div className="oe-logo-text">
                <span>OriginEdge</span>
                <span>Technologies</span>
              </div>
            )}
          </div>

          {/* Portal tabs */}
          {sidebarOpen && (
            <div className="oe-portal-tabs">
              <button className="oe-portal-tab active">Employee</button>
              <button className="oe-portal-tab">HR Portal</button>
            </div>
          )}

          {/* Nav */}
          <nav className="oe-nav-scroll" aria-label="Main navigation">
            {sidebarOpen && <div className="oe-nav-label">My Dashboard</div>}
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `oe-nav-item${isActive ? ' active' : ''}`
                }
                title={!sidebarOpen ? item.label : undefined}
              >
                <i className={`ti ti-${item.icon}`} aria-hidden="true" />
                {sidebarOpen && item.label}
              </NavLink>
            ))}
          </nav>

          {/* Footer decoration */}
          <div className="oe-sidebar-footer">
            {sidebarOpen && <i className="ti ti-building-mosque" aria-hidden="true" />}
          </div>
        </aside>

        {/* ── Main area ───────────────────────────────────────────── */}
        <div className={`oe-main${sidebarOpen ? '' : ' collapsed'}`}>

          {/* Header */}
          <header className="oe-header">
            <div className="oe-header-left">
              <button
                className="oe-hamburger"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-label="Toggle sidebar"
              >
                <i className="ti ti-menu-2" aria-hidden="true" />
              </button>
              <div className="oe-etime">
                <i className="ti ti-clock" aria-hidden="true" />
                E-Time Out: <strong>{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</strong>
              </div>
            </div>

            <div className="oe-header-right">
              <button className="oe-header-btn" aria-label="Notifications">
                <i className="ti ti-bell" aria-hidden="true" />
                <span className="oe-notif-badge">2</span>
              </button>
              <button className="oe-header-btn" aria-label="Messages">
                <i className="ti ti-message" aria-hidden="true" />
              </button>
              <button className="oe-header-btn" aria-label="Settings">
                <i className="ti ti-settings" aria-hidden="true" />
              </button>
              <div className="oe-header-divider" aria-hidden="true" />
              <button className="oe-user-pill" aria-label="User menu">
                <div className="oe-avatar">JD</div>
                <div className="oe-user-info">
                  <div className="oe-user-name">John Doe</div>
                  <div className="oe-user-role">Senior Team Lead</div>
                </div>
              </button>
            </div>
          </header>

          {/* Page content */}
          <main className="oe-content">
            {children}
          </main>
        </div>

      </div>
    </>
  );
}