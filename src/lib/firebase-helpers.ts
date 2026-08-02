import { db } from './firebaseConfig'; // Assuming firebaseConfig is initialized
import { 
  collection, 
  doc, 
  getDoc, 
  addDoc, 
  setDoc,
  serverTimestamp,
  getDocs
} from 'firebase/firestore';

/**
 * 1. توليد الرابط المختصر (Unique ID Generation)
 */
export function generateUniqueInviteId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `invite_${result}`;
}

/**
 * حفظ الدعوة في قاعدة البيانات
 */
export async function saveInvitationData(inviteId: string, data: any) {
  try {
    const inviteRef = doc(db, "Invitations", inviteId);
    await setDoc(inviteRef, {
      ...data,
      // For security rules: Assign to a mock owner UID for now, 
      // in a real app this comes from Firebase Auth (request.auth.uid)
      owner_uid: "demo_admin_uid", 
      createdAt: serverTimestamp()
    });
    console.log("تم حفظ الدعوة بنجاح في قاعدة البيانات!");
  } catch (error) {
    console.error("خطأ أثناء حفظ الدعوة:", error);
    throw error;
  }
}

/**
 * 2. كود الواجهة الأمامية: جلب بيانات الدعوة (Frontend Fetching Logic)
 */
export async function fetchInvitationData(inviteId: string) {
  try {
    // 1. جلب البيانات الأساسية للدعوة (أسماء، تاريخ، تصميم)
    const inviteRef = doc(db, "Invitations", inviteId);
    const inviteSnap = await getDoc(inviteRef);

    if (inviteSnap.exists()) {
      console.log("تم العثور على الدعوة:", inviteSnap.data());
      
      // 2. جلب التهاني المرتبطة بهذه الدعوة فقط (المجموعة الفرعية)
      const guestbookRef = collection(db, "Invitations", inviteId, "Guestbook");
      const guestbookSnap = await getDocs(guestbookRef);
      
      let messages: any[] = [];
      guestbookSnap.forEach((doc) => {
        messages.push(doc.data());
      });
      
      console.log("رسائل التهنئة:", messages);
      
      return {
        invitation: inviteSnap.data(),
        guestbook: messages
      };
    } else {
      console.log("هذه الدعوة غير موجودة أو الرابط خطأ.");
      return null;
    }
  } catch (error) {
    console.error("حدث خطأ أثناء جلب البيانات:", error);
    throw error;
  }
}

/**
 * 3. كود إضافة تهنئة جديدة (Add Guestbook Entry)
 */
export async function addCongratulationMessage(inviteId: string, guestName: string, messageText: string) {
  try {
    // الإشارة إلى المجموعة الفرعية 'Guestbook' داخل الدعوة المحددة
    const guestbookRef = collection(db, "Invitations", inviteId, "Guestbook");
    
    // إضافة التهنئة
    await addDoc(guestbookRef, {
      name: guestName,
      message: messageText,
      timestamp: serverTimestamp() // لتسجيل وقت الإرسال بدقة
    });
    
    console.log("تم إرسال التهنئة بنجاح!");
  } catch (error) {
    console.error("خطأ في إرسال التهنئة:", error);
    throw error;
  }
}
