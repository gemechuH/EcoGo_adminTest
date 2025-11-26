import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { ROLE_PERMISSIONS } from "@/lib/permissions";
import { getRoleById } from "@/lib/getRole";

// ✅ GET ALL VEHICLES (With Permissions)
export async function GET(req: Request) {
  try {
    // 1. Get role from token/session/header
   const rawRole = await getRoleById(req);
   const role = (
     typeof rawRole === "string" ? rawRole : "guest"
   ) as keyof typeof ROLE_PERMISSIONS;

    // 2. Check permission
    if (!ROLE_PERMISSIONS[role]?.vehicles?.read) {
      return NextResponse.json(
        { success: false, error: "Permission denied: CANNOT VIEW VEHICLES" },
        { status: 403 }
      );
    }

    // 3. Fetch vehicles
    const snapshot = await adminDb.collection("vehicles").get();
    const vehicles = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ success: true, vehicles });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

// CREATE VEHICLE
export async function POST(req: Request) {
  try {
    const rawRole = await getRoleById(req);
    const role = (
      typeof rawRole === "string" ? rawRole : "guest"
    ) as keyof typeof ROLE_PERMISSIONS;

    // const role = getRoleById(req);
    if (!ROLE_PERMISSIONS[role]?.vehicles?.create) {
      return NextResponse.json(
        { error: "Permission denied (TO CREATE VEHICLE)" },
        { status: 403 }
      );
    }
    const body = await req.json();

    const requiredFields = [
      "driverId",
      "make",
      "model",
      "year",
      "licensePlate",
      "vehicleType",
    ];

    for (const field of requiredFields) {
      if (!body[field] || body[field] === "") {
        return NextResponse.json(
          { success: false, message: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Check if driver exists
    const driverRef = await adminDb
      .collection("users")
      .doc(body.driverId)
      .get();
    if (!driverRef.exists) {
      return NextResponse.json(
        { success: false, message: "Driver does not exist" },
        { status: 404 }
      );
    }

    // Check duplicate plate number
    const plateCheck = await adminDb
      .collection("vehicles")
      .where("licensePlate", "==", body.licensePlate)
      .limit(1)
      .get();

    if (!plateCheck.empty) {
      return NextResponse.json(
        { success: false, message: "Plate number already exists" },
        { status: 409 }
      );
    }

    // Check if same driver already has same vehicle make & model (rare case)
    const driverVehicleCheck = await adminDb
      .collection("vehicles")
      .where("driverId", "==", body.driverId)
      .where("make", "==", body.make)
      .where("model", "==", body.model)
      .get();

    if (!driverVehicleCheck.empty) {
      return NextResponse.json(
        {
          success: false,
          message: "Driver already has a vehicle with same make & model",
        },
        { status: 409 }
      );
    }

    // Create Firestore document
    const docRef = adminDb.collection("vehicles").doc();
    const vehicleId = docRef.id;

    const vehicleData = {
      id: vehicleId,
      driverId: body.driverId,

      make: body.make,
      model: body.model,
      year: body.year,
      color: body.color || "",
      licensePlate: body.licensePlate,
      vehicleType: body.vehicleType,
      seats: body.seats || 4,

      insuranceExpiry: body.insuranceExpiry || "",
      registrationExpiry: body.registrationExpiry || "",
      vehicleImages: body.vehicleImages || [],
      documentImages: body.documentImages || [],

      status: "pending", // every new vehicle must be approved first
      rating: 0,
      tripCount: 0,

      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await docRef.set(vehicleData);

    return NextResponse.json({
      success: true,
      message: "Vehicle created successfully",
      vehicle: vehicleData,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
