import admin from "firebase-admin";

if (!admin.apps.length) {
  const raw = process.env.FIREBASE_ADMIN_KEY!;
  const serviceAccount = JSON.parse(raw);

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: serviceAccount.project_id,
      clientEmail: serviceAccount.client_email,
      privateKey: serviceAccount.private_key.replace(/\\n/g, "\n"),
    }),
  });
}

export const adminDb = admin.firestore();
export const adminAuth = admin.auth();
