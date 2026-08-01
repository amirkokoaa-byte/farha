import React, { useState } from 'react';
import { CreationPanel } from './components/CreationPanel';
import { DesignPanel } from './components/DesignPanel';
import { AudioPanel } from './components/AudioPanel';
import { ManagementTable } from './components/ManagementTable';
import { SystemSettingsPanel } from './components/SystemSettingsPanel';
import { InvitationView } from './components/InvitationView';
import { InvitationData } from './types';

export default function App() {
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [formData, setFormData] = useState<InvitationData>({
    id: '',
    groomName: '',
    brideName: '',
    weddingDate: '',
    weddingTime: '',
    message: '',
    font: 'Amiri',
    background: 'bg-stone-50',
    showPauseButton: true,
  });

  const handleUpdate = (updates: Partial<InvitationData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  if (previewId) {
    return <InvitationView onBack={() => setPreviewId(null)} />;
  }

  return (
    <div dir="rtl" className="min-h-screen bg-[#FAF8F5] text-gray-800 p-4 lg:p-8 font-sans">
      <div className="max-w-screen-2xl mx-auto space-y-6">
        
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-serif">لوحة تحكم دعوات الزفاف</h1>
            <p className="text-gray-500 mt-1">إدارة وإنشاء دعوات الزفاف الرقمية بسهولة واحترافية</p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setPreviewId('preview')}
              className="text-amber-600 font-semibold text-sm hover:text-amber-700 transition-colors underline underline-offset-4 ml-4"
            >
              معاينة الدعوة الجديدة
            </button>
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold border-2 border-amber-200">
              أ
            </div>
          </div>
        </header>

        {/* Top 3-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left Panel: Creation */}
          <div className="lg:col-span-3">
            <CreationPanel data={formData} onChange={handleUpdate} />
          </div>

          {/* Center Panel: Design */}
          <div className="lg:col-span-6">
            <DesignPanel data={formData} onChange={handleUpdate} />
          </div>

          {/* Right Panel: Audio */}
          <div className="lg:col-span-3">
            <AudioPanel data={formData} onChange={handleUpdate} />
          </div>

        </div>

        {/* Bottom Panel: Management */}
        <div className="pt-4">
          <ManagementTable onPreview={setPreviewId} />
        </div>

        {/* System Settings */}
        <div className="pt-4 pb-8">
          <SystemSettingsPanel />
        </div>

      </div>
    </div>
  );
}

