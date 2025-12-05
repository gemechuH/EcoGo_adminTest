"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  MoreVertical,
  Eye,
  Download,
  Home,
  Filter,
  RotateCcw,
  Calendar,
  TrendingUp,
  TrendingDown,
  Car,
  Users,
  Clock,
  X,
  ChevronRight,
  ChevronLeft,
  ChevronsRight,
  ChevronsLeft,
  FileText,
  User,
  Phone,
  Mail,
  Star,
  Navigation,
  AlertTriangle,
  XCircle,
  UserX,
  CarFront,
  AlertOctagon,
  Timer,
  MapPin,
  Ban,
  RefreshCw,
  Activity,
  Zap,
} from "lucide-react";

// --- CONFIGURATION ---
const PAGE_SIZE = 10;

// --- UI COMPONENTS ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "destructive";
}

const Button: React.FC<ButtonProps> = ({
  children,
  className = "",
  variant = "default",
  ...props
}) => {
  let style =
    "px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center";
  if (variant === "default")
    style += " text-white bg-emerald-600 hover:bg-emerald-700";
  else if (variant === "outline")
    style += " border border-gray-300 text-gray-700 hover:bg-gray-100";
  else if (variant === "ghost") style += " text-gray-700 hover:bg-gray-100";
  else if (variant === "destructive")
    style += " bg-red-600 text-white hover:bg-red-700";
  return (
    <button className={`${style} ${className}`} {...props}>
      {children}
    </button>
  );
};

const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = (
  props
) => (
  <select
    className="flex h-9 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
    {...props}
  />
);

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => (
  <div
    className={`rounded-xl bg-white shadow-sm border border-gray-100 ${className}`}
  >
    {children}
  </div>
);

// Dropdown Menu
const DropdownMenu: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <div className="relative inline-block text-left">{children}</div>;

const DropdownMenuTrigger: React.FC<{
  children: React.ReactNode;
  onClick: () => void;
}> = ({ children, onClick }) => (
  <button
    onClick={onClick}
    className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
  >
    {children}
  </button>
);

const DropdownMenuContent: React.FC<{
  children: React.ReactNode;
  isOpen: boolean;
}> = ({ children, isOpen }) => {
  if (!isOpen) return null;
  return (
    <div className="absolute right-0 z-20 mt-1 w-52 rounded-lg bg-white shadow-lg border border-gray-200">
      <div className="py-1">{children}</div>
    </div>
  );
};

const DropdownMenuItem: React.FC<{
  children: React.ReactNode;
  onClick: () => void;
  icon: React.ReactNode;
}> = ({ children, onClick, icon }) => (
  <button
    onClick={onClick}
    className="flex w-full items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
  >
    {icon}
    <span className="ml-2">{children}</span>
  </button>
);

// Modal Dialog
const Dialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "md" | "lg" | "xl";
}> = ({ isOpen, onClose, title, children, size = "lg" }) => {
  if (!isOpen) return null;

  const sizeClasses = { md: "max-w-md", lg: "max-w-2xl", xl: "max-w-4xl" };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm">
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className={`relative w-full ${sizeClasses[size]} transform rounded-2xl bg-white shadow-2xl transition-all`}
        >
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          <div className="p-5 max-h-[75vh] overflow-y-auto">{children}</div>
        </div>
      </div>
    </div>
  );
};

// --- DATA TYPES ---
type CancelledBy = "RIDER" | "DRIVER" | "SYSTEM";

type CancellationReason =
  | "DRIVER_NOT_FOUND"
  | "DRIVER_CANCELLED"
  | "RIDER_CANCELLED"
  | "RIDER_NO_SHOW"
  | "DRIVER_NO_SHOW"
  | "PAYMENT_FAILED"
  | "ROUTE_ISSUE"
  | "EMERGENCY"
  | "CHANGED_PLANS"
  | "WRONG_ADDRESS"
  | "WAIT_TIME_TOO_LONG"
  | "VEHICLE_ISSUE"
  | "PRICE_TOO_HIGH"
  | "FOUND_ANOTHER_RIDE"
  | "SYSTEM_ERROR";

interface Driver {
  id: string;
  name: string;
  phone: string;
  email: string;
  rating: number;
  vehicleNumber: string;
  vehicleModel: string;
}

interface Rider {
  id: string;
  name: string;
  phone: string;
  email: string;
  rating: number;
}

interface DispatchLog {
  driverId: string;
  driverName: string;
  dispatchedAt: Date;
  respondedAt?: Date;
  response: "ACCEPTED" | "REJECTED" | "TIMEOUT" | "CANCELLED";
  reason?: string;
}

interface CancelledRide {
  id: string;
  srNo: number;
  rider: Rider;
  driver?: Driver;
  pickupAddress: string;
  dropAddress: string;
  requestedAt: Date;
  cancelledAt: Date;
  cancelledBy: CancelledBy;
  cancellationReason: CancellationReason;
  reasonDetail?: string;
  estimatedFare: number;
  distance: number;
  rideType: string;
  vehicleType: string;
  dispatchAttempts: number;
  dispatchLogs: DispatchLog[];
  refundStatus: "PENDING" | "PROCESSED" | "NOT_APPLICABLE";
  refundAmount: number;
  waitTime: number; // in seconds
}

// --- CONSTANTS ---
const CANCELLATION_REASON_CONFIG: Record<
  CancellationReason,
  { label: string; color: string }
> = {
  DRIVER_NOT_FOUND: {
    label: "No Driver Available",
    color: "bg-orange-100 text-orange-700 border-orange-200",
  },
  DRIVER_CANCELLED: {
    label: "Driver Cancelled",
    color: "bg-gray-800 text-white border-gray-700",
  },
  RIDER_CANCELLED: {
    label: "Rider Cancelled",
    color: "bg-blue-100 text-blue-700 border-blue-200",
  },
  RIDER_NO_SHOW: {
    label: "Rider No Show",
    color: "bg-amber-100 text-amber-700 border-amber-200",
  },
  DRIVER_NO_SHOW: {
    label: "Driver No Show",
    color: "bg-gray-700 text-white border-gray-600",
  },
  PAYMENT_FAILED: {
    label: "Payment Failed",
    color: "bg-gray-800 text-white border-gray-700",
  },
  ROUTE_ISSUE: {
    label: "Route Issue",
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
  },
  EMERGENCY: {
    label: "Emergency",
    color: "bg-pink-100 text-pink-700 border-pink-200",
  },
  CHANGED_PLANS: {
    label: "Changed Plans",
    color: "bg-gray-100 text-gray-700 border-gray-200",
  },
  WRONG_ADDRESS: {
    label: "Wrong Address",
    color: "bg-orange-100 text-orange-700 border-orange-200",
  },
  WAIT_TIME_TOO_LONG: {
    label: "Wait Time Too Long",
    color: "bg-amber-100 text-amber-700 border-amber-200",
  },
  VEHICLE_ISSUE: {
    label: "Vehicle Issue",
    color: "bg-gray-700 text-white border-gray-600",
  },
  PRICE_TOO_HIGH: {
    label: "Price Too High",
    color: "bg-purple-100 text-purple-700 border-purple-200",
  },
  FOUND_ANOTHER_RIDE: {
    label: "Found Another Ride",
    color: "bg-indigo-100 text-indigo-700 border-indigo-200",
  },
  SYSTEM_ERROR: {
    label: "System Error",
    color: "bg-gray-100 text-gray-700 border-gray-200",
  },
};

const CANCELLED_BY_CONFIG: Record<
  CancelledBy,
  { label: string; icon: React.ReactNode; color: string }
> = {
  RIDER: {
    label: "Rider",
    icon: <UserX className="w-3.5 h-3.5" />,
    color: "bg-blue-50 text-blue-700 border-blue-200",
  },
  DRIVER: {
    label: "Driver",
    icon: <CarFront className="w-3.5 h-3.5" />,
    color: "bg-orange-50 text-orange-700 border-orange-200",
  },
  SYSTEM: {
    label: "System",
    icon: <AlertOctagon className="w-3.5 h-3.5" />,
    color: "bg-gray-50 text-gray-700 border-gray-200",
  },
};

// --- MOCK DATA ---
const MOCK_DRIVERS: Driver[] = [
  {
    id: "DRV001",
    name: "Michael Johnson",
    phone: "+1 555-0101",
    email: "michael.j@driver.com",
    rating: 4.9,
    vehicleNumber: "ABC-1234",
    vehicleModel: "Toyota Camry 2022",
  },
  {
    id: "DRV002",
    name: "Sarah Williams",
    phone: "+1 555-0102",
    email: "sarah.w@driver.com",
    rating: 4.8,
    vehicleNumber: "XYZ-5678",
    vehicleModel: "Honda Accord 2021",
  },
  {
    id: "DRV003",
    name: "James Brown",
    phone: "+1 555-0103",
    email: "james.b@driver.com",
    rating: 4.7,
    vehicleNumber: "DEF-9012",
    vehicleModel: "Tesla Model 3",
  },
  {
    id: "DRV004",
    name: "Emily Davis",
    phone: "+1 555-0104",
    email: "emily.d@driver.com",
    rating: 4.95,
    vehicleNumber: "GHI-3456",
    vehicleModel: "BMW 3 Series",
  },
];

const MOCK_RIDERS: Rider[] = [
  {
    id: "RDR001",
    name: "John Smith",
    phone: "+1 555-1001",
    email: "john.smith@email.com",
    rating: 4.8,
  },
  {
    id: "RDR002",
    name: "Lisa Anderson",
    phone: "+1 555-1002",
    email: "lisa.a@email.com",
    rating: 4.9,
  },
  {
    id: "RDR003",
    name: "David Wilson",
    phone: "+1 555-1003",
    email: "david.w@email.com",
    rating: 4.5,
  },
  {
    id: "RDR004",
    name: "Emma Thompson",
    phone: "+1 555-1004",
    email: "emma.t@email.com",
    rating: 5.0,
  },
  {
    id: "RDR005",
    name: "Chris Martinez",
    phone: "+1 555-1005",
    email: "chris.m@email.com",
    rating: 4.7,
  },
];

const PICKUP_LOCATIONS = [
  "123 Main Street, Downtown",
  "456 Oak Avenue, Westside",
  "789 Pine Road, Northgate",
  "321 Elm Boulevard, Eastpoint",
  "654 Maple Lane, Southpark",
];
const DROP_LOCATIONS = [
  "Airport Terminal 1",
  "Central Business District",
  "Grand Shopping Mall",
  "City Hospital",
  "University Campus",
];
const RIDE_TYPES = ["Standard", "Premium", "Shared", "XL"];
const VEHICLE_TYPES = ["Sedan", "SUV", "Hatchback", "Luxury"];
const CANCELLATION_REASONS: CancellationReason[] = [
  "DRIVER_NOT_FOUND",
  "DRIVER_CANCELLED",
  "RIDER_CANCELLED",
  "RIDER_NO_SHOW",
  "WAIT_TIME_TOO_LONG",
  "CHANGED_PLANS",
  "PRICE_TOO_HIGH",
  "FOUND_ANOTHER_RIDE",
  "VEHICLE_ISSUE",
  "PAYMENT_FAILED",
];

// Generate mock cancelled rides
const generateMockCancelledRides = (count: number): CancelledRide[] => {
  const rides: CancelledRide[] = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const daysAgo = Math.floor(Math.random() * 14);
    const hoursAgo = Math.floor(Math.random() * 24);
    const cancelledAt = new Date(now);
    cancelledAt.setDate(cancelledAt.getDate() - daysAgo);
    cancelledAt.setHours(cancelledAt.getHours() - hoursAgo);

    const requestedAt = new Date(cancelledAt);
    requestedAt.setMinutes(
      requestedAt.getMinutes() - Math.floor(Math.random() * 15) - 1
    );

    const reason = CANCELLATION_REASONS[i % CANCELLATION_REASONS.length];
    const cancelledBy: CancelledBy =
      reason === "RIDER_CANCELLED" ||
      reason === "CHANGED_PLANS" ||
      reason === "PRICE_TOO_HIGH" ||
      reason === "FOUND_ANOTHER_RIDE"
        ? "RIDER"
        : reason === "DRIVER_CANCELLED" ||
          reason === "VEHICLE_ISSUE" ||
          reason === "DRIVER_NO_SHOW"
        ? "DRIVER"
        : "SYSTEM";

    const hasDriver = cancelledBy !== "SYSTEM" || Math.random() > 0.3;
    const distance = 2 + Math.random() * 20;
    const estimatedFare = 5 + distance * 1.5;

    // Generate dispatch logs
    const dispatchAttempts = Math.floor(Math.random() * 4) + 1;
    const dispatchLogs: DispatchLog[] = [];
    for (let j = 0; j < dispatchAttempts; j++) {
      const driver = MOCK_DRIVERS[j % MOCK_DRIVERS.length];
      const dispatchedAt = new Date(requestedAt);
      dispatchedAt.setSeconds(dispatchedAt.getSeconds() + j * 30);

      const responses: Array<
        "ACCEPTED" | "REJECTED" | "TIMEOUT" | "CANCELLED"
      > = ["REJECTED", "TIMEOUT", "CANCELLED"];
      const response =
        j === dispatchAttempts - 1 && hasDriver && cancelledBy === "DRIVER"
          ? "CANCELLED"
          : j === dispatchAttempts - 1 && hasDriver
          ? "ACCEPTED"
          : responses[Math.floor(Math.random() * 3)];

      dispatchLogs.push({
        driverId: driver.id,
        driverName: driver.name,
        dispatchedAt,
        respondedAt: new Date(dispatchedAt.getTime() + Math.random() * 20000),
        response,
        reason:
          response === "REJECTED"
            ? "Too far"
            : response === "CANCELLED"
            ? "Personal emergency"
            : undefined,
      });
    }

    rides.push({
      id: `CAN-${String(1000 + i).padStart(4, "0")}`,
      srNo: i + 1,
      rider: MOCK_RIDERS[i % MOCK_RIDERS.length],
      driver: hasDriver ? MOCK_DRIVERS[i % MOCK_DRIVERS.length] : undefined,
      pickupAddress: PICKUP_LOCATIONS[i % PICKUP_LOCATIONS.length],
      dropAddress: DROP_LOCATIONS[i % DROP_LOCATIONS.length],
      requestedAt,
      cancelledAt,
      cancelledBy,
      cancellationReason: reason,
      reasonDetail:
        reason === "CHANGED_PLANS"
          ? "Meeting got rescheduled"
          : reason === "VEHICLE_ISSUE"
          ? "Flat tire"
          : undefined,
      estimatedFare: Math.round(estimatedFare * 100) / 100,
      distance: Math.round(distance * 10) / 10,
      rideType: RIDE_TYPES[i % RIDE_TYPES.length],
      vehicleType: VEHICLE_TYPES[i % VEHICLE_TYPES.length],
      dispatchAttempts,
      dispatchLogs,
      refundStatus:
        cancelledBy === "RIDER" && Math.random() > 0.5
          ? "NOT_APPLICABLE"
          : Math.random() > 0.3
          ? "PROCESSED"
          : "PENDING",
      refundAmount:
        cancelledBy === "DRIVER" || cancelledBy === "SYSTEM"
          ? Math.round(estimatedFare * 0.1 * 100) / 100
          : 0,
      waitTime: Math.floor(Math.random() * 600) + 60,
    });
  }

  return rides.sort(
    (a, b) => b.cancelledAt.getTime() - a.cancelledAt.getTime()
  );
};

const MOCK_CANCELLED_RIDES = generateMockCancelledRides(45);

// --- HELPER COMPONENTS ---
const StatCard: React.FC<{
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: { value: number; isPositive: boolean };
  color: string;
}> = ({ title, value, subtitle, icon, trend, color }) => (
  <Card className="p-4">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          {title}
        </p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
        {trend && (
          <div
            className={`flex items-center gap-1 mt-2 text-xs font-medium ${
              trend.isPositive ? "text-gray-700" : "text-emerald-600"
            }`}
          >
            {trend.isPositive ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            <span>{trend.value}% vs yesterday</span>
          </div>
        )}
      </div>
      <div className={`p-2.5 rounded-xl ${color}`}>{icon}</div>
    </div>
  </Card>
);

const CancelledByBadge: React.FC<{ cancelledBy: CancelledBy }> = ({
  cancelledBy,
}) => {
  const config = CANCELLED_BY_CONFIG[cancelledBy];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.color}`}
    >
      {config.icon}
      {config.label}
    </span>
  );
};

const ReasonBadge: React.FC<{ reason: CancellationReason }> = ({ reason }) => {
  const config = CANCELLATION_REASON_CONFIG[reason];
  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${config.color}`}
    >
      {config.label}
    </span>
  );
};

const RefundBadge: React.FC<{ status: CancelledRide["refundStatus"] }> = ({
  status,
}) => {
  const config = {
    PENDING: {
      label: "Pending",
      color: "bg-amber-50 text-amber-700 border-amber-200",
    },
    PROCESSED: {
      label: "Processed",
      color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    NOT_APPLICABLE: {
      label: "N/A",
      color: "bg-gray-50 text-gray-500 border-gray-200",
    },
  };
  const c = config[status];
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${c.color}`}
    >
      {c.label}
    </span>
  );
};

const RatingStars: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="flex items-center gap-1">
    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
    <span className="text-sm font-medium text-gray-700">
      {rating.toFixed(1)}
    </span>
  </div>
);

const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
};

// --- DETAIL MODAL ---
const CancelledRideDetailModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  ride: CancelledRide | null;
}> = ({ isOpen, onClose, ride }) => {
  if (!ride) return null;

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={`Cancellation Details - ${ride.id}`}
      size="xl"
    >
      <div className="space-y-6">
        {/* Cancellation Summary */}
        <div className="p-4 bg-gray-100 rounded-xl border border-gray-200">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-800 rounded-lg">
                <XCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">
                  Ride Cancelled
                </p>
                <p className="text-xs text-gray-600 mt-0.5">
                  {ride.cancelledAt.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="text-right">
              <CancelledByBadge cancelledBy={ride.cancelledBy} />
              <p className="text-xs text-gray-500 mt-2">
                Wait time: {formatDuration(ride.waitTime)}
              </p>
            </div>
          </div>
          <div className="mt-4 p-3 bg-white rounded-lg border border-gray-300">
            <p className="text-xs text-gray-500 mb-1">Cancellation Reason</p>
            <div className="flex items-center gap-2">
              <ReasonBadge reason={ride.cancellationReason} />
              {ride.reasonDetail && (
                <span className="text-sm text-gray-600 italic">
                  &quot;{ride.reasonDetail}&quot;
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Rider & Driver Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Rider Card */}
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold text-gray-700">
                Rider Information
              </span>
              {ride.cancelledBy === "RIDER" && (
                <span className="ml-auto text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                  Cancelled by
                </span>
              )}
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="font-semibold text-gray-900">{ride.rider.name}</p>
                <RatingStars rating={ride.rider.rating} />
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Phone className="w-3 h-3" /> {ride.rider.phone}
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Mail className="w-3 h-3" /> {ride.rider.email}
                </div>
              </div>
            </div>
          </div>

          {/* Driver Card */}
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <Car className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-semibold text-gray-700">
                Driver Information
              </span>
              {ride.cancelledBy === "DRIVER" && (
                <span className="ml-auto text-xs px-2 py-0.5 bg-orange-100 text-orange-700 rounded">
                  Cancelled by
                </span>
              )}
            </div>
            {ride.driver ? (
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Car className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="font-semibold text-gray-900">
                    {ride.driver.name}
                  </p>
                  <RatingStars rating={ride.driver.rating} />
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Phone className="w-3 h-3" /> {ride.driver.phone}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {ride.driver.vehicleModel} • {ride.driver.vehicleNumber}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <p className="text-sm text-gray-600">No driver was assigned</p>
              </div>
            )}
          </div>
        </div>

        {/* Route Details */}
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <Navigation className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-semibold text-gray-700">
              Route Details
            </span>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-emerald-200" />
              <div className="w-0.5 h-12 bg-gray-300" />
              <div className="w-3 h-3 rounded-full bg-gray-800 border-2 border-gray-300" />
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <p className="text-xs text-gray-500">Pickup Location</p>
                <p className="text-sm font-medium text-gray-900">
                  {ride.pickupAddress}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Drop Location</p>
                <p className="text-sm font-medium text-gray-900">
                  {ride.dropAddress}
                </p>
              </div>
            </div>
            <div className="text-right space-y-2">
              <div className="p-2 bg-white rounded-lg border border-gray-200">
                <p className="text-xs text-gray-500">Distance</p>
                <p className="text-lg font-bold text-gray-900">
                  {ride.distance} km
                </p>
              </div>
              <div className="p-2 bg-white rounded-lg border border-gray-200">
                <p className="text-xs text-gray-500">Est. Fare</p>
                <p className="text-lg font-bold text-gray-900">
                  ${ride.estimatedFare.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Dispatch Timeline */}
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-semibold text-gray-700">
              Dispatch Timeline
            </span>
            <span className="ml-auto text-xs px-2 py-0.5 bg-gray-200 text-gray-600 rounded">
              {ride.dispatchAttempts} attempt
              {ride.dispatchAttempts > 1 ? "s" : ""}
            </span>
          </div>
          <div className="space-y-3">
            {/* Ride Requested */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                <Zap className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1 pt-1">
                <p className="text-sm font-medium text-gray-900">
                  Ride Requested
                </p>
                <p className="text-xs text-gray-500">
                  {ride.requestedAt.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Dispatch Logs */}
            {ride.dispatchLogs.map((log, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 ml-4 border-l-2 border-gray-200 pl-4"
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                    log.response === "ACCEPTED"
                      ? "bg-emerald-100"
                      : log.response === "REJECTED"
                      ? "bg-gray-200"
                      : log.response === "CANCELLED"
                      ? "bg-orange-100"
                      : "bg-gray-100"
                  }`}
                >
                  {log.response === "ACCEPTED" ? (
                    <Car className="w-3 h-3 text-emerald-600" />
                  ) : log.response === "REJECTED" ? (
                    <Ban className="w-3 h-3 text-gray-700" />
                  ) : log.response === "CANCELLED" ? (
                    <XCircle className="w-3 h-3 text-orange-600" />
                  ) : (
                    <Timer className="w-3 h-3 text-gray-500" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900">
                      {log.driverName}
                    </p>
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded ${
                        log.response === "ACCEPTED"
                          ? "bg-emerald-100 text-emerald-700"
                          : log.response === "REJECTED"
                          ? "bg-gray-200 text-gray-700"
                          : log.response === "CANCELLED"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {log.response}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Dispatched: {log.dispatchedAt.toLocaleTimeString()}
                    {log.respondedAt &&
                      ` • Responded: ${log.respondedAt.toLocaleTimeString()}`}
                  </p>
                  {log.reason && (
                    <p className="text-xs text-gray-500 italic mt-0.5">
                      Reason: {log.reason}
                    </p>
                  )}
                </div>
              </div>
            ))}

            {/* Cancelled */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center shrink-0">
                <XCircle className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 pt-1">
                <p className="text-sm font-medium text-gray-800">
                  Ride Cancelled
                </p>
                <p className="text-xs text-gray-500">
                  {ride.cancelledAt.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Ride Info & Refund */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <Car className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-semibold text-gray-700">
                Ride Info
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-500">Ride Type</p>
                <p className="text-sm font-medium text-gray-900">
                  {ride.rideType}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Vehicle Type</p>
                <p className="text-sm font-medium text-gray-900">
                  {ride.vehicleType}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Request ID</p>
                <p className="text-sm font-mono text-gray-900">{ride.id}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Wait Time</p>
                <p className="text-sm font-medium text-gray-900">
                  {formatDuration(ride.waitTime)}
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <RefreshCw className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-semibold text-gray-700">
                Refund Status
              </span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <RefundBadge status={ride.refundStatus} />
              </div>
              {ride.refundAmount > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Refund Amount</span>
                  <span className="text-sm font-semibold text-emerald-600">
                    ${ride.refundAmount.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Est. Fare Lost</span>
                <span className="text-sm font-medium text-gray-900">
                  ${ride.estimatedFare.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

// --- MAIN COMPONENT ---
export default function CancelledRidesPage() {
  const [timeFilter, setTimeFilter] = useState<
    "today" | "yesterday" | "week" | "all"
  >("today");
  const [searchTerm, setSearchTerm] = useState("");
  const [cancelledByFilter, setCancelledByFilter] = useState("");
  const [reasonFilter, setReasonFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRide, setSelectedRide] = useState<CancelledRide | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);

  // Filter by time
  const getFilteredByTime = (rides: CancelledRide[]) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    switch (timeFilter) {
      case "today":
        return rides.filter((r) => r.cancelledAt >= today);
      case "yesterday":
        return rides.filter(
          (r) => r.cancelledAt >= yesterday && r.cancelledAt < today
        );
      case "week":
        return rides.filter((r) => r.cancelledAt >= weekAgo);
      default:
        return rides;
    }
  };

  // Calculate stats
  const todayRides = MOCK_CANCELLED_RIDES.filter((r) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return r.cancelledAt >= today;
  });
  const yesterdayRides = MOCK_CANCELLED_RIDES.filter((r) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    return r.cancelledAt >= yesterday && r.cancelledAt < today;
  });
  const weekRides = MOCK_CANCELLED_RIDES.filter((r) => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return r.cancelledAt >= weekAgo;
  });

  const todayByRider = todayRides.filter(
    (r) => r.cancelledBy === "RIDER"
  ).length;
  const todayByDriver = todayRides.filter(
    (r) => r.cancelledBy === "DRIVER"
  ).length;
  const todayBySystem = todayRides.filter(
    (r) => r.cancelledBy === "SYSTEM"
  ).length;

  const cancelTrend =
    yesterdayRides.length > 0
      ? Math.round(
          ((todayRides.length - yesterdayRides.length) /
            yesterdayRides.length) *
            100
        )
      : 0;

  // Filter and search
  const filteredRides = useMemo(() => {
    let rides = getFilteredByTime(MOCK_CANCELLED_RIDES);

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      rides = rides.filter(
        (r) =>
          r.id.toLowerCase().includes(term) ||
          r.rider.name.toLowerCase().includes(term) ||
          r.driver?.name.toLowerCase().includes(term) ||
          r.rider.email.toLowerCase().includes(term)
      );
    }

    if (cancelledByFilter) {
      rides = rides.filter((r) => r.cancelledBy === cancelledByFilter);
    }

    if (reasonFilter) {
      rides = rides.filter((r) => r.cancellationReason === reasonFilter);
    }

    return rides;
  }, [timeFilter, searchTerm, cancelledByFilter, reasonFilter]);

  const totalPages = Math.ceil(filteredRides.length / PAGE_SIZE);
  const paginatedRides = filteredRides.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleClearFilters = () => {
    setSearchTerm("");
    setCancelledByFilter("");
    setReasonFilter("");
    setCurrentPage(1);
  };

  const openDetailModal = (ride: CancelledRide) => {
    setSelectedRide(ride);
    setIsDetailModalOpen(true);
    setActionMenuOpen(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      {/* Page Header */}
      <div className="mb-6">
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white px-4 py-3 rounded-lg shadow-sm">
          <h1 className="text-xl font-semibold">Cancelled Rides</h1>
        </div>
        <nav className="flex items-center gap-2 mt-2 text-sm">
          <Link
            href="/ride"
            className="text-emerald-600 hover:text-emerald-700 hover:underline font-medium flex items-center gap-1"
          >
            <Home className="w-3.5 h-3.5" /> Home
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-600">Cancelled Rides</span>
        </nav>
      </div>

      {/* Time Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        {[
          { key: "today", label: "Today", icon: <Clock className="w-4 h-4" /> },
          {
            key: "yesterday",
            label: "Yesterday",
            icon: <Calendar className="w-4 h-4" />,
          },
          {
            key: "week",
            label: "This Week",
            icon: <Calendar className="w-4 h-4" />,
          },
          {
            key: "all",
            label: "All Time",
            icon: <FileText className="w-4 h-4" />,
          },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setTimeFilter(tab.key as typeof timeFilter);
              setCurrentPage(1);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              timeFilter === tab.key
                ? "bg-gray-900 text-white shadow-sm"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <StatCard
          title="Today's Cancellations"
          value={todayRides.length}
          icon={<XCircle className="w-5 h-5 text-gray-700" />}
          trend={{ value: Math.abs(cancelTrend), isPositive: cancelTrend > 0 }}
          color="bg-gray-100"
        />
        <StatCard
          title="By Rider"
          value={todayByRider}
          subtitle={`${(
            (todayByRider / (todayRides.length || 1)) *
            100
          ).toFixed(0)}% of total`}
          icon={<UserX className="w-5 h-5 text-blue-600" />}
          color="bg-blue-50"
        />
        <StatCard
          title="By Driver"
          value={todayByDriver}
          subtitle={`${(
            (todayByDriver / (todayRides.length || 1)) *
            100
          ).toFixed(0)}% of total`}
          icon={<CarFront className="w-5 h-5 text-orange-600" />}
          color="bg-orange-50"
        />
        <StatCard
          title="By System"
          value={todayBySystem}
          subtitle="No driver found"
          icon={<AlertOctagon className="w-5 h-5 text-gray-600" />}
          color="bg-gray-100"
        />
        <StatCard
          title="Yesterday"
          value={yesterdayRides.length}
          subtitle="Cancelled rides"
          icon={<Calendar className="w-5 h-5 text-purple-600" />}
          color="bg-purple-50"
        />
        <StatCard
          title="This Week"
          value={weekRides.length}
          subtitle={`$${weekRides
            .reduce((s, r) => s + r.estimatedFare, 0)
            .toFixed(0)} lost`}
          icon={<TrendingDown className="w-5 h-5 text-pink-600" />}
          color="bg-pink-50"
        />
      </div>

      {/* Filters Card */}
      <Card className="mb-6">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-2 text-gray-700">
            <Filter className="w-4 h-4" />
            <span className="font-medium text-sm">Search & Filters</span>
          </div>
        </div>
        <div className="p-4">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search by ride ID, rider name, driver name, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-11 pl-10 pr-4 text-sm bg-white border-2 border-gray-300 rounded-lg focus:border-gray-900 focus:ring-2 focus:ring-gray-900/20 focus:outline-none transition-colors placeholder:text-gray-400"
            />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Cancelled By
              </label>
              <Select
                value={cancelledByFilter}
                onChange={(e) => setCancelledByFilter(e.target.value)}
              >
                <option value="">All</option>
                <option value="RIDER">Rider</option>
                <option value="DRIVER">Driver</option>
                <option value="SYSTEM">System</option>
              </Select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Reason
              </label>
              <Select
                value={reasonFilter}
                onChange={(e) => setReasonFilter(e.target.value)}
              >
                <option value="">All Reasons</option>
                <option value="RIDER_CANCELLED">Rider Cancelled</option>
                <option value="DRIVER_CANCELLED">Driver Cancelled</option>
                <option value="DRIVER_NOT_FOUND">No Driver</option>
                <option value="WAIT_TIME_TOO_LONG">Wait Too Long</option>
                <option value="CHANGED_PLANS">Changed Plans</option>
                <option value="PRICE_TOO_HIGH">Price Too High</option>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={handleClearFilters}
                className="w-full h-9 gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </Button>
            </div>
            <div className="flex items-end">
              <Button variant="outline" className="w-full h-9 gap-1">
                <Download className="w-3.5 h-3.5" /> Export
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card>
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <XCircle className="w-4 h-4 text-gray-700" />
            <h2 className="font-semibold text-gray-800">
              Cancellation History ({filteredRides.length})
            </h2>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  #
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Ride ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase min-w-[160px]">
                  Rider
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase min-w-[160px]">
                  Driver
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase min-w-[180px]">
                  Route
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Cancelled
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  By
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Reason
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Wait
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedRides.map((ride, idx) => (
                <tr
                  key={ride.id}
                  className={`hover:bg-gray-100/50 transition-colors ${
                    idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                  }`}
                >
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {ride.srNo}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-mono text-gray-900">
                      {ride.id}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                        <User className="w-3.5 h-3.5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {ride.rider.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {ride.rider.phone}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {ride.driver ? (
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                          <Car className="w-3.5 h-3.5 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {ride.driver.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {ride.driver.vehicleNumber}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400 italic">
                        No driver assigned
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                        <span className="text-xs text-gray-600 truncate max-w-[140px]">
                          {ride.pickupAddress}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-800 shrink-0" />
                        <span className="text-xs text-gray-600 truncate max-w-[140px]">
                          {ride.dropAddress}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm text-gray-900">
                        {ride.cancelledAt.toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        {ride.cancelledAt.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <CancelledByBadge cancelledBy={ride.cancelledBy} />
                  </td>
                  <td className="px-4 py-3">
                    <ReasonBadge reason={ride.cancellationReason} />
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-600">
                      {formatDuration(ride.waitTime)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        onClick={() =>
                          setActionMenuOpen(
                            actionMenuOpen === ride.id ? null : ride.id
                          )
                        }
                      >
                        <MoreVertical className="h-4 w-4 text-gray-500" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent isOpen={actionMenuOpen === ride.id}>
                        <DropdownMenuItem
                          onClick={() => openDetailModal(ride)}
                          icon={<Eye className="h-4 w-4 text-gray-500" />}
                        >
                          View Full Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setActionMenuOpen(null)}
                          icon={<Activity className="h-4 w-4 text-gray-500" />}
                        >
                          View Dispatch Log
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setActionMenuOpen(null)}
                          icon={<Download className="h-4 w-4 text-gray-500" />}
                        >
                          Download Report
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRides.length === 0 && (
          <div className="p-8 text-center">
            <XCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No cancelled rides found</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              Showing {(currentPage - 1) * PAGE_SIZE + 1} to{" "}
              {Math.min(currentPage * PAGE_SIZE, filteredRides.length)} of{" "}
              {filteredRides.length}
            </p>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                className="p-2 h-8 w-8"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="p-2 h-8 w-8"
                onClick={() => setCurrentPage((p) => p - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="flex items-center justify-center h-8 px-3 text-sm font-medium bg-gray-900 text-white rounded-lg border border-gray-700">
                {currentPage} / {totalPages}
              </span>
              <Button
                variant="outline"
                className="p-2 h-8 w-8"
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="p-2 h-8 w-8"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Detail Modal */}
      <CancelledRideDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        ride={selectedRide}
      />
    </div>
  );
}
