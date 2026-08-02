import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { AdminDashboard } from './components/AdminDashboard';
import { GuestInvitation } from './components/GuestInvitation';
import { Login } from './components/Login';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/:invitePath" element={<DynamicRoute />} />
        <Route path="/*" element={<AdminRoute />} />
      </Routes>
    </BrowserRouter>
  );
}

function DynamicRoute() {
  const { invitePath } = useParams<{ invitePath: string }>();
  if (invitePath?.startsWith('invite_')) {
    return <GuestInvitation />;
  }
  return <AdminRoute />;
}

function AdminRoute() {
  const [user, setUser] = useState(auth.currentUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5]">
      <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin"></div>
    </div>
  );
  if (!user) return <Login />;
  
  return <AdminDashboard />;
}
