// lib/getRole.ts
import { adminAuth } from "./firebaseAdmin";

export async function getRoleById(req: Request): Promise<string> {
  try {
    const authHeader = req.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return "guest";
    }

    const token = authHeader.split(" ")[1];
    const decoded = await adminAuth.verifyIdToken(token);

    return decoded.role || "guest";
  } catch (error) {
    return "guest";
  }
}

