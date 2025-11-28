// import { NextResponse } from "next/server";
// import { adminDb } from "@/lib/firebaseAdmin";

// export async function GET(
//   req: Request,
//   context: { params: Promise<{ id: string }> }
// ) {
//   try {
//     const { id } = await context.params;

//     const userSnap = await adminDb.collection("users").doc(id).get();

//     if (!userSnap.exists || userSnap.data()?.role !== "super_admin") {
//       return NextResponse.json(
//         { success: false, error: "Super Admin not found" },
//         { status: 404 }
//       );
//     }

//     const roleSnap = await adminDb.collection("super_admins").doc(id).get();

//     return NextResponse.json({
//       success: true,
//       user: {
//         id,
//         ...userSnap.data(),
//         roleData: roleSnap.data(),
//       },
//     });
//   } catch (err: any) {
//     return NextResponse.json(
//       { success: false, error: err.message },
//       { status: 500 }
//     );
//   }
// }

// export async function PATCH(
//   req: Request,
//   context: { params: Promise<{ id: string }> }
// ) {
//   try {
//     const { id } = await context.params;
//     const body = await req.json();

//     const now = new Date();

//     // Update users base data
//     await adminDb
//       .collection("users")
//       .doc(id)
//       .update({
//         ...body,
//         updatedAt: now,
//       });

//     // Update role-specific data if needed
//     if (body.permissions) {
//       await adminDb.collection("super_admins").doc(id).update({
//         permissions: body.permissions,
//         updatedAt: now,
//       });
//     }

//     return NextResponse.json({
//       success: true,
//       message: "Super Admin updated",
//     });
//   } catch (err: any) {
//     return NextResponse.json(
//       { success: false, error: err.message },
//       { status: 500 }
//     );
//   }
// }
// export async function DELETE(
//   req: Request,
//   context: { params: Promise<{ id: string }> }
// ) {
//   try {
//     const { id } = await context.params;

//     // Delete from users collection
//     await adminDb.collection("users").doc(id).delete();

//     // Delete from role-specific collection
//     await adminDb.collection("super_admins").doc(id).delete();

//     return NextResponse.json({
//       success: true,
//       message: "Super Admin deleted",
//     });
//   } catch (err: any) {
//     return NextResponse.json(
//       { success: false, error: err.message },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";

// ----------------------------------------------------------
// GET ONE SUPER ADMIN
// ----------------------------------------------------------
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const snap = await adminDb.collection("super_admins").doc(id).get();

    if (!snap.exists) {
      return NextResponse.json(
        { success: false, error: "Super Admin not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, admin: { id, ...snap.data() } });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

// ----------------------------------------------------------
// UPDATE SUPER ADMIN
// ----------------------------------------------------------
export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const data = await req.json();

    // Protect fields from being updated
    delete data.role;
    delete data.roleId;
    delete data.permissions;

    const ref = adminDb.collection("super_admins").doc(id);
    const snap = await ref.get();

    if (!snap.exists) {
      return NextResponse.json(
        { success: false, error: "Super Admin not found" },
        { status: 404 }
      );
    }

    await ref.update({ ...data, updatedAt: new Date() });

    // sync to users collection
    await adminDb
      .collection("users")
      .doc(id)
      .update({
        ...data,
        updatedAt: new Date(),
      });

    return NextResponse.json({ success: true, message: "Super Admin updated" });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

// ----------------------------------------------------------
// DELETE SUPER ADMIN
// ----------------------------------------------------------
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    await adminDb.collection("super_admins").doc(id).delete();
    await adminDb.collection("users").doc(id).delete();

    return NextResponse.json({
      success: true,
      message: "Super Admin deleted",
      deletedId: id,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
