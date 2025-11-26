// lib/getUser.ts
import { adminDb } from "./firebaseAdmin";

export interface FirestoreUser {
  uid: string;
  email: string;
  name?: string;
  roleId: string; // FIXED
  status: string;
  createdAt: any;
}

export async function getUserById(uid: string): Promise<FirestoreUser | null> {
  try {
    const snap = await adminDb.collection("users").doc(uid).get();

    if (!snap.exists) return null;

    return snap.data() as FirestoreUser;
  } catch (err) {
    console.error("🔥 getUserById error:", err);
    return null;
  }
}
