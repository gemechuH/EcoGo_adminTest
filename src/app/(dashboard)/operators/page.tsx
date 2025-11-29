import { OperatorsPage } from "@/components/OperatorsPage";
import { requirePermission } from "@/lib/auth";

export default async function Page() {
  await requirePermission("operators", "read");
  return <OperatorsPage />;
}
// "use client";

// import OperatorTable from "./OperatorTable";
// import CreateOperator from "./CreateOperator";
// import { useState } from "react";

// export default function OperatorsPage() {
//   const [refresh, setRefresh] = useState(false);

//   return (
//     <div className="p-6">
//       <div className="flex justify-between mb-4">
//         <h1 className="text-2xl font-bold">Operators</h1>
//         <CreateOperator onCreated={() => setRefresh(!refresh)} />
//       </div>

//       <OperatorTable refresh={refresh} />
//     </div>
//   );
// }
