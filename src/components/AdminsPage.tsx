

"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Search,
  UserPlus,
  Edit,
  Trash2,
  CircleOff,
  CheckCircle,
  UserCheck,
} from "lucide-react";
// import { Users } from "@/types"; // Not used directly
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../../src/firebase/config";
import { User } from "../models/admin";
import { onAuthStateChanged } from "firebase/auth";
import { Timestamp } from "firebase/firestore";

import { doc, getDoc, onSnapshot, collection } from "firebase/firestore";
import Logo from "./Logo";

// --- Interfaces ---

interface UserData {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  [key: string]: any;
}

interface RideData {
  id: string;
  pickup?: string;
  destination?: string;
  name?: string;
  fare?: number;
  status?: string;
  riderId?: string;
  driverId?: string;
  [key: string]: any;
}

interface AdminData {
  id: string;
  name?: string;
  email?: string;
  role?: string;
  status?: string;
  createdAt?: Timestamp;
  lastLogin?: Timestamp;
  [key: string]: any;
  phone?: string;
}

export function AdminsPage() {
  const [admins, setAdmins] = useState<AdminData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const router = useRouter();

  // The following state variables are loaded but not used in the UI,
  // but I'm keeping them for completeness.
  const [drivers, setDrivers] = useState<UserData[]>([]);
  const [riders, setRiders] = useState<UserData[]>([]);
  const [rides, setRides] = useState<RideData[]>([]);

  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState<User | null>(null);

  // --- Authentication and Data Load Effect ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/");
        return;
      }

      const adminRef = doc(db, "admins", user.uid);
      const adminSnap = await getDoc(adminRef);

      if (adminSnap.exists()) {
        setAdmin({ id: user.uid, ...adminSnap.data() } as User);
        loadAllData();
      } else {
        router.push("/");
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // --- Real-time Data Listeners ---
  const loadAllData = () => {
    // 🔵 Real-time: Admins
    const unsubscribeAdmins = onSnapshot(
      collection(db, "admins"),
      (snapshot) => {
        setAdmins(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as AdminData[] // Explicitly cast to AdminData[]
        );
      }
    );

    // 🔵 Real-time: Drivers
    const unsubscribeDrivers = onSnapshot(
      collection(db, "drivers"),
      (snapshot) => {
        setDrivers(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as UserData[]
        );
      }
    );

    // 🟢 Real-time: Riders
    const unsubscribeRiders = onSnapshot(
      collection(db, "riders"),
      (snapshot) => {
        setRiders(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as UserData[]
        );
      }
    );

    // 🟠 Real-time: Rides
    const unsubscribeRides = onSnapshot(collection(db, "rides"), (snapshot) => {
      setRides(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as RideData[]
      );
    });

    // Return all unsubs so you can close listeners when admin logs out or leaves page
    return () => {
      unsubscribeDrivers();
      unsubscribeRiders();
      unsubscribeRides();
      unsubscribeAdmins();
    };
  };

  // --- Loading State ---
  if (loading)
    return (
      <div className="text-center text-2xl font-semibold mt-20">Loading...</div>
    );

  // --- Data Filtering and Handlers ---
  const filteredAdmins = admins.filter((admin) => {
    const name = (admin?.name ?? "").toLowerCase();
    const email = (admin?.email ?? "").toLowerCase();
    const term = (searchTerm ?? "").toLowerCase();
    return name.includes(term) || email.includes(term);
  });

  const handleAddAdmin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newAdmin: AdminData = {
      id: `${admins.length + 1}`,
      name: formData.get("name") as string, // Changed from firstName/lastName to use single name field
      email: formData.get("email") as string,
      // mobile: formData.get("mobile") as string, // Mobile field removed from form/logic for simplification
      role: "admin",
      status: "inactive", // Default status for newly added mock admin
      createdAt: Timestamp.now(),
    };

    setAdmins([...admins, newAdmin]);
    setIsAddDialogOpen(false);
    toast.success("Admin added successfully! (Mock add)");
  };

  const handleDeleteAdmin = (id: string) => {
    setAdmins(admins.filter((admin) => admin.id !== id));
    toast.success("Admin deleted successfully! (Mock delete)");
  };

  // --- Statistics Data ---
  const stats = [
    {
      label: "Total Admins",
      value: admins.length,
      icon: UserCheck,
      color: "text-black",
    },
    {
      label: "Active",
      value: admins.filter((a) => a.status === "active").length,
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      label: "Inactive",
      value: admins.filter((a) => a.status === "inactive").length,
      icon: CircleOff,
      color: "text-black",
    },
  ];

  const adminOnlyList = filteredAdmins.filter((a) => a.role === "admin");

  // --- Component Render ---
  return (
    <div className="bg-white min-h-screen border-none shadow-md rounded-lg p-6">
      <div className="flex lg:hidden justify-center">
        <Logo />
      </div>
      <div className="p-6 space-y-4">
        {/* Header and Add Admin Button */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="w-full">
            <h1 className="font-bold text-1xl sm:text-3xl bg-[var(--charcoal-dark)] text-white p-1 rounded-md w-full">
              Admin Dashboard
            </h1>
            <p style={{ color: "#2D2D2D" }} className="text-lg">
              Manage system administrators and permissions
            </p>
          </div>
        </div>
        <div className="flex justify-end">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button style={{ backgroundColor: "#2DB85B", color: "white" }}>
                <UserPlus className="w-4 h-4 mr-2" />
                Add Admin
              </Button>
            </DialogTrigger>
            <DialogContent
              className="
        max-w-md p-6 rounded-lg shadow-xl
        text-[#1E1E1E] bg-white
        !bg-[white]
        border border-[#ffffff]
      "
              style={{
                backgroundColor: "#1E1E1E",
                backdropFilter: "none",
                WebkitBackdropFilter: "none",
              }}
            >
              <DialogHeader>
                <DialogTitle>Add New Administrator</DialogTitle>
                <DialogDescription>
                  Create a new admin account with full system access
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddAdmin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Corporate Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="admin@ecogo.ca"
                    required
                  />
                </div>
                <div
                  className="p-4 rounded-lg"
                  style={{ backgroundColor: "#FEF3C7" }}
                >
                  <p className="text-sm" style={{ color: "#92400E" }}>
                    <strong>Important:</strong> This user will have full
                    administrative access including user management, system
                    settings, and audit logs.
                  </p>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    style={{ backgroundColor: "#2DB85B", color: "white" }}
                  >
                    Create Admin
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards - Responsive Grid: 1 column on small, 3 columns on medium+ */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="bg-white border-none shadow-md">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                      {/* <Icon className="w-5 h-5" style={{ color: "#2DB85B" }} /> */}
                      <stat.icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                    <h3 style={{ color: "#2D2D2D" }}>{stat.value}</h3>
                  </div>
                  <p style={{ color: "#2D2D2D" }}>{stat.label}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Search Bar */}
        <CardContent className="bg-white border-none shadow-md rounded-lg h-10 p-0">
          <div className="relative bg-white border-none rounded-lg h-full">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-800"
              style={{ color: "#2D2D2D" }}
            />
            <Input
              placeholder="Search admins by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white border-none rounded-lg focus:outline-none focus:ring-0 shadow-none h-full"
              style={{
                boxShadow: "none", // removes internal shadow
                outline: "none", // removes browser outline
              }}
            />
          </div>
        </CardContent>

        {/* Administrators Table */}
        <Card className="bg-white border-none shadow-md rounded-lg">
          <CardHeader>
            <CardTitle className="bg-[var(--charcoal-dark)] text-white p-1 rounded-md w-full">
              All Administrators
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* The overflow-x-auto ensures horizontal scrolling on small screens if the table is too wide */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr
                    style={{ borderBottomWidth: "1px", borderColor: "#E6E6E6" }}
                  >
                    <th className="text-left p-4 min-w-[150px]">Name</th>
                    <th className="text-left p-4 min-w-[200px]">Email</th>
                    <th className="text-left p-4 min-w-[100px]">Status</th>
                    <th className="text-left p-4 min-w-[100px]">Created</th>
                    <th className="text-left p-4 min-w-[150px]">Last Login</th>
                    <th className="text-right p-4 min-w-[100px]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {adminOnlyList.map((admin) => (
                    <tr
                      key={admin.id}
                      style={{
                        borderBottomWidth: "1px",
                        borderColor: "#E6E6E6",
                      }}
                    >
                      <td className="p-4">
                        {admin.role === "admin" && (
                          <div className="flex items-center gap-2">
                            <UserCheck
                              className="w-4 h-4 flex-shrink-0"
                              style={{ color: "#2DB85B" }}
                            />
                            <span className="truncate">
                              {admin.name ?? admin.email ?? "Unknown"}
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="p-4 truncate max-w-[200px]">
                        {admin.email ?? ""}
                      </td>
                      <td className="p-4">
                        <Badge
                          style={
                            admin.status === "active"
                              ? { backgroundColor: "#D0F5DC", color: "#1B6635" }
                              : { backgroundColor: "#E6E6E6", color: "#2D2D2D" }
                          }
                        >
                          {admin.status}
                        </Badge>
                      </td>
                      <td
                        className="p-4 text-sm whitespace-nowrap"
                        style={{ color: "#2D2D2D" }}
                      >
                        {admin.createdAt?.toDate().toLocaleDateString()}
                      </td>
                      <td
                        className="p-4 text-sm whitespace-nowrap"
                        style={{ color: "#2D2D2D" }}
                      >
                        {admin.lastLogin
                          ? admin.lastLogin.toDate().toLocaleString()
                          : "Never"}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button size="sm" variant="ghost" title="Edit Admin">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            title="Delete Admin"
                            onClick={() => handleDeleteAdmin(admin.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {adminOnlyList.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No administrators found matching your search.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// /app/dashboard/admins/new/page.tsx
// "use client";

// import { useState } from "react";
// import { adminService } from "@/lib/services/adminService";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { useRouter } from "next/navigation";
// import { toast } from "sonner";

// export function AdminsPage() {
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e: any) => {
//     e.preventDefault();
//     setLoading(true);

//     const form = new FormData(e.target);

//     const payload = {
//       fullName: form.get("fullName"),
//       email: form.get("email"),
//       phone: form.get("phone"),
//       department: form.get("department"),
//       address: form.get("address"),
//     };

//     try {
//       await adminService.create(payload);
//       toast.success("Admin created");
//       router.push("/dashboard/admins");
//     } catch (err: any) {
//       toast.error(err.message);
//     }

//     setLoading(false);
//   };

//   return (
//     <div className="p-6 max-w-xl">
//       <h2 className="text-xl font-semibold mb-4">Create Admin</h2>

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <Label>Full Name</Label>
//           <Input name="fullName" required />
//         </div>

//         <div>
//           <Label>Email</Label>
//           <Input name="email" required />
//         </div>

//         <div>
//           <Label>Phone</Label>
//           <Input name="phone" required />
//         </div>

//         <div>
//           <Label>Department</Label>
//           <Input name="department" />
//         </div>

//         <div>
//           <Label>Address</Label>
//           <Input name="address" />
//         </div>

//         <Button disabled={loading} className="w-full">
//           {loading ? "Creating..." : "Create Admin"}
//         </Button>
//       </form>
//     </div>
//   );
// }

// /app/aabddhors / admins / page.tsx;c

// ("use client");

// import { useEffect, useState } from "react";
// import { adminService } from "@/lib/services/adminService";
// import { Button } from "@/components/ui/button";
// import Link from "next/link";
// import { toast } from "sonner";

// export default function AdminListPage() {
//   const [admins, setAdmins] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   const loadAdmins = async () => {
//     setLoading(true);
//     const data = await adminService.getAll();
//     setAdmins(data);
//     setLoading(false);
//   };

//   useEffect(() => {
//     loadAdmins();
//   }, []);

//   const handleDelete = async (id: string) => {
//     if (!confirm("Delete this admin?")) return;

//     await adminService.delete(id);
//     toast.success("Admin deleted");
//     loadAdmins();
//   };

//   if (loading) return <p className="p-6">Loading...</p>;

//   return (
//     <div className="p-6">
//       <div className="flex justify-between mb-4">
//         <h2 className="text-xl font-semibold">Admins</h2>
//         <Link href="/dashboard/admins/new">
//           <Button>Add Admin</Button>
//         </Link>
//       </div>

//       <div className="space-y-2">
//         {admins.map((a) => (
//           <div
//             key={a.id}
//             className="border p-4 rounded flex justify-between items-center"
//           >
//             <div>
//               <p className="font-medium">{a.fullName}</p>
//               <p className="text-sm text-gray-500">{a.email}</p>
//             </div>

//             <div className="flex gap-2">
//               <Link href={`/dashboard/admins/${a.id}`}>
//                 <Button variant="outline">View</Button>
//               </Link>

//               <Link href={`/dashboard/admins/${a.id}/edit`}>
//                 <Button>Edit</Button>
//               </Link>

//               <Button variant="destructive" onClick={() => handleDelete(a.id)}>
//                 Delete
//               </Button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }



// /app/aabddhors / admins / [id] / page.tsx;

// "use client";

// import { useEffect, useState } from "react";
// import { adminService } from "@/lib/services/adminService";
// import { useParams } from "next/navigation";

// export default function AdminDetailsPage() {
//   const { id } = useParams();
//   const [admin, setAdmin] = useState<any>(null);

//   useEffect(() => {
//     adminService.getById(id as string).then(setAdmin);
//   }, [id]);

//   if (!admin) return <p className="p-6">Loading...</p>;

//   return (
//     <div className="p-6">
//       <h2 className="text-xl font-semibold mb-4">Admin Details</h2>

//       <div className="space-y-2">
//         <p>
//           <strong>Name:</strong> {admin.fullName}
//         </p>
//         <p>
//           <strong>Email:</strong> {admin.email}
//         </p>
//         <p>
//           <strong>Phone:</strong> {admin.phone}
//         </p>
//         <p>
//           <strong>Department:</strong> {admin.department}
//         </p>
//         <p>
//           <strong>Address:</strong> {admin.address}
//         </p>
//       </div>
//     </div>
//   );
// }


// /app/aabddhors / admins / [id] / edit / page.tsx;
// "use client";

// import { useEffect, useState } from "react";
// import { adminService } from "@/lib/services/adminService";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { toast } from "sonner";
// import { useParams, useRouter } from "next/navigation";

// export default function EditAdminPage() {
//   const { id } = useParams();
//   const router = useRouter();
//   const [admin, setAdmin] = useState<any>(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     adminService.getById(id as string).then(setAdmin);
//   }, [id]);

//   const handleSubmit = async (e: any) => {
//     e.preventDefault();
//     setLoading(true);

//     const payload = {
//       fullName: e.target.fullName.value,
//       phone: e.target.phone.value,
//       department: e.target.department.value,
//       address: e.target.address.value,
//     };

//     await adminService.update(id as string, payload);

//     toast.success("Admin updated");
//     router.push("/dashboard/admins");
//   };

//   if (!admin) return <p className="p-6">Loading...</p>;

//   return (
//     <div className="p-6 max-w-xl">
//       <h2 className="text-xl font-semibold mb-4">Edit Admin</h2>

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <Label>Full Name</Label>
//           <Input name="fullName" defaultValue={admin.fullName} required />
//         </div>

//         <div>
//           <Label>Phone</Label>
//           <Input name="phone" defaultValue={admin.phone} required />
//         </div>

//         <div>
//           <Label>Department</Label>
//           <Input name="department" defaultValue={admin.department} />
//         </div>

//         <div>
//           <Label>Address</Label>
//           <Input name="address" defaultValue={admin.address} />
//         </div>

//         <Button disabled={loading} className="w-full">
//           {loading ? "Saving..." : "Save Changes"}
//         </Button>
//       </form>
//     </div>
//   );
// }































// "use client";

// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Label } from "@/components/ui/label";
// import {
//   Search,
//   UserPlus,
//   Edit,
//   Trash2,
//   CircleOff,
//   CheckCircle,
//   UserCheck,
// } from "lucide-react";
// // import { Users } from "@/types"; // Not used directly
// import { toast } from "sonner";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { auth, db } from "../../src/firebase/config";
// import { User } from "../models/admin";
// import { onAuthStateChanged } from "firebase/auth";
// import { Timestamp } from "firebase/firestore";

// import { doc, getDoc, onSnapshot, collection } from "firebase/firestore";
// import Logo from "./Logo";

// // --- Interfaces ---

// interface UserData {
//   id: string;
//   name?: string;
//   email?: string;
//   phone?: string;
//   [key: string]: any;
// }

// interface RideData {
//   id: string;
//   pickup?: string;
//   destination?: string;
//   name?: string;
//   fare?: number;
//   status?: string;
//   riderId?: string;
//   driverId?: string;
//   [key: string]: any;
// }

// interface AdminData {
//   id: string;
//   name?: string;
//   email?: string;
//   role?: string;
//   status?: string;
//   createdAt?: Timestamp;
//   lastLogin?: Timestamp;
//   [key: string]: any;
//   phone?: string;
// }

// export function AdminsPage() {
//   const [admins, setAdmins] = useState<AdminData[]>([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
//   const router = useRouter();

//   // The following state variables are loaded but not used in the UI,
//   // but I'm keeping them for completeness.
//   const [drivers, setDrivers] = useState<UserData[]>([]);
//   const [riders, setRiders] = useState<UserData[]>([]);
//   const [rides, setRides] = useState<RideData[]>([]);

//   const [loading, setLoading] = useState(true);
//   const [admin, setAdmin] = useState<User | null>(null);

//   // --- Authentication and Data Load Effect ---
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (user) => {
//       if (!user) {
//         router.push("/");
//         return;
//       }

    //   const adminRef = doc(db, "admins", user.uid);
    //   const adminSnap = await getDoc(adminRef);

    //   if (adminSnap.exists()) {
    //     setAdmin({ id: user.uid, ...adminSnap.data() } as User);
    //     loadAllData();
    //   } else {
    //     router.push("/");
    //   }

    //   setLoading(false);
    // });

//     return () => unsubscribe();
//   }, []);

  // --- Real-time Data Listeners ---
  // const loadAllData = () => {
  //   // 🔵 Real-time: Admins
  //   const unsubscribeAdmins = onSnapshot(
  //     collection(db, "admins"),
  //     (snapshot) => {
  //       setAdmins(
  //         snapshot.docs.map((doc) => ({
  //           id: doc.id,
  //           ...doc.data(),
  //         })) as AdminData[] // Explicitly cast to AdminData[]
  //       );
  //     }
  //   );

//     // 🔵 Real-time: Drivers
//     const unsubscribeDrivers = onSnapshot(
//       collection(db, "drivers"),
//       (snapshot) => {
//         setDrivers(
//           snapshot.docs.map((doc) => ({
//             id: doc.id,
//             ...doc.data(),
//           })) as UserData[]
//         );
//       }
//     );

//     // 🟢 Real-time: Riders
//     const unsubscribeRiders = onSnapshot(
//       collection(db, "riders"),
//       (snapshot) => {
//         setRiders(
//           snapshot.docs.map((doc) => ({
//             id: doc.id,
//             ...doc.data(),
//           })) as UserData[]
//         );
//       }
//     );

//     // 🟠 Real-time: Rides
//     const unsubscribeRides = onSnapshot(collection(db, "rides"), (snapshot) => {
//       setRides(
//         snapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         })) as RideData[]
//       );
//     });

//     // Return all unsubs so you can close listeners when admin logs out or leaves page
//     return () => {
//       unsubscribeDrivers();
//       unsubscribeRiders();
//       unsubscribeRides();
//       unsubscribeAdmins();
//     };
//   };

//   // --- Loading State ---
//   if (loading)
//     return (
//       <div className="text-center text-2xl font-semibold mt-20">Loading...</div>
//     );

//   // --- Data Filtering and Handlers ---
//   const filteredAdmins = admins.filter((admin) => {
//     const name = (admin?.name ?? "").toLowerCase();
//     const email = (admin?.email ?? "").toLowerCase();
//     const term = (searchTerm ?? "").toLowerCase();
//     return name.includes(term) || email.includes(term);
//   });

//   const handleAddAdmin = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     const formData = new FormData(e.currentTarget);
//     const newAdmin: AdminData = {
//       id: `${admins.length + 1}`,
//       name: formData.get("name") as string, // Changed from firstName/lastName to use single name field
//       email: formData.get("email") as string,
//       // mobile: formData.get("mobile") as string, // Mobile field removed from form/logic for simplification
//       role: "admin",
//       status: "inactive", // Default status for newly added mock admin
//       createdAt: Timestamp.now(),
//     };

//     setAdmins([...admins, newAdmin]);
//     setIsAddDialogOpen(false);
//     toast.success("Admin added successfully! (Mock add)");
//   };

//   const handleDeleteAdmin = (id: string) => {
//     setAdmins(admins.filter((admin) => admin.id !== id));
//     toast.success("Admin deleted successfully! (Mock delete)");
//   };

//   // --- Statistics Data ---
//   const stats = [
//     {
//       label: "Total Admins",
//       value: admins.length,
//       icon: UserCheck,
//       color: "text-black",
//     },
//     {
//       label: "Active",
//       value: admins.filter((a) => a.status === "active").length,
//       icon: CheckCircle,
//       color: "text-green-600",
//     },
//     {
//       label: "Inactive",
//       value: admins.filter((a) => a.status === "inactive").length,
//       icon: CircleOff,
//       color: "text-black",
//     },
//   ];

//   const adminOnlyList = filteredAdmins.filter((a) => a.role === "admin");

//   // --- Component Render ---
//   return (
//     <div className="bg-white min-h-screen border-none shadow-md rounded-lg p-6">
//       <div className="flex lg:hidden justify-center">
//         <Logo />
//       </div>
//       <div className="p-6 space-y-4">
//         {/* Header and Add Admin Button */}
//         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
//           <div className="w-full">
//             <h1 className="font-bold text-1xl sm:text-3xl bg-[var(--charcoal-dark)] text-white p-1 rounded-md w-full">
//               Admin Dashboard
//             </h1>
//             <p style={{ color: "#2D2D2D" }} className="text-lg">
//               Manage system administrators and permissions
//             </p>
//           </div>
//         </div>
//         <div className="flex justify-end">
//           <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
//             <DialogTrigger asChild>
//               <Button style={{ backgroundColor: "#2DB85B", color: "white" }}>
//                 <UserPlus className="w-4 h-4 mr-2" />
//                 Add Admin
//               </Button>
//             </DialogTrigger>
//             <DialogContent
//               className="
//         max-w-md p-6 rounded-lg shadow-xl
//         text-[#1E1E1E] bg-white
//         !bg-[white]
//         border border-[#ffffff]
//       "
//               style={{
//                 backgroundColor: "#1E1E1E",
//                 backdropFilter: "none",
//                 WebkitBackdropFilter: "none",
//               }}
//             >
//               <DialogHeader>
//                 <DialogTitle>Add New Administrator</DialogTitle>
//                 <DialogDescription>
//                   Create a new admin account with full system access
//                 </DialogDescription>
//               </DialogHeader>
//               <form onSubmit={handleAddAdmin} className="space-y-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="name">Full Name</Label>
//                   <Input id="name" name="name" required />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="email">Corporate Email</Label>
//                   <Input
//                     id="email"
//                     name="email"
//                     type="email"
//                     placeholder="admin@ecogo.ca"
//                     required
//                   />
//                 </div>
//                 <div
//                   className="p-4 rounded-lg"
//                   style={{ backgroundColor: "#FEF3C7" }}
//                 >
//                   <p className="text-sm" style={{ color: "#92400E" }}>
//                     <strong>Important:</strong> This user will have full
//                     administrative access including user management, system
//                     settings, and audit logs.
//                   </p>
//                 </div>
//                 <div className="flex gap-2 justify-end">
//                   <Button
//                     type="button"
//                     variant="outline"
//                     onClick={() => setIsAddDialogOpen(false)}
//                   >
//                     Cancel
//                   </Button>
//                   <Button
//                     type="submit"
//                     style={{ backgroundColor: "#2DB85B", color: "white" }}
//                   >
//                     Create Admin
//                   </Button>
//                 </div>
//               </form>
//             </DialogContent>
//           </Dialog>
//         </div>

//         {/* Stats Cards - Responsive Grid: 1 column on small, 3 columns on medium+ */}
//         <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//           {stats.map((stat) => {
//             const Icon = stat.icon;
//             return (
//               <Card key={stat.label} className="bg-white border-none shadow-md">
//                 <CardContent className="pt-6">
//                   <div className="flex items-center gap-3 mb-2">
//                     <div className="w-10 h-10 rounded-lg flex items-center justify-center">
//                       {/* <Icon className="w-5 h-5" style={{ color: "#2DB85B" }} /> */}
//                       <stat.icon className={`h-5 w-5 ${stat.color}`} />
//                     </div>
//                     <h3 style={{ color: "#2D2D2D" }}>{stat.value}</h3>
//                   </div>
//                   <p style={{ color: "#2D2D2D" }}>{stat.label}</p>
//                 </CardContent>
//               </Card>
//             );
//           })}
//         </div>

//         {/* Search Bar */}
//         <CardContent className="bg-white border-none shadow-md rounded-lg h-10 p-0">
//           <div className="relative bg-white border-none rounded-lg h-full">
//             <Search
//               className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-800"
//               style={{ color: "#2D2D2D" }}
//             />
//             <Input
//               placeholder="Search admins by name or email..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="pl-10 bg-white border-none rounded-lg focus:outline-none focus:ring-0 shadow-none h-full"
//               style={{
//                 boxShadow: "none", // removes internal shadow
//                 outline: "none", // removes browser outline
//               }}
//             />
//           </div>
//         </CardContent>

//         {/* Administrators Table */}
//         <Card className="bg-white border-none shadow-md rounded-lg">
//           <CardHeader>
//             <CardTitle className="bg-[var(--charcoal-dark)] text-white p-1 rounded-md w-full">
//               All Administrators
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             {/* The overflow-x-auto ensures horizontal scrolling on small screens if the table is too wide */}
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead>
//                   <tr
//                     style={{ borderBottomWidth: "1px", borderColor: "#E6E6E6" }}
//                   >
//                     <th className="text-left p-4 min-w-[150px]">Name</th>
//                     <th className="text-left p-4 min-w-[200px]">Email</th>
//                     <th className="text-left p-4 min-w-[100px]">Status</th>
//                     <th className="text-left p-4 min-w-[100px]">Created</th>
//                     <th className="text-left p-4 min-w-[150px]">Last Login</th>
//                     <th className="text-right p-4 min-w-[100px]">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {adminOnlyList.map((admin) => (
//                     <tr
//                       key={admin.id}
//                       style={{
//                         borderBottomWidth: "1px",
//                         borderColor: "#E6E6E6",
//                       }}
//                     >
//                       <td className="p-4">
//                         {admin.role === "admin" && (
//                           <div className="flex items-center gap-2">
//                             <UserCheck
//                               className="w-4 h-4 flex-shrink-0"
//                               style={{ color: "#2DB85B" }}
//                             />
//                             <span className="truncate">
//                               {admin.name ?? admin.email ?? "Unknown"}
//                             </span>
//                           </div>
//                         )}
//                       </td>
//                       <td className="p-4 truncate max-w-[200px]">
//                         {admin.email ?? ""}
//                       </td>
//                       <td className="p-4">
//                         <Badge
//                           style={
//                             admin.status === "active"
//                               ? { backgroundColor: "#D0F5DC", color: "#1B6635" }
//                               : { backgroundColor: "#E6E6E6", color: "#2D2D2D" }
//                           }
//                         >
//                           {admin.status}
//                         </Badge>
//                       </td>
//                       <td
//                         className="p-4 text-sm whitespace-nowrap"
//                         style={{ color: "#2D2D2D" }}
//                       >
//                         {admin.createdAt?.toDate().toLocaleDateString()}
//                       </td>
//                       <td
//                         className="p-4 text-sm whitespace-nowrap"
//                         style={{ color: "#2D2D2D" }}
//                       >
//                         {admin.lastLogin
//                           ? admin.lastLogin.toDate().toLocaleString()
//                           : "Never"}
//                       </td>
//                       <td className="p-4">
//                         <div className="flex items-center justify-end gap-2">
//                           <Button size="sm" variant="ghost" title="Edit Admin">
//                             <Edit className="w-4 h-4" />
//                           </Button>
//                           <Button
//                             size="sm"
//                             variant="ghost"
//                             title="Delete Admin"
//                             onClick={() => handleDeleteAdmin(admin.id)}
//                           >
//                             <Trash2 className="w-4 h-4 text-red-600" />
//                           </Button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//               {adminOnlyList.length === 0 && (
//                 <div className="text-center py-8 text-gray-500">
//                   No administrators found matching your search.
//                 </div>
//               )}
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }

// /app/dashboard/admins/new/page.tsx
// "use client";

// import { useState } from "react";
// import { adminService } from "@/lib/services/adminService";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { useRouter } from "next/navigation";
// import { toast } from "sonner";

// export function AdminsPage() {
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e: any) => {
//     e.preventDefault();
//     setLoading(true);

//     const form = new FormData(e.target);

//     const payload = {
//       fullName: form.get("fullName"),
//       email: form.get("email"),
//       phone: form.get("phone"),
//       department: form.get("department"),
//       address: form.get("address"),
//     };

//     try {
//       await adminService.create(payload);
//       toast.success("Admin created");
//       router.push("/dashboard/admins");
//     } catch (err: any) {
//       toast.error(err.message);
//     }

//     setLoading(false);
//   };

//   return (
//     <div className="p-6 max-w-xl">
//       <h2 className="text-xl font-semibold mb-4">Create Admin</h2>

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <Label>Full Name</Label>
//           <Input name="fullName" required />
//         </div>

//         <div>
//           <Label>Email</Label>
//           <Input name="email" required />
//         </div>

//         <div>
//           <Label>Phone</Label>
//           <Input name="phone" required />
//         </div>

//         <div>
//           <Label>Department</Label>
//           <Input name="department" />
//         </div>

//         <div>
//           <Label>Address</Label>
//           <Input name="address" />
//         </div>

//         <Button disabled={loading} className="w-full">
//           {loading ? "Creating..." : "Create Admin"}
//         </Button>
//       </form>
//     </div>
//   );
// }

// /app/aabddhors / admins / page.tsx;c

// ("use client");

// import { useEffect, useState } from "react";
// import { adminService } from "@/lib/services/adminService";
// import { Button } from "@/components/ui/button";
// import Link from "next/link";
// import { toast } from "sonner";

// export default function AdminListPage() {
//   const [admins, setAdmins] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   const loadAdmins = async () => {
//     setLoading(true);
//     const data = await adminService.getAll();
//     setAdmins(data);
//     setLoading(false);
//   };

//   useEffect(() => {
//     loadAdmins();
//   }, []);

//   const handleDelete = async (id: string) => {
//     if (!confirm("Delete this admin?")) return;

//     await adminService.delete(id);
//     toast.success("Admin deleted");
//     loadAdmins();
//   };

//   if (loading) return <p className="p-6">Loading...</p>;

//   return (
//     <div className="p-6">
//       <div className="flex justify-between mb-4">
//         <h2 className="text-xl font-semibold">Admins</h2>
//         <Link href="/dashboard/admins/new">
//           <Button>Add Admin</Button>
//         </Link>
//       </div>

//       <div className="space-y-2">
//         {admins.map((a) => (
//           <div
//             key={a.id}
//             className="border p-4 rounded flex justify-between items-center"
//           >
//             <div>
//               <p className="font-medium">{a.fullName}</p>
//               <p className="text-sm text-gray-500">{a.email}</p>
//             </div>

//             <div className="flex gap-2">
//               <Link href={`/dashboard/admins/${a.id}`}>
//                 <Button variant="outline">View</Button>
//               </Link>

//               <Link href={`/dashboard/admins/${a.id}/edit`}>
//                 <Button>Edit</Button>
//               </Link>

//               <Button variant="destructive" onClick={() => handleDelete(a.id)}>
//                 Delete
//               </Button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }



// // /app/aabddhors / admins / [id] / page.tsx;

// // "use client";

// // import { useEffect, useState } from "react";
// // import { adminService } from "@/lib/services/adminService";
// // import { useParams } from "next/navigation";

// // export default function AdminDetailsPage() {
// //   const { id } = useParams();
// //   const [admin, setAdmin] = useState<any>(null);

// //   useEffect(() => {
// //     adminService.getById(id as string).then(setAdmin);
// //   }, [id]);

// //   if (!admin) return <p className="p-6">Loading...</p>;

// //   return (
// //     <div className="p-6">
// //       <h2 className="text-xl font-semibold mb-4">Admin Details</h2>

// //       <div className="space-y-2">
// //         <p>
// //           <strong>Name:</strong> {admin.fullName}
// //         </p>
// //         <p>
// //           <strong>Email:</strong> {admin.email}
// //         </p>
// //         <p>
// //           <strong>Phone:</strong> {admin.phone}
// //         </p>
// //         <p>
// //           <strong>Department:</strong> {admin.department}
// //         </p>
// //         <p>
// //           <strong>Address:</strong> {admin.address}
// //         </p>
// //       </div>
// //     </div>
// //   );
// // }


// // /app/aabddhors / admins / [id] / edit / page.tsx;
// // "use client";

// // import { useEffect, useState } from "react";
// // import { adminService } from "@/lib/services/adminService";
// // import { Button } from "@/components/ui/button";
// // import { Input } from "@/components/ui/input";
// // import { Label } from "@/components/ui/label";
// // import { toast } from "sonner";
// // import { useParams, useRouter } from "next/navigation";

// // export default function EditAdminPage() {
// //   const { id } = useParams();
// //   const router = useRouter();
// //   const [admin, setAdmin] = useState<any>(null);
// //   const [loading, setLoading] = useState(false);

// //   useEffect(() => {
// //     adminService.getById(id as string).then(setAdmin);
// //   }, [id]);

// //   const handleSubmit = async (e: any) => {
// //     e.preventDefault();
// //     setLoading(true);

// //     const payload = {
// //       fullName: e.target.fullName.value,
// //       phone: e.target.phone.value,
// //       department: e.target.department.value,
// //       address: e.target.address.value,
// //     };

// //     await adminService.update(id as string, payload);

// //     toast.success("Admin updated");
// //     router.push("/dashboard/admins");
// //   };

// //   if (!admin) return <p className="p-6">Loading...</p>;

// //   return (
// //     <div className="p-6 max-w-xl">
// //       <h2 className="text-xl font-semibold mb-4">Edit Admin</h2>

// //       <form onSubmit={handleSubmit} className="space-y-4">
// //         <div>
// //           <Label>Full Name</Label>
// //           <Input name="fullName" defaultValue={admin.fullName} required />
// //         </div>

// //         <div>
// //           <Label>Phone</Label>
// //           <Input name="phone" defaultValue={admin.phone} required />
// //         </div>

// //         <div>
// //           <Label>Department</Label>
// //           <Input name="department" defaultValue={admin.department} />
// //         </div>

// //         <div>
// //           <Label>Address</Label>
// //           <Input name="address" defaultValue={admin.address} />
// //         </div>

// //         <Button disabled={loading} className="w-full">
// //           {loading ? "Saving..." : "Save Changes"}
// //         </Button>
// //       </form>
// //     </div>
// //   );
// // }
