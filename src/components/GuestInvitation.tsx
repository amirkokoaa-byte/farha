import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, collection, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { InvitationData, GuestbookEntry } from '../types';
import { InvitationView } from './InvitationView';

export function GuestInvitation() {
  const { id } = useParams<{ id: string }>();
  const [invitation, setInvitation] = useState<InvitationData | null>(null);
  const [guestbook, setGuestbook] = useState<GuestbookEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;
    let unsubscribeGuestbook: (() => void) | undefined;
    
    const fetchInvitation = async () => {
      try {
        const docRef = doc(db, 'invitations', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists() && docSnap.data().isActive) {
          setInvitation({ id: docSnap.id, ...docSnap.data() } as InvitationData);
          
          // Subscribe to guestbook
          unsubscribeGuestbook = onSnapshot(collection(db, `invitations/${id}/guestbook`), (snapshot) => {
            const entries: GuestbookEntry[] = [];
            snapshot.forEach((doc) => entries.push({ id: doc.id, ...doc.data() } as GuestbookEntry));
            // sort by createdAt desc safely
            entries.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
            setGuestbook(entries);
          }, (err) => {
            console.error('Guestbook fetch error:', err);
          });
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Failed to fetch invitation', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchInvitation();
    
    return () => {
      if (unsubscribeGuestbook) unsubscribeGuestbook();
    };
  }, [id]);

  const handleRSVP = async (name: string, guestsCount: number, message?: string) => {
    if (!id) return;
    try {
      await addDoc(collection(db, `invitations/${id}/guestbook`), {
        name,
        guestsCount,
        message,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.error('Failed to send RSVP:', err);
      throw err;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5]">
        <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !invitation) {
    return (
      <div dir="rtl" className="min-h-screen flex items-center justify-center bg-[#FAF8F5] p-4">
        <div className="bg-white p-8 rounded-3xl shadow-lg max-w-md w-full text-center border border-stone-100">
          <div className="w-20 h-20 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">❌</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2 font-serif">الدعوة غير متاحة</h2>
          <p className="text-gray-500">عذراً، هذه الدعوة غير موجودة أو تم إيقافها.</p>
        </div>
      </div>
    );
  }

  return (
    <InvitationView 
      data={invitation} 
      guestbook={guestbook}
      onRSVP={handleRSVP} 
      onBack={() => {}} 
    />
  );
}
