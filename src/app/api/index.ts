// // import type { NextApiRequest, NextApiResponse } from "next";
// // import { db } from "../../../lib/firebaseAdmin";
// // import { checkRole } from "../../../utils/checkRole";

// // export default async function handler(
// //   req: NextApiRequest,
// //   res: NextApiResponse
// // ) {
// //   try {
// //     await checkRole(req, ["admin", "super_admin"]);

// //     if (req.method === "GET") {
// //       const snapshot = await db.collection("users").get();
// //       const users = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
// //       return res.status(200).json(users);
// //     }

// //     if (req.method === "POST") {
// //       const { fullName, email, phone, role } = req.body;

// //       if (!fullName || !email || !role) {
// //         return res.status(400).json({ error: "Missing required fields" });
// //       }

// //       await db.collection("users").add({
// //         fullName,
// //         email,
// //         phone: phone || "",
// //         role,
// //         status: "active",
// //         createdAt: new Date().toISOString(),
// //         updatedAt: new Date().toISOString(),
// //       });

// //       return res.status(201).json({ message: "User created successfully" });
// //     }

// //     res.setHeader("Allow", ["GET", "POST"]);
// //     res.status(405).end(`Method ${req.method} Not Allowed`);
// //   } catch (err: any) {
// //     if (err.message === "Forbidden")
// //       return res.status(403).json({ error: err.message });
// //     return res.status(401).json({ error: err.message });
// //   }
// // }


// import { NextResponse } from "next/server";
// import { adminDb, verifyIdToken } from "@/lib/firebaseAdmin";
// import { checkPermission } from "@/lib/middleware/checkPermission";

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();

//     // Authenticate
//     const authHeader = req.headers.get("Authorization");
//     if (!authHeader?.startsWith("Bearer "))
//       return NextResponse.json(
//         { success: false, message: "Unauthorized" },
//         { status: 401 }
//       );
//     const token = authHeader.split(" ")[1];
//     const decoded = await verifyIdToken(token);
//     if (!decoded)
//       return NextResponse.json(
//         { success: false, message: "Unauthorized" },
//         { status: 401 }
//       );

//     // Permission check
//     const hasAccess = await checkPermission(
//       "users",
//       "create"
//     )({ user: { id: decoded.uid } });
//     if (!hasAccess)
//       return NextResponse.json(
//         { success: false, message: "Forbidden" },
//         { status: 403 }
//       );

//     // Create user
//     const docRef = adminDb.collection("users").doc(body.uid); // ✔ correct

//     await docRef.set({
//       uid: docRef.id,
//       name: body.name,
//       email: body.email,
//       phone: body.phone ?? "",
//       role: body.roleId,
//       status: "active",
//       createdAt: new Date(),
//     });

//     return NextResponse.json({ success: true, userId: docRef.id });
//   } catch (err: any) {
//     return NextResponse.json(
//       { success: false, error: err.message || String(err) },
//       { status: 500 }
//     );
//   }
// }

// export async function GET(req: Request) {
//   try {
//     const authHeader = req.headers.get("Authorization");
//     if (!authHeader?.startsWith("Bearer "))
//       return NextResponse.json(
//         { success: false, message: "Unauthorized" },
//         { status: 401 }
//       );
//     const token = authHeader.split(" ")[1];
//     const decoded = await verifyIdToken(token);
//     if (!decoded)
//       return NextResponse.json(
//         { success: false, message: "Unauthorized" },
//         { status: 401 }
//       );

//     const hasAccess = await checkPermission(
//       "users",
//       "read"
//     )({ user: { id: decoded.uid } });
//     if (!hasAccess)
//       return NextResponse.json(
//         { success: false, message: "Forbidden" },
//         { status: 403 }
//       );

//     const snapshot = await adminDb.collection("users").get();
//     const users = snapshot.docs.map((doc) => doc.data());
//     return NextResponse.json({ success: true, users });
//   } catch (err: any) {
//     return NextResponse.json(
//       { success: false, error: err.message || String(err) },
//       { status: 500 }
//     );
//   }
// }
