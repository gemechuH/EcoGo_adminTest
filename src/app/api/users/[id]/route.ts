import { NextResponse } from "next/server";
import * as admin from "firebase-admin";
import { ROLE_PERMISSIONS } from "@/lib/permissions";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(
      JSON.parse(process.env.FIREBASE_ADMIN_KEY!)
    ),
  });
}

const db = admin.firestore();

// Helper → Get role from header (you can replace with auth logic)
// function getRole(request: Request) {
//   return request.headers.get("x-user-role") || "driver"; // fallback as driver
// }

export type Role = keyof typeof ROLE_PERMISSIONS;

function getRole(request: Request): Role {
  const r = request.headers.get("x-user-role") || "driver";
  return (r in ROLE_PERMISSIONS ? r : "driver") as Role;
}

// ========================
// GET /api/users/:id
// ========================
export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const role = getRole(request);

    if (!ROLE_PERMISSIONS[role]?.users.read) {
      return NextResponse.json(
        { error: "Permission denied (READ)" },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

// ========================
// UPDATE /api/users/:id (PATCH)
// ========================
export async function PATCH(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const role = getRole(request);

    // 🔐 Permission Check (UPDATE)
    if (!ROLE_PERMISSIONS[role]?.users.update) {
      return NextResponse.json(
        { error: "Permission denied (UPDATE)" },
        { status: 403 }
      );
    }

    const { id } = await context.params;
    const body = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const docRef = db.collection("users").doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updateData = {
      ...body,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await docRef.update(updateData);

    return NextResponse.json({
      message: "User updated successfully",
      updated: updateData,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ========================
// DELETE /api/users/:id
// ========================
export async function DELETE(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const role = getRole(request);

    // 🔐 Permission Check (DELETE)
    if (!ROLE_PERMISSIONS[role]?.users.delete) {
      return NextResponse.json(
        { error: "Permission denied (DELETE)" },
        { status: 403 }
      );
    }

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const docRef = db.collection("users").doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await docRef.delete();

    return NextResponse.json({
      message: "User deleted successfully",
      id,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
