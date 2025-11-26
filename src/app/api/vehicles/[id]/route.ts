import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { ROLE_PERMISSIONS } from "@/lib/permissions";
import { getRoleById } from "@/lib/getRole";

// =======================
// GET SINGLE VEHICLE
// =======================
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 1. Permission
    const rawRole = await getRoleById(req);
    const role = (
      typeof rawRole === "string" ? rawRole : "guest"
    ) as keyof typeof ROLE_PERMISSIONS;

    if (!ROLE_PERMISSIONS[role]?.vehicles?.read) {
      return NextResponse.json(
        { success: false, error: "Permission denied: CANNOT VIEW VEHICLE" },
        { status: 403 }
      );
    }

    // 2. Fetch
    const doc = await adminDb.collection("vehicles").doc(id).get();

    if (!doc.exists) {
      return NextResponse.json(
        { success: false, message: "Vehicle not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      vehicle: { id: doc.id, ...doc.data() },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

// =======================
// UPDATE VEHICLE
// =======================
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
const rawRole = await getRoleById(req);
const role = (
  typeof rawRole === "string" ? rawRole : "guest"
) as keyof typeof ROLE_PERMISSIONS;

    // 1. Permission
    // const role = await getRoleById(req);

    if (!ROLE_PERMISSIONS[role]?.vehicles?.update) {
      return NextResponse.json(
        { success: false, error: "Permission denied: CANNOT UPDATE VEHICLE" },
        { status: 403 }
      );
    }

    const updates = await req.json();

    const docRef = adminDb.collection("vehicles").doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json(
        { success: false, message: "Vehicle not found" },
        { status: 404 }
      );
    }

    await docRef.update({
      ...updates,
      updatedAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: "Vehicle updated successfully",
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

// =======================
// DELETE VEHICLE
// =======================
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 1. Permission
   const rawRole = await getRoleById(req);
   const role = (
     typeof rawRole === "string" ? rawRole : "guest"
   ) as keyof typeof ROLE_PERMISSIONS;

    if (!ROLE_PERMISSIONS[role]?.vehicles?.delete) {
      return NextResponse.json(
        { success: false, error: "Permission denied: CANNOT DELETE VEHICLE" },
        { status: 403 }
      );
    }

    const docRef = adminDb.collection("vehicles").doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json(
        {
          success: false,
          message: "Vehicle not found or already deleted",
        },
        { status: 404 }
      );
    }

    await docRef.delete();

    return NextResponse.json({
      success: true,
      message: "Vehicle deleted successfully",
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
