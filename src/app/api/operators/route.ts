import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";



export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fullName, email, phone } = body;

    // ----------------------------
    // 1️⃣ Required fields validation
    // ----------------------------
    if (!fullName || !email || !phone) {
      return NextResponse.json(
        { success: false, error: "fullName, email, phone are required" },
        { status: 400 }
      );
    }

    // Simple email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Phone validation (9–12 digits)
    // const phoneRegex = /^[0-9]{9,12}$/;
    // if (!phoneRegex.test(phone)) {
    //   return NextResponse.json(
    //     { success: false, error: "Invalid phone number format" },
    //     { status: 400 }
    //   );
    // }

    // ------------------------------------------
    // 2️⃣ Check if email or phone already exists
    // ------------------------------------------

    // Check email in users collection
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

    // Check phone in users collection
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

    const roleData = roleSnap.data() || {}; // 🟢 FIX: prevents TS warning
    const roleId = roleSnap.id;

    // ----------------------------
    // 4️⃣ Create operator record
    // ----------------------------
    const operatorRef = adminDb.collection("operators").doc();
    const operatorId = operatorRef.id;

    const operatorData = {
      fullName,
      email,
      phone,
      role: "operator",
      roleId,
      permissions: roleData.permissions || [], // 🟢 FIX: safe access
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await operatorRef.set(operatorData);

    // ----------------------------
    // 5️⃣ Create user record
    // ----------------------------
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