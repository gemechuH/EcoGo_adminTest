import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { fullName, email, phone, password } = body;

    if (!fullName || !email || !phone) {
      return NextResponse.json(
        {
          success: false,
          error: "fullName, email, phone and password are required",
        },
        { status: 400 }
      );
    }

    // ---------------------------
    // 0️⃣ Check if email already exists
    // ---------------------------
    const emailSnap = await adminDb
      .collection("super_admins")
      .where("email", "==", email)
      .get();

    if (!emailSnap.empty) {
      return NextResponse.json(
        {
          success: false,
          error: "Email already exists",
        },
        { status: 400 }
      );
    }

    // ---------------------------
    // 1️⃣ Fetch role info
    // ---------------------------
    const roleRef = adminDb.collection("roles").doc("super_admin");
    const roleSnap = await roleRef.get();

    if (!roleSnap.exists) {
      return NextResponse.json(
        { success: false, error: "Role document 'super_admin' not found" },
        { status: 500 }
      );
    }

    const roleData = roleSnap.data()!;
    const roleId = roleSnap.id;

    // ---------------------------
    // 2️⃣ Create super_admin document
    // ---------------------------
    const newSuperAdminRef = adminDb.collection("super_admins").doc();
    const superAdminId = newSuperAdminRef.id;

    const superAdminData = {
      fullName,
      email,
      phone,
      roleId,
      password,
      role: "super_admin",
      permissions: roleData.permissions,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await newSuperAdminRef.set(superAdminData);

    // ---------------------------
    // 3️⃣ Also create user document
    // ---------------------------
    const userRef = adminDb.collection("users").doc(superAdminId);

    const userData = {
      fullName,
      email,
      phone,
      roleId,
      role: "super_admin",
      permissions: roleData.permissions,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await userRef.set(userData);

    return NextResponse.json({
      success: true,
      message: "Super Admin created successfully",
      superAdminId,
      roleId,
      permissions: roleData.permissions,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const snap = await adminDb.collection("super_admins").get();

    const admins = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({
      success: true,
      admins,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
