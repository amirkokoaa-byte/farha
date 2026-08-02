import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { InvitationView } from '../components/InvitationView';
import { fetchInvitationData } from '../lib/firebase-helpers';
import { InvitationData } from '../types';
import { AlertCircle } from 'lucide-react';

export function InvitePage() {
  const { inviteId } = useParams<{ inviteId: string }>();
  const [data, setData] = useState<InvitationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (!inviteId) return;
      
      try {
        setLoading(true);
        const result = await fetchInvitationData(inviteId);
        if (result && result.invitation) {
          setData(result.invitation as InvitationData);
        } else {
          // محاولة جلب من التخزين المحلي كبديل (في حالة عدم إعداد Firebase بعد في العرض)
          const savedData = localStorage.getItem(`/${inviteId}`);
          if (savedData) {
            setData(JSON.parse(savedData));
          } else {
            setError(true);
          }
        }
      } catch (e) {
        console.error("Error loading invite:", e);
        // Fallback to localStorage for preview environment if Firebase fails (missing config etc)
        const savedData = localStorage.getItem(`/${inviteId}`);
        if (savedData) {
          setData(JSON.parse(savedData));
        } else {
          setError(true);
        }
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [inviteId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center" dir="rtl">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500 font-medium">جاري تجهيز الدعوة...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-4 font-sans" dir="rtl">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center">
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={40} />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4 font-serif">الدعوة غير موجودة</h1>
          <p className="text-gray-500 mb-8 leading-relaxed">
            عذراً، الرابط الذي تحاول الوصول إليه غير صحيح أو تم حذف الدعوة من قبل أصحابها.
          </p>
          <Link to="/" className="inline-block bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-8 rounded-xl shadow-md transition-all">
            العودة للرئيسية
          </Link>
        </div>
      </div>
    );
  }

  return <InvitationView data={data} onBack={() => {}} />;
}
