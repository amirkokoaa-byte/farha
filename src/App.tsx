import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useParams, useNavigate } from 'react-router-dom';
import { auth, loginWithGoogle, logout } from './lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { AdminDashboard } from './components/AdminDashboard';
import { InvitationView } from './components/InvitationView';

function AppContent() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<Home user={user} />} />
      <Route path="/admin" element={<AdminDashboard user={user} />} />
      <Route path="/:inviteId" element={<InvitationView />} />
    </Routes>
  );
}

function Home({ user }: { user: User | null }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden p-8 text-center">
        <h1 className="text-3xl font-serif text-stone-800 mb-6">Wedding Invites SaaS</h1>
        {user ? (
          <div className="space-y-4">
            <p className="text-stone-600">Welcome back, {user.email}</p>
            <button
              onClick={() => navigate('/admin')}
              className="w-full bg-stone-800 text-white py-3 rounded-xl font-medium hover:bg-stone-700 transition-colors"
            >
              Go to Dashboard
            </button>
            <button
              onClick={logout}
              className="w-full bg-stone-100 text-stone-600 py-3 rounded-xl font-medium hover:bg-stone-200 transition-colors"
            >
              Log out
            </button>
          </div>
        ) : (
          <button
            onClick={loginWithGoogle}
            className="w-full bg-stone-800 text-white py-3 rounded-xl font-medium hover:bg-stone-700 transition-colors"
          >
            Sign in with Google
          </button>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
