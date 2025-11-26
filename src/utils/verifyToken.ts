// server/utils/verifyToken.ts (example)
import * as admin from "firebase-admin";
import { NextRequest } from "next/server";

export async function verifyIdTokenFromHeader(req: NextRequest) {
  const auth = req.headers.get("authorization") || "";
  if (!auth.startsWith("Bearer ")) return null;
  const idToken = auth.split(" ")[1];
  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    return decoded.uid;
  } catch (e) {
    return null;
  }
}
