import { User } from "./user";

export interface CarInfo {
  make?: string;
  model?: string;
  year?: number;
  plate?: string;
  color?: string;
}

export interface InsuranceInfo {
  company?: string;
  policyNumber?: string;
  start?: string; // ISO
  end?: string; // ISO
}

export interface LicenseInfo {
  tncLicenseNumber?: string;
  issuedAt?: string;
}

export interface Driver {
  driverId: string; // same as users/{uid}
  car?: CarInfo;
  insurance?: InsuranceInfo;
  license?: LicenseInfo;
  trainingCompleted?: boolean;
  active?: boolean;
  commissionRate?: number; // e.g. 0.2
  documents?: string[]; // storage paths
  backgroundCheckStatus?: "pending" | "clear" | "failed";
  createdAt?: string; // ISO
}
