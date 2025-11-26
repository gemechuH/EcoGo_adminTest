import { NextRequest, NextResponse } from "next/server";
import * as admin from "firebase-admin";

// Initialize Firebase Admin only once
if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_KEY ?? "{}");

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

}

const db = admin.firestore();

// GET → Fetch all users
export async function GET() {
  try {
    const snapshot = await db.collection("users").get();

    const users = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ users });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST → Create new user
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Basic validation
    if (!body.name || !body.email || !body.roleId) {
      return NextResponse.json(
        {
          error: "name, email, and roleId are required.",
        },
        { status: 400 }
      );
    }

    const newUser = {
      name: body.name,
      email: body.email,
      phone: body.phone || "",
      roleId: body.roleId,
      status: "active",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection("users").add(newUser);

    return NextResponse.json(
      {
        message: "User created successfully",
        id: docRef.id,
        user: newUser,
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
