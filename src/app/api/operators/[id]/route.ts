import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const snap = await adminDb.collection("operators").doc(id).get();

    if (!snap.exists) {
      return NextResponse.json(
        { success: false, error: "Operator not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      operator: { id, ...snap.data() },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}



export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();

    const operatorRef = adminDb.collection("operators").doc(id);
    const userRef = adminDb.collection("users").doc(id);

    const snap = await operatorRef.get();
    if (!snap.exists) {
      return NextResponse.json(
        { success: false, error: "Operator not found" },
        { status: 404 }
      );
    }

    const updateData = {
      ...body,
      updatedAt: new Date(),
    };

    await operatorRef.update(updateData);
    await userRef.update(updateData);

    return NextResponse.json({
      success: true,
      message: "Operator updated successfully",
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

    await adminDb.collection("operators").doc(id).delete();
    await adminDb.collection("users").doc(id).delete();

    return NextResponse.json({
      success: true,
      message: "Operator deleted successfully",
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
