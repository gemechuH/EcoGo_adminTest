import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const snap = await adminDb.collection("admins").doc(id).get();

    if (!snap.exists) {
      return NextResponse.json(
        { success: false, error: "Admin not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, admin: snap.data() });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();

    body.updatedAt = new Date();

    // Update admins collection
    await adminDb.collection("admins").doc(id).update(body);

    // Also update users collection
    await adminDb.collection("users").doc(id).update({
      fullName: body.fullName,
      phone: body.phone,
      updatedAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: "Admin updated successfully",
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    await adminDb.collection("admins").doc(id).delete();
    await adminDb.collection("users").doc(id).delete();

    return NextResponse.json({
      success: true,
      message: "Admin deleted successfully",
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
