import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

export function Login() {
  const [email, setEmail] = useState(() => localStorage.getItem('admin_email') || 'amir.lamay@yahoo.com');
  const [password, setPassword] = useState(() => localStorage.getItem('admin_password') || 'admin');
  const [rememberMe, setRememberMe] = useState(() => localStorage.getItem('admin_remember') === 'true');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    if (rememberMe) {
      localStorage.setItem('admin_email', email);
      localStorage.setItem('admin_password', password);
      localStorage.setItem('admin_remember', 'true');
    } else {
      localStorage.removeItem('admin_email');
      localStorage.removeItem('admin_password');
      localStorage.removeItem('admin_remember');
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError(err.message || 'فشل تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-lg max-w-md w-full border border-stone-100">
        <h2 className="text-3xl font-bold font-serif text-gray-900 mb-2 text-center">تسجيل الدخول</h2>
        <p className="text-gray-500 text-center mb-8">لوحة تحكم المشرف (Admin)</p>
        
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-sm">{error}</div>}
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-stone-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-500 outline-none transition-all"
              dir="ltr"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-stone-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-500 outline-none transition-all"
              dir="ltr"
            />
          </div>
          <div className="flex items-center gap-2 mt-2">
            <input 
              type="checkbox" 
              id="remember" 
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 text-amber-600 focus:ring-amber-500 border-stone-300 rounded"
            />
            <label htmlFor="remember" className="text-sm text-gray-700 select-none">
              حفظ بيانات الدخول
            </label>
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-colors mt-4"
          >
            {loading ? 'جاري الدخول...' : 'دخول'}
          </button>
        </form>
      </div>
    </div>
  );
}
