import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import fs from 'fs';

const config = JSON.parse(fs.readFileSync("./firebase-applet-config.json"));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

const MOCK_INVITATIONS = [
  {
    id: "INV-10023",
    groomName: "أحمد",
    brideName: "سارة",
    weddingDate: "2024-10-15",
    weddingTime: "20:00",
    message: "نتشرف بدعوتكم لحضور حفل زفافنا",
    font: "Amiri",
    background: "bg-stone-100",
    showPauseButton: true,
    isActive: true,
    createdAt: Date.now(),
  },
  {
    id: "INV-10024",
    groomName: "عمر",
    brideName: "نورة",
    weddingDate: "2024-11-01",
    weddingTime: "19:30",
    message: "بكم تكتمل فرحتنا",
    font: "Cairo",
    background: "bg-orange-50",
    showPauseButton: false,
    isActive: true,
    createdAt: Date.now(),
  }
];

async function seed() {
  try {
    for (const inv of MOCK_INVITATIONS) {
      await setDoc(doc(db, 'invitations', inv.id), inv);
      console.log('Seeded:', inv.id);
    }
  } catch (e) {
    console.error('Error seeding:', e);
  }
  process.exit();
}
seed();
