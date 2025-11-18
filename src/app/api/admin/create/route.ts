import { NextResponse } from "next/server";
import { auth, db } from "../../../../firebase/config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { createUserData, User } from "../../../../models/admin"; // new unified model

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, firstName, lastName, mobile, role } = body;

    // Validate role
    if (!["admin", "operator"].includes(role)) {
      return NextResponse.json({ success: false, message: "Invalid role" });
    }

    // Step 1: Create Firebase Auth user
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Step 2: Add Firestore document using unified model
    await setDoc(
      doc(db, "admins", user.uid), // same collection
      createUserData({
        id: user.uid,
        firstName,
        lastName,
        email,
        mobile,
        role,
        canOverride: role === "admin" ? true : false, // optional, only for admins
      })
    );

    return NextResponse.json({
      success: true,
      message: `${
        role.charAt(0).toUpperCase() + role.slice(1)
      } created successfully!`,
    });
  } catch (error: any) {
    console.error("Error creating user:", error);
    return NextResponse.json({ success: false, message: error.message });
  }
}
