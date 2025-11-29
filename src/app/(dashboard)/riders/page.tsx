import { RidersPage } from "@/components/RidersPage";
import { requirePermission } from "@/lib/auth";

export default async function Page() {
  await requirePermission("riders", "read");
  return <RidersPage />;
}

// "use client";

// import { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { Loader2, Plus, Edit, Trash, Eye } from "lucide-react";

// import CreateRiderModal from "./CreateRiderModal";
// import EditRider from "./EditRider";
// import DeleteRider from "./DeleteRider";

// export default function RidersPage() {
//   const [riders, setRiders] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [openCreate, setOpenCreate] = useState(false);

//   const fetchRiders = async () => {
//     setLoading(true);
//     const res = await fetch("/api/riders");
//     const data = await res.json();
//     setRiders(data.riders || []);
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchRiders();
//   }, []);

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-semibold">Riders Dashboard</h1>

//         <Button onClick={() => setOpenCreate(true)}>
//           <Plus className="w-4 h-4 mr-2" />
//           Add Rider
//         </Button>
//       </div>

//       {loading ? (
//         <div className="flex justify-center p-10">
//           <Loader2 className="animate-spin w-8 h-8" />
//         </div>
//       ) : (
//         <Card className="p-4">
//           <table className="w-full text-sm">
//             <thead>
//               <tr className="border-b">
//                 <th className="p-3 text-left">Name</th>
//                 <th className="p-3 text-left">Phone</th>
//                 <th className="p-3 text-left">Email</th>
//                 <th className="p-3 text-left">Trips</th>
//                 <th className="p-3 text-left">Status</th>
//                 <th className="p-3 text-right">Actions</th>
//               </tr>
//             </thead>

//             <tbody>
//               {riders.map((rider: any) => (
//                 <tr key={rider.id} className="border-b hover:bg-gray-50">
//                   <td className="p-3">{rider.name}</td>
//                   <td className="p-3">{rider.phone}</td>
//                   <td className="p-3">{rider.email}</td>
//                   <td className="p-3">{rider.totalTrips}</td>
//                   <td className="p-3">{rider.status || "active"}</td>

//                   <td className="p-3 text-right flex gap-2 justify-end">
//                     {/* VIEW */}
//                     <Button
//                       size="sm"
//                       variant="outline"
//                       onClick={() =>
//                         (window.location.href = `/riders/${rider.id}`)
//                       }
//                     >
//                       <Eye className="w-4 h-4" />
//                     </Button>

//                     {/* EDIT */}
//                     <EditRider rider={rider} onUpdated={fetchRiders} />

//                     {/* DELETE */}
//                     <DeleteRider rider={rider} onDeleted={fetchRiders} />
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </Card>
//       )}

//       {openCreate && (
//         <CreateRiderModal
//           onClose={() => setOpenCreate(false)}
//           onCreated={fetchRiders}
//         />
//       )}
//     </div>
//   );
// }

