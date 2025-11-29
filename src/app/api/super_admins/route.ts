import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { getAuth } from "firebase-admin/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fullName, email, phone, password } = body;

    if (!fullName || !email || !phone || !password) {
      return NextResponse.json(
        {
          success: false,
          error: "fullName, email, phone and password are required",
        },
        { status: 400 }
      );
    }

    // ---------------------------------------------------
    // 0️⃣ Check if email exists in Firestore
    // ---------------------------------------------------
    const firestoreCheck = await adminDb
      .collection("super_admins")
      .where("email", "==", email)
      .get();

    if (!firestoreCheck.empty) {
      return NextResponse.json(
        { success: false, error: "Email already exists (Firestore)" },
        { status: 400 }
      );
    }

    // ---------------------------------------------------
    // 1️⃣ Check or create Auth user
    // ---------------------------------------------------
    let authUser;
    try {
      // Try to create user in Firebase Auth
      authUser = await getAuth().createUser({
        email,
        password,
        displayName: fullName,
      });
    } catch (error: any) {
      if (error.code === "auth/email-already-exists") {
        return NextResponse.json(
          { success: false, error: "Email already exists in Firebase Auth" },
          { status: 400 }
        );
      }
      throw error;
    }

    const superAdminId = authUser.uid;

    // ---------------------------------------------------
    // 2️⃣ Fetch Permissions for "super_admin"
    // ---------------------------------------------------
    const roleRef = adminDb.collection("roles").doc("super_admin");
    const roleSnap = await roleRef.get();

    if (!roleSnap.exists) {
      return NextResponse.json(
        { success: false, error: "Role 'super_admin' not found" },
        { status: 500 }
      );
    }

    const roleData = roleSnap.data()!;
    const roleId = roleSnap.id;

    // ---------------------------------------------------
    // 3️⃣ Create Firestore Super Admin document
    // ---------------------------------------------------
    const superAdminData = {
      fullName,
      email,
      phone,
      roleId,
      role: "super_admin",
      permissions: roleData.permissions,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await adminDb
      .collection("super_admins")
      .doc(superAdminId)
      .set(superAdminData);

    // ---------------------------------------------------
    // 4️⃣ Also create user in 'users' collection
    // ---------------------------------------------------
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

    await adminDb.collection("users").doc(superAdminId).set(userData);

    // ---------------------------------------------------
    // 5️⃣ Return Success
    // ---------------------------------------------------
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
