import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { getAuth } from "firebase-admin/auth";

// ---------------------------
// 🔍 Validation Helpers
// ---------------------------
const validateEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// const validatePassword = (password: string) =>
//   /^(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&]).{8,}$/.test(password);
// At least: 8 chars, 1 capital, 1 number, 1 special

const validatePhone = (phone: string) =>
  /^(\+2519\d{8}|\+2517\d{8}|09\d{8}|07\d{8})$/.test(phone);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fullName, email, phone, password } = body;

    // ---------------------------------------------------
    // 1️⃣ Required Fields Check
    // ---------------------------------------------------
    if (!fullName || !email || !phone || !password) {
      return NextResponse.json(
        {
          success: false,
          error: "fullName, email, phone, and password are required",
        },
        { status: 400 }
      );
    }

    // ---------------------------------------------------
    // 2️⃣ Validate all inputs
    // ---------------------------------------------------
    if (!validateEmail(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email format" },
        { status: 400 }
      );
    }

    // if (!validatePassword(password)) {
    //   return NextResponse.json(
    //     {
    //       success: false,
    //       error:
    //         "Password must be at least 8 chars, include 1 uppercase, 1 number, and 1 special character",
    //     },
    //     { status: 400 }
    //   );
    // }

    if (!validatePhone(phone)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid Ethiopian phone format. Allowed: +2519XXXXXXXX, +2517XXXXXXXX, 09XXXXXXXX, 07XXXXXXXX",
        },
        { status: 400 }
      );
    }

    // ---------------------------------------------------
    // 3️⃣ Check if Email Exists in Firestore (super_admin + users)
    // ---------------------------------------------------
    const firestoreUser = await adminDb
      .collection("users")
      .where("email", "==", email)
      .get();

    if (!firestoreUser.empty) {
      return NextResponse.json(
        { success: false, error: "Email already exists in Firestore" },
        { status: 400 }
      );
    }

    // ---------------------------------------------------
    // 4️⃣ Create Firebase Auth Account
    // ---------------------------------------------------
    let authUser;
    try {
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

    const userId = authUser.uid;

    // ---------------------------------------------------
    // 5️⃣ Fetch Role Permissions
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
    // 6️⃣ Final User Data to Save
    // ---------------------------------------------------
    const finalUserData = {
      fullName,
      email,
      phone,
      role: "super_admin",
      roleId,
      permissions: roleData.permissions,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // ---------------------------------------------------
    // 7️⃣ Save to Firestore (users + super_admins)
    // ---------------------------------------------------
    await adminDb.collection("users").doc(userId).set(finalUserData);

    await adminDb.collection("super_admins").doc(userId).set(finalUserData);

    // ---------------------------------------------------
    // 8️⃣ Return Success
    // ---------------------------------------------------
    return NextResponse.json({
      success: true,
      message: "Super Admin created successfully",
      userId,
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
