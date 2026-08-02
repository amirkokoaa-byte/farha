import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { InvitePage } from './pages/InvitePage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* الصفحة الرئيسية: لوحة تحكم الإدارة */}
        <Route path="/" element={<Dashboard />} />
        
        {/* التوجيه الديناميكي: صفحة الدعوة المخصصة */}
        <Route path="/:inviteId" element={<InvitePage />} />
        
        {/* التوجيه عند إدخال مسار خاطئ */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

