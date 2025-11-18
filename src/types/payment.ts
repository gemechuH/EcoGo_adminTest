export interface Payment {
  paymentId: string;
  rideId?: string;
  amount: number;
  method: "card" | "cash" | "wallet" | string;
  status: "pending" | "succeeded" | "failed" | "refunded";
  processingFees?: number;
  platformShare?: number;
  driverShare?: number;
  currency: string;
  createdAt: string; // ISO
  externalId?: string; // stripe charge id, etc.
}

export interface Payout {
  payoutId: string;
  driverId: string;
  amount: number;
  status: "pending" | "processing" | "completed" | "failed";
  scheduledAt?: string; // ISO
  completedAt?: string; // ISO
  createdAt?: string; // ISO
  externalId?: string;
}
