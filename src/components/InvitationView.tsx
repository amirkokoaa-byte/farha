import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Invitation, GuestbookEntry } from '../types';
import { Heart, Send } from 'lucide-react';
import { auth } from '../lib/firebase';

export function InvitationView() {
  const { inviteId } = useParams<{ inviteId: string }>();
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error404, setError404] = useState(false);

  const [guestbook, setGuestbook] = useState<GuestbookEntry[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!inviteId) return;

    const fetchInvitation = async () => {
      try {
        setLoading(true);
        setError404(false);
        const inviteRef = doc(db, 'Invitations', inviteId);
        const inviteSnap = await getDoc(inviteRef);

        if (inviteSnap.exists()) {
          setInvitation({ id: inviteSnap.id, ...inviteSnap.data() } as Invitation);
        } else {
          setError404(true);
        }
      } catch (err: any) {
        // "Missing or insufficient permissions" means either it doesn't exist 
        // or it's a draft and the user is not the admin.
        // We catch it and show 404 cleanly, Zero-External Redirects.
        setError404(true);
        console.warn("Access denied or not found:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInvitation();
  }, [inviteId, auth.currentUser]);

  // Fetch Guestbook separately to ensure isolation
  useEffect(() => {
    if (!invitation || !inviteId) return;

    const gbRef = collection(db, 'Invitations', inviteId, 'Guestbook');
    const q = query(gbRef, orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const entries: GuestbookEntry[] = [];
      snapshot.forEach(docSnap => {
        entries.push({ id: docSnap.id, ...docSnap.data() } as GuestbookEntry);
      });
      setGuestbook(entries);
    }, (err) => {
      console.warn("Guestbook access denied", err);
    });

    return () => unsubscribe();
  }, [invitation, inviteId]);

  const submitGreeting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteId || !authorName.trim() || !newMessage.trim()) return;

    setSubmitting(true);
    try {
      await addDoc(collection(db, 'Invitations', inviteId, 'Guestbook'), {
        authorName: authorName.trim(),
        message: newMessage.trim(),
        createdAt: serverTimestamp()
      });
      setAuthorName('');
      setNewMessage('');
    } catch (err) {
      console.error("Failed to post message", err);
      alert("Could not post message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-stone-50 text-stone-500">Opening invitation...</div>;
  }

  if (error404 || !invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 p-6">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-stone-200 text-center">
          <Heart className="mx-auto text-stone-300 mb-4" size={48} />
          <h2 className="text-2xl font-serif text-stone-800 mb-2">Invitation Unavailable</h2>
          <p className="text-stone-500">This invitation link is invalid or the invitation is no longer available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      <div className="bg-white px-6 py-24 text-center shadow-sm">
        <div className="max-w-2xl mx-auto space-y-6">
          <p className="text-stone-400 uppercase tracking-[0.3em] text-sm font-medium">You are invited to the wedding of</p>
          <h1 className="text-5xl sm:text-7xl font-serif text-stone-800 tracking-tight">
            {invitation.groomName} <span className="text-stone-300 font-light">&</span> {invitation.brideName}
          </h1>
          <div className="w-12 h-px bg-stone-300 mx-auto my-8"></div>
          <div className="space-y-2 text-stone-600 text-lg">
            <p>{invitation.date}</p>
            <p>{invitation.venue}</p>
          </div>
          
          {invitation.status === 'draft' && (
            <div className="inline-block mt-8 bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-medium">
              Preview Mode - Draft
            </div>
          )}
        </div>
      </div>

      <div className="max-w-xl mx-auto px-6 mt-16 space-y-10">
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-serif text-stone-800">Guestbook</h3>
          <p className="text-stone-500">Leave a message for the couple</p>
        </div>

        <form onSubmit={submitGreeting} className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 space-y-4">
          <div>
            <input
              type="text"
              placeholder="Your Name"
              required
              maxLength={100}
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-400"
            />
          </div>
          <div>
            <textarea
              placeholder="Your Wishes..."
              required
              maxLength={1000}
              rows={3}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-400 resize-none"
            />
          </div>
          <button
            type="submit"
            disabled={submitting || !authorName.trim() || !newMessage.trim()}
            className="w-full flex items-center justify-center space-x-2 bg-stone-800 text-white py-3 rounded-xl font-medium hover:bg-stone-700 disabled:opacity-50 transition-colors"
          >
            <span>{submitting ? 'Sending...' : 'Send Message'}</span>
            <Send size={18} />
          </button>
        </form>

        <div className="space-y-4">
          {guestbook.map((entry) => (
            <div key={entry.id} className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
              <p className="text-stone-800 text-lg mb-3">{entry.message}</p>
              <p className="text-stone-400 text-sm">— {entry.authorName}</p>
            </div>
          ))}
          {guestbook.length === 0 && (
            <p className="text-center text-stone-400 py-8">Be the first to leave a message!</p>
          )}
        </div>
      </div>
    </div>
  );
}
