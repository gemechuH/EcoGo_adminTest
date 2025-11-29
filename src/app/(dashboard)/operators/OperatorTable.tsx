"use client";

import { useEffect, useState } from "react";
import EditOperator from "../../../components/operation/EditOperator";
import DeleteOperator from "../../../components/operation/DeleteOperator";

export default function OperatorTable({ refresh }: any) {
  const [operators, setOperators] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchOps = async () => {
      const res = await fetch("/api/operators");
      const data = await res.json();

      if (data.success) {
        setOperators(data.operators);
      }
      setIsLoaded(true);
    };

    fetchOps();
  }, [refresh]);

  if (!isLoaded) return <p>Loading...</p>;

  return (
    <table className="w-full border">
      <thead>
        <tr className="bg-gray-100">
          <th className="p-3 border">Name</th>
          <th className="p-3 border">Email</th>
          <th className="p-3 border">Phone</th>
          <th className="p-3 border">Actions</th>
        </tr>
      </thead>

      <tbody>
        {operators.map((op: any) => (
          <tr key={op.id}>
            <td className="p-3 border">{op.fullName}</td>
            <td className="p-3 border">{op.email}</td>
            <td className="p-3 border">{op.phone}</td>
            <td className="p-3 border flex gap-2">
              <EditOperator operator={op} />

              <DeleteOperator operatorId={op.id} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
