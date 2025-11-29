"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function RiderDetails({ params }: any) {
  const { id } = params;
  const [rider, setRider] = useState<any>();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);

    const r = await fetch(`/api/riders/${id}`);
    const rData = await r.json();

    const h = await fetch(`/api/riders/${id}/history`);
    const hData = await h.json();

    setRider(rData.rider);
    setHistory(hData.history);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center p-10">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Rider Details</h1>

      <Card className="p-4 mb-6">
        <h2 className="text-lg font-semibold">{rider.name}</h2>
        <p>Email: {rider.email}</p>
        <p>Phone: {rider.phone}</p>
        <p>Total Trips: {rider.totalTrips}</p>
      </Card>

      <h2 className="text-lg font-semibold mb-2">Trip History</h2>

      <Card className="p-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="p-2 text-left">Trip ID</th>
              <th className="p-2 text-left">From</th>
              <th className="p-2 text-left">To</th>
              <th className="p-2 text-left">Fare</th>
              <th className="p-2 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {history.map((trip: any) => (
              <tr key={trip.id} className="border-b">
                <td className="p-2">{trip.id}</td>
                <td className="p-2">{trip.origin?.address}</td>
                <td className="p-2">{trip.destination?.address}</td>
                <td className="p-2">${trip.destination?.fare}</td>
                <td className="p-2">{trip.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
