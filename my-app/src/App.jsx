import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';

const AttendanceReport  = lazy(() => import('./pages/Attendance/AttendanceReport'));
const OTManagement      = lazy(() => import('./pages/OT/OTManagement'));
const PerformanceReview = lazy(() => import('./pages/Performance/PerformanceReview'));
const CompanyHolidays   = lazy(() => import('./pages/Holidays/CompanyHolidays'));

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Suspense fallback={<div style={{padding:40,textAlign:'center'}}>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Navigate to="/attendance" replace />} />
            <Route path="/attendance"  element={<AttendanceReport />}  />
            <Route path="/ot"          element={<OTManagement />}      />
            <Route path="/performance" element={<PerformanceReview />} />
            <Route path="/holidays"    element={<CompanyHolidays />}   />
          </Routes>
        </Suspense>
      </MainLayout>
    </BrowserRouter>
  );
}
export default App;