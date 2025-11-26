// lib/getRole.ts
import { adminDb } from "./firebaseAdmin";

export async function getRoleById(roleId: string) {
  try {
    const snap = await adminDb.collection("roles").doc(roleId).get();
    if (!snap.exists) return null;
    return snap.data();
  } catch (err) {
    console.error("🔥 getRoleById error:", err);
    return null;
  }
}
