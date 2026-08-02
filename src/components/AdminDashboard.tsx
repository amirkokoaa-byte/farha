import React, { useState } from 'react';
import { CreationPanel } from './CreationPanel';
import { DesignPanel } from './DesignPanel';
import { AudioPanel } from './AudioPanel';
import { ManagementTable } from './ManagementTable';
import { SystemSettingsPanel } from './SystemSettingsPanel';
import { InvitationView } from './InvitationView';
import { InvitationData } from '../types';
import { X, Check, Link as LinkIcon, Copy } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export function AdminDashboard() {
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
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

  const handleSaveInvitation = async () => {
    try {
      let docId = formData.id;
      if (!docId) {
        // Create new
        const docRef = await addDoc(collection(db, 'invitations'), {
          ...formData,
          isActive: true,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        docId = docRef.id;
        setFormData(prev => ({ ...prev, id: docId }));
      } else {
        // Update existing
        const docRef = doc(db, 'invitations', docId);
        await updateDoc(docRef, {
          ...formData,
          isActive: true,
          updatedAt: serverTimestamp(),
        });
      }
      
      const domain = window.location.origin;
      setGeneratedLink(`${domain}/invite_${docId}`);
      setIsCopied(false);
    } catch (err) {
      console.error('Error saving invitation:', err);
      alert('حدث خطأ أثناء حفظ الدعوة');
    }
  };

  const copyToClipboard = async () => {
    if (generatedLink) {
      await navigator.clipboard.writeText(generatedLink);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  if (previewId) {
    return <InvitationView onBack={() => setPreviewId(null)} data={formData} />;
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
            <CreationPanel data={formData} onChange={handleUpdate} onSave={handleSaveInvitation} />
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

      {/* Success Modal for Link Generation */}
      <AnimatePresence>
        {generatedLink && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
          >
             <motion.div 
               initial={{ scale: 0.9, y: 20 }}
               animate={{ scale: 1, y: 0 }}
               exit={{ scale: 0.9, y: 20 }}
               className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative"
             >
                <button 
                  onClick={() => setGeneratedLink(null)} 
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>
                <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check size={32} />
                </div>
                <h3 className="text-2xl font-bold text-center text-gray-800 mb-2">تم إنشاء الدعوة بنجاح!</h3>
                <p className="text-center text-gray-500 mb-6">يمكنك الآن نسخ الرابط المختصر ومشاركته مع ضيوفك</p>
                
                <div className="flex items-center gap-3 bg-stone-50 p-4 rounded-xl mb-6 border border-stone-200">
                   <LinkIcon className="text-amber-500 shrink-0" size={20} />
                   <span className="flex-1 text-left text-gray-700 font-medium truncate" dir="ltr">{generatedLink}</span>
                   <button 
                     onClick={copyToClipboard}
                     className="bg-white px-4 py-2 rounded-lg border border-stone-200 text-sm font-bold text-gray-700 hover:text-amber-600 hover:border-amber-300 shadow-sm transition-all flex items-center gap-2"
                   >
                     {isCopied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                     {isCopied ? 'تم النسخ' : 'نسخ'}
                   </button>
                </div>

                <button 
                  onClick={() => {
                    setGeneratedLink(null);
                    setPreviewId('preview');
                  }}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all"
                >
                  فتح الدعوة
                </button>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

