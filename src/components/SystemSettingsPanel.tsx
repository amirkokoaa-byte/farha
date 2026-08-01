import React, { useState } from 'react';
import { Database, Shield, ShieldCheck, Key, Eye, EyeOff, Save } from 'lucide-react';

export function SystemSettingsPanel() {
  const [isIsolationEnabled, setIsIsolationEnabled] = useState(true);
  const [showApiKey, setShowApiKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    // Simulate secure API call to backend
    setTimeout(() => setIsSaving(false), 1500);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6">
      <div className="flex items-center gap-3 mb-6 border-b border-stone-100 pb-4">
        <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center border border-amber-100">
          <Database size={20} className="text-amber-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">إعدادات النظام وقاعدة البيانات</h2>
          <p className="text-sm text-gray-500 mt-1">إعدادات الربط وتأمين بيانات الدعوات</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="space-y-5">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Key size={16} className="text-gray-400" />
              مفتاح واجهة برمجة تطبيقات Firebase
            </label>
            <div className="relative">
              <input
                type={showApiKey ? "text" : "password"}
                placeholder="AIzaSyB..."
                defaultValue="AIzaSyB1234567890abcdef"
                className="w-full px-4 py-3 pl-12 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition-all font-sans"
                dir="ltr"
              />
              <button 
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 transition-colors"
                title={showApiKey ? "إخفاء المفتاح" : "إظهار المفتاح"}
              >
                {showApiKey ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-1">يتم تشفير هذا المفتاح وإرساله بشكل آمن للخادم.</p>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Database size={16} className="text-gray-400" />
              رابط قاعدة البيانات
            </label>
            <input
              type="text"
              placeholder="https://your-project.firebaseio.com"
              defaultValue="https://your-project.firebaseio.com"
              className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition-all font-sans text-gray-600"
              dir="ltr"
            />
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <div className={`p-6 rounded-2xl border transition-all duration-300 ${isIsolationEnabled ? 'bg-amber-50/50 border-amber-200 shadow-[0_0_20px_rgba(212,184,114,0.1)]' : 'bg-stone-50 border-stone-200'}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className={`mt-1 transition-colors ${isIsolationEnabled ? 'text-amber-500' : 'text-gray-400'}`}>
                  {isIsolationEnabled ? <ShieldCheck size={24} /> : <Shield size={24} />}
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-800 mb-1">تفعيل العزل التام للبيانات لكل دعوة</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    يضمن هذا الخيار عدم تداخل البيانات بين الدعوات المختلفة وتطبيق قواعد أمان صارمة (Security Rules) على كل سجل.
                  </p>
                </div>
              </div>
              
              <button 
                onClick={() => setIsIsolationEnabled(!isIsolationEnabled)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 ${isIsolationEnabled ? 'bg-amber-500 shadow-[0_0_10px_rgba(212,184,114,0.5)]' : 'bg-gray-200'}`}
                role="switch"
                aria-checked={isIsolationEnabled}
              >
                <span
                  aria-hidden="true"
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isIsolationEnabled ? '-translate-x-5' : 'translate-x-0'}`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end border-t border-stone-100 pt-6">
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 bg-gray-900 hover:bg-black text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md active:scale-95 disabled:opacity-70"
        >
          {isSaving ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Save size={18} />
          )}
          <span>{isSaving ? 'جاري الحفظ...' : 'حفظ الإعدادات بأمان'}</span>
        </button>
      </div>
    </div>
  );
}
