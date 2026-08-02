import admin from 'firebase-admin';
import fs from 'fs';

const config = JSON.parse(fs.readFileSync("./firebase-applet-config.json"));
admin.initializeApp({
  projectId: config.projectId,
});

async function main() {
  const db = admin.firestore();
  const snapshot = await db.collection("invitations").get();
  snapshot.forEach(doc => {
    console.log(doc.id, '=>', doc.data());
  });
}
main();
