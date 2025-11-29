import { NextResponse } from "next/server";
import { adminDb, adminAuth } from "@/lib/firebaseAdmin";

import * as bcrypt from "bcryptjs";



export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fullName, email, phone, password } = body;

    // ----------------------------
    // 1️⃣ Required fields validation
    // ----------------------------
    if (!fullName || !email || !phone || !password) {
      return NextResponse.json(
        {
          success: false,
          error: "fullName, email, phone and password are required",
        },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Password validation
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Phone validation (9-12 digits)
    const phoneRegex = /^[0-9]{9,12}$/;
    if (!phoneRegex.test(phone)) {
      return NextResponse.json(
        { success: false, error: "Invalid phone number format" },
        { status: 400 }
      );
    }

    // ------------------------------------------
    // 2️⃣ Check if email or phone already exists
    // ------------------------------------------
    const emailSnap = await adminDb
      .collection("users")
      .where("email", "==", email)
      .get();

    if (!emailSnap.empty) {
      return NextResponse.json(
        { success: false, error: "Email already exists" },
        { status: 400 }
      );
    }

    const phoneSnap = await adminDb
      .collection("users")
      .where("phone", "==", phone)
      .get();

    if (!phoneSnap.empty) {
      return NextResponse.json(
        { success: false, error: "Phone number already exists" },
        { status: 400 }
      );
    }

    // ----------------------------
    // 3️⃣ Fetch role (operator)
    // ----------------------------
    const roleRef = adminDb.collection("roles").doc("operator");
    const roleSnap = await roleRef.get();

    if (!roleSnap.exists) {
      return NextResponse.json(
        { success: false, error: "Role 'operator' not found" },
        { status: 500 }
      );
    }

    const roleData = roleSnap.data() || {};
    const roleId = roleSnap.id;

    // ----------------------------
    // 4️⃣ Create Firebase Auth User
    // ----------------------------
    const authUser = await adminAuth.createUser({
      email,
      password,
      displayName: fullName,
      disabled: false,
    });

    const operatorId = authUser.uid; // Use Firebase Auth UID

    // Hash password for Firestore storage (optional)
    const hashedPassword = await bcrypt.hash(password, 10);

    // ----------------------------
    // 5️⃣ Prepare operator data
    // ----------------------------
    const operatorData = {
      fullName,
      email,
      phone,
      password: hashedPassword,
      role: "operator",
      roleId,
      permissions: roleData.permissions || [],
      status: "inactive", // Default status
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Save to Firestore: operators & users collections
    await adminDb.collection("operators").doc(operatorId).set(operatorData);
    await adminDb.collection("users").doc(operatorId).set(operatorData);

    return NextResponse.json({
      success: true,
      message: "Operator created successfully",
      operatorId,
      roleId,
      permissions: operatorData.permissions,
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
    const snap = await adminDb.collection("operators").get();

    const operators = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ success: true, operators });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}