import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { ROLE_PERMISSIONS } from "@/lib/permissions";
import { getRoleById } from "@/lib/getRole";

export async function POST(req: Request) {
  try {
    // 1️⃣ Get user role from token/request
    const role = getRoleById(req);

    // 🔐 Permission Check (CREATE)
    if (!ROLE_PERMISSIONS[role]?.users?.create) {
      return NextResponse.json(
        { error: "Permission denied (CREATE)" },
        { status: 403 }
      );
    }

    // 2️⃣ Parse Request Body
    const body = await req.json();

    if (!body.name || !body.email || !body.roleId) {
      return NextResponse.json(
        { success: false, message: "name, email and roleId are required" },
        { status: 400 }
      );
    }

    // 3️⃣ CHECK IF EMAIL ALREADY EXISTS
    const emailQuery = await adminDb
      .collection("users")
      .where("email", "==", body.email)
      .limit(1)
      .get();

    if (!emailQuery.empty) {
      return NextResponse.json(
        { success: false, message: "Email already exists" },
        { status: 409 }
      );
    }

    // 4️⃣ Create Firestore document (Auto ID)
    const docRef = adminDb.collection("users").doc();
    const uid = docRef.id;

    const userData = {
      uid,
      name: body.name,
      email: body.email,
      phone: body.phone || "",
      roleId: body.roleId,
      status: body.status || "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // 5️⃣ Save user to DB
    await docRef.set(userData);

    return NextResponse.json(
      {
        success: true,
        message: "User created successfully",
        userId: uid,
        user: userData,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("CREATE USER ERROR:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Unknown server error" },
      { status: 500 }
    );
  }
}
