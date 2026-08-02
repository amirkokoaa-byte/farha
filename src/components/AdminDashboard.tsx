import React, { useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { collection, doc, getDoc, setDoc, updateDoc, serverTimestamp, deleteDoc, getDocs } from 'firebase/firestore';
import { db, handleFirestoreError } from '../lib/firebase';
import { Invitation, OperationType } from '../types';
import { useNavigate } from 'react-router-dom';
import { Settings, ExternalLink, Plus, Trash2, Edit } from 'lucide-react';

export function AdminDashboard({ user }: { user: User | null }) {
  const navigate = useNavigate();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInvitations = async () => {
    if (!user) return;
    try {
      setLoading(true);
      // Fetch tracked invite IDs
      const trackedRef = collection(db, 'AdminTracking', user.uid, 'MyInvites');
      const trackedSnapshot = await getDocs(trackedRef);
      
      const loadedInvites: Invitation[] = [];
      for (const trackDoc of trackedSnapshot.docs) {
        const inviteId = trackDoc.id;
        const inviteRef = doc(db, 'Invitations', inviteId);
        try {
          const inviteSnap = await getDoc(inviteRef);
          if (inviteSnap.exists()) {
            loadedInvites.push({ id: inviteSnap.id, ...inviteSnap.data() } as Invitation);
          }
        } catch (err) {
          console.warn(`Failed to fetch invite ${inviteId}`, err);
        }
      }
      setInvitations(loadedInvites);
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, 'AdminTracking');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    fetchInvitations();
  }, [user, navigate]);

  const generateId = () => Math.random().toString(36).substring(2, 10);

  const handleCreate = async () => {
    if (!user) return;
    const inviteId = `inv_${generateId()}`;
    const newInvite: Omit<Invitation, 'id'> = {
      admin_uid: user.uid,
      status: 'draft',
      brideName: 'Bride Name',
      groomName: 'Groom Name',
      date: '2024-12-31',
      venue: 'Wedding Hall',
    };

    try {
      // 1. Create in tracking collection first (we just need the ID to exist)
      await setDoc(doc(db, 'AdminTracking', user.uid, 'MyInvites', inviteId), { createdAt: serverTimestamp() });
      // 2. Create the actual invitation
      await setDoc(doc(db, 'Invitations', inviteId), { ...newInvite, updatedAt: serverTimestamp() });
      await fetchInvitations();
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `Invitations/${inviteId}`);
    }
  };

  const handleToggleStatus = async (invite: Invitation) => {
    try {
      const newStatus = invite.status === 'draft' ? 'published' : 'draft';
      await updateDoc(doc(db, 'Invitations', invite.id), {
        status: newStatus,
        updatedAt: serverTimestamp()
      });
      setInvitations(invs => invs.map(i => i.id === invite.id ? { ...i, status: newStatus } : i));
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `Invitations/${invite.id}`);
    }
  };

  const handleDelete = async (inviteId: string) => {
    if (!user || !window.confirm('Are you sure?')) return;
    try {
      await deleteDoc(doc(db, 'Invitations', inviteId));
      await deleteDoc(doc(db, 'AdminTracking', user.uid, 'MyInvites', inviteId));
      setInvitations(invs => invs.filter(i => i.id !== inviteId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `Invitations/${inviteId}`);
    }
  };

  if (loading) return <div className="p-8 text-center text-stone-500">Loading your dashboard...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-serif text-stone-800">My Invitations</h2>
        <button
          onClick={handleCreate}
          className="flex items-center space-x-2 bg-stone-800 text-white px-4 py-2 rounded-lg hover:bg-stone-700"
        >
          <Plus size={18} />
          <span>New Invitation</span>
        </button>
      </div>

      <div className="grid gap-4">
        {invitations.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-stone-200">
            <p className="text-stone-500">No invitations created yet.</p>
          </div>
        )}
        
        {invitations.map(invite => (
          <div key={invite.id} className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-medium text-stone-800">{invite.groomName} & {invite.brideName}</h3>
              <p className="text-sm text-stone-500">{invite.date} • {invite.venue}</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => handleToggleStatus(invite)}
                className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider ${
                  invite.status === 'published' 
                    ? 'bg-emerald-100 text-emerald-700' 
                    : 'bg-stone-100 text-stone-600'
                }`}
              >
                {invite.status}
              </button>
              
              <button
                onClick={() => navigate(`/${invite.id}`)}
                className="p-2 text-stone-400 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors"
                title="View Invitation"
              >
                <ExternalLink size={18} />
              </button>
              
              <button
                onClick={() => handleDelete(invite.id)}
                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
