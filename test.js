import { initializeApp } from 'firebase/app';
import { getFirestore, addDoc, collection, serverTimestamp, getDoc, doc } from 'firebase/firestore';
import fs from 'fs';

const config = JSON.parse(fs.readFileSync("./firebase-applet-config.json"));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

async function test() {
  try {
    // We cannot create a document unauthenticated because of rules.
    // Let's just read from it.
    const docRef = doc(db, 'invitations', 'test_id');
    const docSnap = await getDoc(docRef);
    console.log('Exists:', docSnap.exists());
  } catch (e) {
    console.error('Error:', e);
  }
  process.exit();
}
test();
