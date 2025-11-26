import { NextApiRequest } from "next";
import { db } from "../lib/firebaseAdmin";

export async function checkRole(req: NextApiRequest, allowedRoles: string[]) {
  const userId = req.headers["x-user-id"] as string;
  if (!userId) throw new Error("Unauthorized");

  const userDoc = await db.collection("users").doc(userId).get();
  if (!userDoc.exists) throw new Error("Unauthorized");

  const role = userDoc.data()?.role;
  if (!allowedRoles.includes(role)) throw new Error("Forbidden");

  return { uid: userId, role };
}
