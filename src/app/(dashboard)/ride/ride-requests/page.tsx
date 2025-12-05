"use client";
import React, { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Truck,
  Home,
  ChevronsRight,
  ChevronRight,
  ChevronLeft,
  ChevronsLeft,
  X,
  Filter,
  RotateCcw,
  MapPin,
  Clock,
  Calendar,
  Phone,
  Mail,
  User,
  Car,
  CreditCard,
  DollarSign,
  Navigation,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Route,
  Wallet,
  Timer,
  Star,
  MessageSquare,
} from "lucide-react";

// --- CONFIGURATION & MOCK UI COMPONENTS ---

const GREEN_BRAND_COLOR = "bg-[#2DB85B] hover:bg-green-700";
const PAGE_SIZE = 10;
const TOTAL_MOCK_RIDES = 35;
const RIDER_MOCK_ID = "rider@example.com";

// Mock UI components
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
    "px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2";
  if (variant === "default") style += ` text-white ${GREEN_BRAND_COLOR}`;
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

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (
  props
) => (
  <input
    className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    {...props}
  />
);

const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = (
  props
) => (
  <select
    className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    {...props}
  />
);

const Badge: React.FC<{
  children: React.ReactNode;
  color: "success" | "danger" | "warning" | "default" | "info";
}> = ({ children, color }) => {
  let style =
    "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold";
  if (color === "success")
    style += " bg-green-100 text-green-800 border-green-300";
  else if (color === "danger")
    style += " bg-red-100 text-red-800 border-red-300";
  else if (color === "warning")
    style += " bg-yellow-100 text-yellow-800 border-yellow-300";
  else if (color === "info")
    style += " bg-blue-100 text-blue-800 border-blue-300";
  else style += " bg-gray-100 text-gray-800 border-gray-300";
  return <div className={style}>{children}</div>;
};

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
    className="h-9 w-9 flex items-center justify-center rounded-lg border border-gray-300 bg-white hover:bg-gray-100 transition-colors"
  >
    {children}
  </button>
);

const DropdownMenuContent: React.FC<{
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}> = ({ children, isOpen }) => {
  if (!isOpen) return null;
  return (
    <div
      className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
      role="menu"
    >
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
    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
    role="menuitem"
  >
    {icon}
    <span className="ml-2">{children}</span>
  </button>
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

const CardContent: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => (
  <div className={`p-6 ${className}`}>{children}</div>
);

// --- DATA STRUCTURES ---

type RideStatus =
  | "PENDING"
  | "ACCEPTED"
  | "ON_RIDE"
  | "COMPLETED"
  | "CANCELLED"
  | "AUTO_CANCELLED";

type RideType =
  | "IMMEDIATE"
  | "SCHEDULED"
  | "SHARED"
  | "PRIORITY"
  | "MULTI_STOP"
  | "PACKAGE"
  | "ACCESSIBLE";

const RIDE_TYPE_LABELS: Record<RideType, string> = {
  IMMEDIATE: "Immediate",
  SCHEDULED: "Scheduled",
  SHARED: "Shared",
  PRIORITY: "Priority",
  MULTI_STOP: "Multi-Stop",
  PACKAGE: "Package",
  ACCESSIBLE: "Accessible",
};

type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";
type PaymentMethod = "CASH" | "CARD" | "WALLET" | "UPI";

const PAYMENT_STATUS_CONFIG: Record<
  PaymentStatus,
  { label: string; bgColor: string; textColor: string; borderColor: string }
> = {
  PENDING: {
    label: "Pending",
    bgColor: "bg-amber-50",
    textColor: "text-amber-700",
    borderColor: "border-amber-200",
  },
  PAID: {
    label: "Paid",
    bgColor: "bg-emerald-50",
    textColor: "text-emerald-700",
    borderColor: "border-emerald-200",
  },
  FAILED: {
    label: "Failed",
    bgColor: "bg-red-50",
    textColor: "text-red-700",
    borderColor: "border-red-200",
  },
  REFUNDED: {
    label: "Refunded",
    bgColor: "bg-purple-50",
    textColor: "text-purple-700",
    borderColor: "border-purple-200",
  },
};

const STATUS_CONFIG: Record<
  RideStatus,
  { label: string; color: string; bgColor: string }
> = {
  PENDING: {
    label: "Pending",
    color: "text-amber-700",
    bgColor: "bg-amber-50",
  },
  ACCEPTED: {
    label: "Accepted",
    color: "text-blue-700",
    bgColor: "bg-blue-50",
  },
  ON_RIDE: {
    label: "On Ride",
    color: "text-indigo-700",
    bgColor: "bg-indigo-50",
  },
  COMPLETED: {
    label: "Completed",
    color: "text-emerald-700",
    bgColor: "bg-emerald-50",
  },
  CANCELLED: {
    label: "Cancelled",
    color: "text-gray-700",
    bgColor: "bg-gray-100",
  },
  AUTO_CANCELLED: {
    label: "Auto Cancelled",
    color: "text-red-700",
    bgColor: "bg-red-50",
  },
};

interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar?: string;
  rating: number;
  totalRides: number;
}

interface Driver {
  id: string;
  name: string;
  phone: string;
  email: string;
  vehicleNumber: string;
  vehicleModel: string;
  rating: number;
}

type Ride = {
  srNo: number;
  id: string;
  customer: Customer;
  driver?: Driver;
  pickupAddress: string;
  pickupCity: string;
  pickupState: string;
  pickupZip: string;
  dropAddress: string;
  dropCity: string;
  requestDate: Date;
  acceptedDate?: Date;
  pickupTime?: Date;
  startRideDate?: Date;
  completedDate?: Date;
  vehicleType: string;
  status: RideStatus;
  rideType: RideType;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  fare: number;
  distance: number;
  duration: number;
  notes: string;
  cancellationReason?: string;
};

type DriverResponse = {
  driverName: string;
  driverId: string;
  action: "ACCEPTED" | "REJECTED" | "CANCELLED";
  time: string;
  reason?: string;
};

const RIDE_TYPES: RideType[] = [
  "IMMEDIATE",
  "SCHEDULED",
  "SHARED",
  "PRIORITY",
  "MULTI_STOP",
  "PACKAGE",
  "ACCESSIBLE",
];

const PAYMENT_STATUSES: PaymentStatus[] = [
  "PENDING",
  "PAID",
  "FAILED",
  "REFUNDED",
];
const PAYMENT_METHODS: PaymentMethod[] = ["CASH", "CARD", "WALLET", "UPI"];
const RIDE_STATUSES: RideStatus[] = [
  "PENDING",
  "ACCEPTED",
  "ON_RIDE",
  "COMPLETED",
  "CANCELLED",
  "AUTO_CANCELLED",
];

// Generate mock data
const mockRides: Ride[] = Array.from({ length: TOTAL_MOCK_RIDES }, (_, i) => {
  const requestDate = new Date();
  requestDate.setDate(requestDate.getDate() - Math.floor(Math.random() * 30));
  const status = RIDE_STATUSES[i % RIDE_STATUSES.length];

  // Calculate dates based on status progression
  const hasDriver =
    status === "ACCEPTED" || status === "ON_RIDE" || status === "COMPLETED";

  // Accepted Date: 1-10 min after request (only if driver accepted)
  const acceptedDate = hasDriver
    ? new Date(
        requestDate.getTime() + Math.floor(Math.random() * 600000) + 60000
      )
    : undefined;

  // Pickup Time: 5-20 min after acceptance (only if accepted or beyond)
  const pickupTime = hasDriver
    ? new Date(
        (acceptedDate?.getTime() || requestDate.getTime()) +
          Math.floor(Math.random() * 900000) +
          300000
      )
    : undefined;

  // Start Ride Date: 1-5 min after pickup (only if on ride or completed)
  const startRideDate =
    status === "ON_RIDE" || status === "COMPLETED"
      ? new Date(
          (pickupTime?.getTime() || requestDate.getTime()) +
            Math.floor(Math.random() * 300000) +
            60000
        )
      : undefined;

  // Completed Date: 15-60 min ride duration (only if completed)
  const completedDate =
    status === "COMPLETED"
      ? new Date(
          (startRideDate?.getTime() || requestDate.getTime()) +
            Math.floor(Math.random() * 2700000) +
            900000
        )
      : undefined;

  return {
    srNo: i + 1,
    id: `RID-${String(10000 + i).slice(1)}`,
    customer: {
      id: `CUS-${1000 + i}`,
      name: [
        "My Rider",
        "John Smith",
        "Sarah Johnson",
        "Michael Brown",
        "Emily Davis",
        "David Wilson",
      ][i % 6],
      phone: `+91 ${9000000000 + Math.floor(Math.random() * 999999999)}`,
      email: `customer${i + 1}@gmail.com`,
      rating: 4 + Math.random(),
      totalRides: Math.floor(Math.random() * 100) + 5,
    },
    driver: hasDriver
      ? {
          id: `DRV-${2000 + i}`,
          name: ["Amit Kumar", "Raj Singh", "Priya Sharma", "Vikram Patel"][
            i % 4
          ],
          phone: `+91 ${8000000000 + Math.floor(Math.random() * 999999999)}`,
          email: `driver${i + 1}@ecogo.com`,
          vehicleNumber: `PB-${10 + (i % 20)}-${
            ["AB", "CD", "EF", "GH"][i % 4]
          }-${1000 + i}`,
          vehicleModel: [
            "Toyota Camry",
            "Honda City",
            "Maruti Swift",
            "Hyundai Creta",
          ][i % 4],
          rating: 4 + Math.random(),
        }
      : undefined,
    pickupAddress: `C-${i + 2}, Sector ${
      60 + (i % 20)
    }, Sahibzada Ajit Singh Nagar`,
    pickupCity: "Punjab",
    pickupState: "Punjab",
    pickupZip: `16006${i % 10}`,
    dropAddress: `${30 + i}, Jan Marg, Sector ${17 + (i % 10)}A`,
    dropCity: "Chandigarh",
    requestDate,
    acceptedDate,
    pickupTime,
    startRideDate,
    completedDate,
    vehicleType: ["Car", "Bike", "Auto", "Premium"][i % 4],
    status,
    rideType: RIDE_TYPES[i % RIDE_TYPES.length],
    paymentStatus:
      status === "COMPLETED"
        ? "PAID"
        : PAYMENT_STATUSES[i % PAYMENT_STATUSES.length],
    paymentMethod: PAYMENT_METHODS[i % PAYMENT_METHODS.length],
    fare: Math.floor(100 + Math.random() * 500),
    distance: Math.floor(5 + Math.random() * 25),
    duration: Math.floor(15 + Math.random() * 45),
    notes: "",
    cancellationReason:
      status === "CANCELLED" || status === "AUTO_CANCELLED"
        ? "Driver not available in the area"
        : undefined,
  };
});

const mockDriverResponses: { [key: string]: DriverResponse[] } =
  mockRides.reduce((acc, ride) => {
    if (ride.status !== "CANCELLED") {
      acc[ride.id] = [
        {
          driverName: "Driver A",
          driverId: "D101",
          action: "REJECTED",
          time: "10:05 AM",
          reason: "Too far",
        },
        {
          driverName: "Driver B",
          driverId: "D102",
          action: "ACCEPTED",
          time: "10:10 AM",
        },
      ];
    } else {
      acc[ride.id] = [
        {
          driverName: "Driver C",
          driverId: "D103",
          action: "REJECTED",
          time: "10:05 AM",
          reason: "Busy",
        },
        {
          driverName: "Driver D",
          driverId: "D104",
          action: "CANCELLED",
          time: "10:15 AM",
          reason: "Vehicle breakdown",
        },
      ];
    }
    return acc;
  }, {} as { [key: string]: DriverResponse[] });

// --- MODAL COMPONENTS ---

// Create Ride Request Full Modal
const CreateRideModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}> = ({ isOpen, onClose, onSave }) => {
  const [step, setStep] = useState<"RIDER_CHECK" | "FORM">("RIDER_CHECK");
  const [riderIdentifier, setRiderIdentifier] = useState("");
  const [isRiderFound, setIsRiderFound] = useState(false);
  const [formData, setFormData] = useState<any>({
    rideType: "IMMEDIATE",
    vehicleType: "Car",
    paymentMethod: "CASH",
  });

  if (!isOpen) return null;

  const handleRiderCheck = () => {
    if (
      riderIdentifier.toLowerCase() === RIDER_MOCK_ID ||
      riderIdentifier.includes("@")
    ) {
      setIsRiderFound(true);
      setStep("FORM");
    } else {
      setIsRiderFound(false);
      alert("Rider not found. Please create a new rider first.");
    }
  };

  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave({ ...formData, riderIdentifier });
    handleClose();
  };

  const handleClose = () => {
    setStep("RIDER_CHECK");
    setRiderIdentifier("");
    setIsRiderFound(false);
    setFormData({
      rideType: "IMMEDIATE",
      vehicleType: "Car",
      paymentMethod: "CASH",
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-4xl transform rounded-2xl bg-white shadow-2xl transition-all">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-t-2xl">
            <div>
              <h3 className="text-xl font-bold text-white">
                Create New Ride Request
              </h3>
            </div>
            <p className="text-emerald-100 text-sm">
              Fill in the details to create a ride request
            </p>

            <button
              onClick={handleClose}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="h-5 w-5 text-white" />
            </button>
          </div>

          <div className="p-6 max-h-[80vh] overflow-y-auto">
            {step === "RIDER_CHECK" ? (
              <div className="space-y-6">
                <div className="text-center py-8">
                  <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                    <User className="w-10 h-10 text-emerald-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    Find Rider
                  </h4>
                  <p className="text-gray-500 text-sm mb-6">
                    Enter rider email or phone number to continue
                  </p>

                  <div className="max-w-md mx-auto space-y-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        placeholder="Enter Rider Email or Phone"
                        value={riderIdentifier}
                        onChange={(e) => setRiderIdentifier(e.target.value)}
                        className="w-full h-12 pl-10 pr-4 text-sm border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                    <Button
                      onClick={handleRiderCheck}
                      disabled={!riderIdentifier}
                      className="w-full h-12"
                    >
                      <Search className="w-4 h-4" /> Search Rider
                    </Button>
                  </div>

                  {!isRiderFound && riderIdentifier && (
                    <div className="mt-4 p-4 bg-red-50 rounded-xl max-w-md mx-auto">
                      <p className="text-red-600 text-sm">
                        Rider not found.{" "}
                        <a href="#" className="underline font-medium">
                          Create new rider
                        </a>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Rider Found Banner */}
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <div>
                    <p className="text-sm font-semibold text-emerald-800">
                      Rider Found
                    </p>
                    <p className="text-xs text-emerald-600">
                      {riderIdentifier}
                    </p>
                  </div>
                </div>

                {/* Customer Information */}
                <div className="bg-gray-50 rounded-xl p-5">
                  <h4 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <User className="w-4 h-4" /> Customer Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Full Name
                      </label>
                      <Input
                        name="customerName"
                        placeholder="Customer Name"
                        onChange={handleFormChange}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Phone Number
                      </label>
                      <Input
                        name="customerPhone"
                        placeholder="+91 9876543210"
                        onChange={handleFormChange}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Email
                      </label>
                      <Input
                        name="customerEmail"
                        placeholder="email@example.com"
                        value={riderIdentifier}
                        readOnly
                      />
                    </div>
                  </div>
                </div>

                {/* Pickup & Drop Location */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-xl p-5">
                    <h4 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-emerald-500" />{" "}
                      Pickup Location
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Address
                        </label>
                        <Input
                          name="pickupAddress"
                          placeholder="Street address"
                          onChange={handleFormChange}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">
                            City
                          </label>
                          <Input
                            name="pickupCity"
                            placeholder="City"
                            onChange={handleFormChange}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">
                            State
                          </label>
                          <Input
                            name="pickupState"
                            placeholder="State"
                            onChange={handleFormChange}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Postal Code
                        </label>
                        <Input
                          name="pickupZip"
                          placeholder="Postal Code"
                          onChange={handleFormChange}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-5">
                    <h4 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500" /> Drop
                      Location
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Address
                        </label>
                        <Input
                          name="dropAddress"
                          placeholder="Street address"
                          onChange={handleFormChange}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">
                            City
                          </label>
                          <Input
                            name="dropCity"
                            placeholder="City"
                            onChange={handleFormChange}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">
                            State
                          </label>
                          <Input
                            name="dropState"
                            placeholder="State"
                            onChange={handleFormChange}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Postal Code
                        </label>
                        <Input
                          name="dropZip"
                          placeholder="Postal Code"
                          onChange={handleFormChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ride Details */}
                <div className="bg-gray-50 rounded-xl p-5">
                  <h4 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Car className="w-4 h-4" /> Ride Details
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Ride Type
                      </label>
                      <Select
                        name="rideType"
                        value={formData.rideType}
                        onChange={handleFormChange}
                      >
                        <option value="IMMEDIATE">Immediate</option>
                        <option value="SCHEDULED">Scheduled</option>
                        <option value="SHARED">Shared</option>
                        <option value="PRIORITY">Priority</option>
                        <option value="MULTI_STOP">Multi-Stop</option>
                        <option value="PACKAGE">Package</option>
                        <option value="ACCESSIBLE">Accessible</option>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Vehicle Type
                      </label>
                      <Select
                        name="vehicleType"
                        value={formData.vehicleType}
                        onChange={handleFormChange}
                      >
                        <option value="Car">Car</option>
                        <option value="Bike">Bike</option>
                        <option value="Auto">Auto</option>
                        <option value="Premium">Premium</option>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Scheduled Date
                      </label>
                      <Input
                        type="date"
                        name="scheduledDate"
                        onChange={handleFormChange}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Scheduled Time
                      </label>
                      <Input
                        type="time"
                        name="scheduledTime"
                        onChange={handleFormChange}
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Details */}
                <div className="bg-gray-50 rounded-xl p-5">
                  <h4 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <CreditCard className="w-4 h-4" /> Payment Details
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Payment Method
                      </label>
                      <Select
                        name="paymentMethod"
                        value={formData.paymentMethod}
                        onChange={handleFormChange}
                      >
                        <option value="CASH">Cash</option>
                        <option value="CARD">Card</option>
                        <option value="WALLET">Wallet</option>
                        <option value="UPI">UPI</option>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Estimated Fare (₹)
                      </label>
                      <Input
                        type="number"
                        name="estimatedFare"
                        placeholder="0.00"
                        onChange={handleFormChange}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Promo Code
                      </label>
                      <Input
                        name="promoCode"
                        placeholder="Enter promo code"
                        onChange={handleFormChange}
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Notes */}
                <div className="bg-gray-50 rounded-xl p-5">
                  <h4 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Additional Information
                  </h4>
                  <textarea
                    name="notes"
                    rows={3}
                    placeholder="Add any special instructions or notes for this ride..."
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    onChange={handleFormChange}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                  <Button variant="outline" onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>
                    <Plus className="w-4 h-4" /> Create Ride Request
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Status Badge Components (defined before ViewDetailModal)
const RideStatusBadge: React.FC<{ status: RideStatus }> = ({ status }) => {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${config.bgColor} ${config.color}`}
    >
      {config.label}
    </span>
  );
};

const PaymentStatusBadge: React.FC<{ status: PaymentStatus }> = ({
  status,
}) => {
  const config = PAYMENT_STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${config.bgColor} ${config.textColor} ${config.borderColor}`}
    >
      {config.label}
    </span>
  );
};

// View Detail Modal - Uber Style Full Information
const ViewDetailModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  ride: Ride;
}> = ({ isOpen, onClose, ride }) => {
  const [activeTab, setActiveTab] = useState<
    "overview" | "timeline" | "payment"
  >("overview");

  if (!isOpen) return null;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDateTime = (date: Date) => {
    return `${formatDate(date)} at ${formatTime(date)}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-6xl transform rounded-2xl bg-white shadow-2xl transition-all max-h-[95vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gray-900 rounded-t-2xl shrink-0">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                <Car className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-bold text-white">
                    Ride Request Details
                  </h3>
                  <RideStatusBadge status={ride.status} />
                </div>
                <p className="text-gray-400 text-sm mt-0.5">
                  Request ID:{" "}
                  <span className="font-mono text-gray-300">{ride.id}</span>
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2.5 rounded-xl hover:bg-white/10 transition-colors"
            >
              <X className="h-5 w-5 text-white" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-100 px-6 shrink-0 bg-gray-50">
            {[
              { id: "overview", label: "Overview", icon: FileText },
              { id: "timeline", label: "Timeline", icon: Clock },
              { id: "payment", label: "Payment", icon: Wallet },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-gray-900 text-gray-900"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto flex-1">
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-4 border border-blue-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
                        <Route className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">
                          {ride.distance} km
                        </p>
                        <p className="text-xs text-gray-500">Total Distance</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-xl p-4 border border-amber-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center">
                        <Timer className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">
                          {ride.duration} min
                        </p>
                        <p className="text-xs text-gray-500">Est. Duration</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-xl p-4 border border-emerald-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">
                          ₹{ride.fare}
                        </p>
                        <p className="text-xs text-gray-500">Total Fare</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl p-4 border border-purple-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center">
                        <Car className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">
                          {ride.vehicleType}
                        </p>
                        <p className="text-xs text-gray-500">Vehicle Type</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Customer Info */}
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="bg-emerald-600 px-5 py-3">
                      <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                        <User className="w-4 h-4" /> Customer Information
                      </h4>
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100">
                        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                          <User className="w-8 h-8 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-lg font-bold text-gray-900">
                            {ride.customer.name}
                          </p>
                          <div className="flex items-center gap-1 text-amber-500">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="text-sm font-medium">
                              {ride.customer.rating.toFixed(1)}
                            </span>
                            <span className="text-xs text-gray-400 ml-1">
                              ({ride.customer.totalRides} rides)
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-lg">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Phone</p>
                            <p className="text-sm font-medium text-gray-900">
                              {ride.customer.phone}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-lg">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Email</p>
                            <p className="text-sm font-medium text-gray-900">
                              {ride.customer.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-lg">
                          <FileText className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Customer ID</p>
                            <p className="text-sm font-medium text-gray-900 font-mono">
                              {ride.customer.id}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Driver Info */}
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="bg-blue-600 px-5 py-3">
                      <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                        <Truck className="w-4 h-4" /> Driver Information
                      </h4>
                    </div>
                    <div className="p-5">
                      {ride.driver ? (
                        <>
                          <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100">
                            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                              <User className="w-8 h-8 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-lg font-bold text-gray-900">
                                {ride.driver.name}
                              </p>
                              <div className="flex items-center gap-1 text-amber-500">
                                <Star className="w-4 h-4 fill-current" />
                                <span className="text-sm font-medium">
                                  {ride.driver.rating.toFixed(1)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-lg">
                              <Phone className="w-4 h-4 text-gray-400" />
                              <div>
                                <p className="text-xs text-gray-500">Phone</p>
                                <p className="text-sm font-medium text-gray-900">
                                  {ride.driver.phone}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-lg">
                              <Car className="w-4 h-4 text-gray-400" />
                              <div>
                                <p className="text-xs text-gray-500">Vehicle</p>
                                <p className="text-sm font-medium text-gray-900">
                                  {ride.driver.vehicleModel}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-lg">
                              <FileText className="w-4 h-4 text-gray-400" />
                              <div>
                                <p className="text-xs text-gray-500">
                                  Vehicle Number
                                </p>
                                <p className="text-sm font-bold text-gray-900 font-mono">
                                  {ride.driver.vehicleNumber}
                                </p>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                          <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-3">
                            <AlertCircle className="w-8 h-8 text-amber-500" />
                          </div>
                          <p className="text-sm font-medium text-gray-700">
                            No Driver Assigned
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Waiting for driver acceptance
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Ride Details */}
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="bg-gray-800 px-5 py-3">
                      <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                        <FileText className="w-4 h-4" /> Ride Details
                      </h4>
                    </div>
                    <div className="p-5 space-y-3">
                      <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-500">
                          Request ID
                        </span>
                        <span className="text-sm font-mono font-bold text-gray-900">
                          {ride.id}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-500">Ride Type</span>
                        <Badge color="info">
                          {RIDE_TYPE_LABELS[ride.rideType]}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-500">
                          Vehicle Type
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {ride.vehicleType}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-500">Status</span>
                        <RideStatusBadge status={ride.status} />
                      </div>
                      <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-500">Payment</span>
                        <PaymentStatusBadge status={ride.paymentStatus} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Route Section */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="bg-gray-100 px-5 py-3 border-b border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-600" /> Route
                      Information
                    </h4>
                  </div>
                  <div className="p-5">
                    <div className="flex gap-4">
                      {/* Route Timeline */}
                      <div className="flex flex-col items-center">
                        <div className="w-4 h-4 rounded-full bg-emerald-500 border-4 border-emerald-100" />
                        <div className="w-0.5 h-16 bg-gray-300 my-1" />
                        <div className="w-4 h-4 rounded-full bg-gray-800 border-4 border-gray-200" />
                      </div>
                      {/* Addresses */}
                      <div className="flex-1 space-y-4">
                        <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-100">
                          <p className="text-xs font-semibold text-emerald-600 uppercase mb-1">
                            Pickup Location
                          </p>
                          <p className="text-sm font-medium text-gray-900">
                            {ride.pickupAddress}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {ride.pickupCity}, {ride.pickupState} -{" "}
                            {ride.pickupZip}
                          </p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <p className="text-xs font-semibold text-gray-600 uppercase mb-1">
                            Drop Location
                          </p>
                          <p className="text-sm font-medium text-gray-900">
                            {ride.dropAddress}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {ride.dropCity}
                          </p>
                        </div>
                      </div>
                      {/* Distance Info */}
                      <div className="w-32 flex flex-col items-center justify-center bg-gray-50 rounded-lg p-4">
                        <Route className="w-6 h-6 text-gray-400 mb-2" />
                        <p className="text-xl font-bold text-gray-900">
                          {ride.distance} km
                        </p>
                        <p className="text-xs text-gray-500">
                          ~ {ride.duration} min
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cancellation Reason if applicable */}
                {ride.cancellationReason && (
                  <div className="bg-gray-100 rounded-xl p-5 border border-gray-200">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center shrink-0">
                        <XCircle className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          Cancellation Reason
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {ride.cancellationReason}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "timeline" && (
              <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="bg-gray-100 px-5 py-3 border-b border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                      <Clock className="w-4 h-4" /> Ride Timeline
                    </h4>
                  </div>
                  <div className="p-6">
                    <div className="relative pl-8">
                      {/* Timeline line */}
                      <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gray-200" />

                      {/* Request Time */}
                      <div className="relative mb-8">
                        <div className="absolute -left-8 top-0 w-6 h-6 rounded-full bg-gray-900 border-4 border-white shadow-sm flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-xs font-semibold text-gray-500 uppercase">
                            Request Created
                          </p>
                          <p className="text-sm font-medium text-gray-900 mt-1">
                            {formatDateTime(ride.requestDate)}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Ride request submitted by customer
                          </p>
                        </div>
                      </div>

                      {/* Accepted Time */}
                      <div className="relative mb-8">
                        <div
                          className={`absolute -left-8 top-0 w-6 h-6 rounded-full border-4 border-white shadow-sm flex items-center justify-center ${
                            ride.acceptedDate ? "bg-blue-500" : "bg-gray-300"
                          }`}
                        >
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                        <div
                          className={`rounded-lg p-4 ${
                            ride.acceptedDate ? "bg-blue-50" : "bg-gray-50"
                          }`}
                        >
                          <p className="text-xs font-semibold text-gray-500 uppercase">
                            Driver Accepted
                          </p>
                          {ride.acceptedDate ? (
                            <>
                              <p className="text-sm font-medium text-gray-900 mt-1">
                                {formatDateTime(ride.acceptedDate)}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                Driver {ride.driver?.name || "N/A"} accepted the
                                ride
                              </p>
                            </>
                          ) : (
                            <p className="text-sm text-gray-400 mt-1">
                              Waiting for driver...
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Pickup Time */}
                      <div className="relative mb-8">
                        <div
                          className={`absolute -left-8 top-0 w-6 h-6 rounded-full border-4 border-white shadow-sm flex items-center justify-center ${
                            ride.pickupTime ? "bg-emerald-500" : "bg-gray-300"
                          }`}
                        >
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                        <div
                          className={`rounded-lg p-4 ${
                            ride.pickupTime ? "bg-emerald-50" : "bg-gray-50"
                          }`}
                        >
                          <p className="text-xs font-semibold text-gray-500 uppercase">
                            Driver Arrived / Pickup
                          </p>
                          {ride.pickupTime ? (
                            <>
                              <p className="text-sm font-medium text-gray-900 mt-1">
                                {formatDateTime(ride.pickupTime)}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                Customer picked up at location
                              </p>
                            </>
                          ) : (
                            <p className="text-sm text-gray-400 mt-1">—</p>
                          )}
                        </div>
                      </div>

                      {/* Ride Started */}
                      <div className="relative mb-8">
                        <div
                          className={`absolute -left-8 top-0 w-6 h-6 rounded-full border-4 border-white shadow-sm flex items-center justify-center ${
                            ride.startRideDate ? "bg-indigo-500" : "bg-gray-300"
                          }`}
                        >
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                        <div
                          className={`rounded-lg p-4 ${
                            ride.startRideDate ? "bg-indigo-50" : "bg-gray-50"
                          }`}
                        >
                          <p className="text-xs font-semibold text-gray-500 uppercase">
                            Ride Started
                          </p>
                          {ride.startRideDate ? (
                            <>
                              <p className="text-sm font-medium text-gray-900 mt-1">
                                {formatDateTime(ride.startRideDate)}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                Journey to destination began
                              </p>
                            </>
                          ) : (
                            <p className="text-sm text-gray-400 mt-1">—</p>
                          )}
                        </div>
                      </div>

                      {/* Completed */}
                      <div className="relative">
                        <div
                          className={`absolute -left-8 top-0 w-6 h-6 rounded-full border-4 border-white shadow-sm flex items-center justify-center ${
                            ride.completedDate
                              ? "bg-emerald-600"
                              : "bg-gray-300"
                          }`}
                        >
                          {ride.completedDate ? (
                            <CheckCircle className="w-3 h-3 text-white" />
                          ) : (
                            <div className="w-2 h-2 bg-white rounded-full" />
                          )}
                        </div>
                        <div
                          className={`rounded-lg p-4 ${
                            ride.completedDate ? "bg-emerald-50" : "bg-gray-50"
                          }`}
                        >
                          <p className="text-xs font-semibold text-gray-500 uppercase">
                            Ride Completed
                          </p>
                          {ride.completedDate ? (
                            <>
                              <p className="text-sm font-medium text-gray-900 mt-1">
                                {formatDateTime(ride.completedDate)}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                Ride completed successfully
                              </p>
                            </>
                          ) : (
                            <p className="text-sm text-gray-400 mt-1">—</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "payment" && (
              <div className="max-w-3xl mx-auto space-y-6">
                {/* Payment Summary */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="bg-emerald-600 px-5 py-4">
                    <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                      <Wallet className="w-5 h-5" /> Payment Summary
                    </h4>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-100">
                      <div>
                        <p className="text-sm text-gray-500">Total Amount</p>
                        <p className="text-4xl font-bold text-gray-900">
                          ₹{ride.fare}
                        </p>
                      </div>
                      <PaymentStatusBadge status={ride.paymentStatus} />
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <CreditCard className="w-5 h-5 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            Payment Method
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-gray-900">
                          {ride.paymentMethod}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            Transaction ID
                          </span>
                        </div>
                        <span className="text-sm font-mono font-semibold text-gray-900">
                          TXN-{ride.id.replace("RID-", "")}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Calendar className="w-5 h-5 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            Payment Date
                          </span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {ride.paymentStatus === "PAID" && ride.completedDate
                            ? formatDate(ride.completedDate)
                            : "—"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Fare Breakdown */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="bg-gray-100 px-5 py-3 border-b border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-800">
                      Fare Breakdown
                    </h4>
                  </div>
                  <div className="p-5 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Base Fare</span>
                      <span className="text-gray-900">
                        ₹{Math.round(ride.fare * 0.4)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">
                        Distance ({ride.distance} km × ₹12/km)
                      </span>
                      <span className="text-gray-900">
                        ₹{Math.round(ride.fare * 0.45)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">
                        Time ({ride.duration} min × ₹2/min)
                      </span>
                      <span className="text-gray-900">
                        ₹{Math.round(ride.fare * 0.1)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Platform Fee</span>
                      <span className="text-gray-900">
                        ₹{Math.round(ride.fare * 0.05)}
                      </span>
                    </div>
                    <div className="border-t border-gray-200 pt-3 mt-3">
                      <div className="flex justify-between text-base font-semibold">
                        <span className="text-gray-900">Total</span>
                        <span className="text-gray-900">₹{ride.fare}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl shrink-0">
            <p className="text-xs text-gray-500">
              Last updated: {formatDateTime(ride.requestDate)}
            </p>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button variant="outline">
                <MessageSquare className="w-4 h-4" /> Contact
              </Button>
              <Button>
                <FileText className="w-4 h-4" /> Download Receipt
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Update Ride Modal
const UpdateRideModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  ride: Ride;
  onSave: (data: Partial<Ride>) => void;
}> = ({ isOpen, onClose, ride, onSave }) => {
  const [formData, setFormData] = useState({
    pickupAddress: ride.pickupAddress,
    pickupCity: ride.pickupCity,
    dropAddress: ride.dropAddress,
    dropCity: ride.dropCity,
    vehicleType: ride.vehicleType,
    rideType: ride.rideType,
    status: ride.status,
    paymentStatus: ride.paymentStatus,
    fare: ride.fare,
    notes: ride.notes,
  });

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "fare" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl transform rounded-2xl bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-900 rounded-t-2xl">
            <div>
              <h3 className="text-lg font-bold text-white">
                Update Ride Request
              </h3>
              <p className="text-gray-400 text-sm">ID: {ride.id}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="h-5 w-5 text-white" />
            </button>
          </div>

          <div className="p-6 max-h-[70vh] overflow-y-auto space-y-5">
            {/* Status Section */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  Ride Status
                </label>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="PENDING">Pending</option>
                  <option value="ACCEPTED">Accepted</option>
                  <option value="ON_RIDE">On Ride</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                  <option value="AUTO_CANCELLED">Auto Cancelled</option>
                </Select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  Payment Status
                </label>
                <Select
                  name="paymentStatus"
                  value={formData.paymentStatus}
                  onChange={handleChange}
                >
                  <option value="PENDING">Pending</option>
                  <option value="PAID">Paid</option>
                  <option value="FAILED">Failed</option>
                  <option value="REFUNDED">Refunded</option>
                </Select>
              </div>
            </div>

            {/* Pickup Location */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500" /> Pickup
                Location
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs text-gray-500 mb-1">
                    Address
                  </label>
                  <Input
                    name="pickupAddress"
                    value={formData.pickupAddress}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    City
                  </label>
                  <Input
                    name="pickupCity"
                    value={formData.pickupCity}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Drop Location */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-800" /> Drop
                Location
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs text-gray-500 mb-1">
                    Address
                  </label>
                  <Input
                    name="dropAddress"
                    value={formData.dropAddress}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    City
                  </label>
                  <Input
                    name="dropCity"
                    value={formData.dropCity}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Ride Details */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  Vehicle Type
                </label>
                <Select
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleChange}
                >
                  <option value="Car">Car</option>
                  <option value="Bike">Bike</option>
                  <option value="Auto">Auto</option>
                  <option value="Premium">Premium</option>
                </Select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  Ride Type
                </label>
                <Select
                  name="rideType"
                  value={formData.rideType}
                  onChange={handleChange}
                >
                  <option value="IMMEDIATE">Immediate</option>
                  <option value="SCHEDULED">Scheduled</option>
                  <option value="SHARED">Shared</option>
                  <option value="PRIORITY">Priority</option>
                </Select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  Fare (₹)
                </label>
                <Input
                  type="number"
                  name="fare"
                  value={formData.fare}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">
                Admin Notes
              </label>
              <textarea
                name="notes"
                rows={3}
                value={formData.notes}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                placeholder="Add any notes..."
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              <CheckCircle className="w-4 h-4" /> Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Driver Response Modal
const DriverResponseModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  rideId: string;
  responses: DriverResponse[];
}> = ({ isOpen, onClose, rideId, responses }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-lg transform rounded-2xl bg-white shadow-2xl transition-all">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Driver Response Log
              </h3>
              <p className="text-gray-500 text-sm">Request: {rideId}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            {responses.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No driver responses yet
              </p>
            ) : (
              <div className="space-y-4">
                {responses.map((res, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl"
                  >
                    <div
                      className={`p-2 rounded-full ${
                        res.action === "ACCEPTED"
                          ? "bg-emerald-100"
                          : res.action === "REJECTED"
                          ? "bg-gray-100"
                          : "bg-amber-100"
                      }`}
                    >
                      <Truck
                        className={`w-5 h-5 ${
                          res.action === "ACCEPTED"
                            ? "text-emerald-600"
                            : res.action === "REJECTED"
                            ? "text-gray-600"
                            : "text-amber-600"
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-gray-900">
                          {res.driverName}
                        </p>
                        <Badge
                          color={
                            res.action === "ACCEPTED"
                              ? "success"
                              : res.action === "REJECTED"
                              ? "default"
                              : "warning"
                          }
                        >
                          {res.action}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500">
                        ID: {res.driverId} • {res.time}
                      </p>
                      {res.reason && (
                        <p className="text-sm text-gray-600 mt-2 italic">
                          &quot;{res.reason}&quot;
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN PAGE COMPONENT ---

const RideRequestAdminPage: React.FC = () => {
  const [rides, setRides] = useState<Ride[]>(mockRides);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>("");
  const [rideTypeFilter, setRideTypeFilter] = useState<string>("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDriverResponseModalOpen, setIsDriverResponseModalOpen] =
    useState(false);
  const [isViewDetailModalOpen, setIsViewDetailModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedRide, setSelectedRide] = useState<Ride | null>(null);
  const [isActionMenuOpen, setIsActionMenuOpen] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Filtering
  const filteredRides = useMemo(() => {
    const lowerCaseTerm = searchTerm.toLowerCase();
    return rides.filter((r) => {
      const matchesKeyword =
        !searchTerm ||
        r.customer.name.toLowerCase().includes(lowerCaseTerm) ||
        r.customer.email.toLowerCase().includes(lowerCaseTerm) ||
        r.customer.phone.includes(searchTerm) ||
        r.id.toLowerCase().includes(lowerCaseTerm) ||
        r.pickupAddress.toLowerCase().includes(lowerCaseTerm) ||
        r.dropAddress.toLowerCase().includes(lowerCaseTerm);

      const matchesStatus = !statusFilter || r.status === statusFilter;
      const matchesPaymentStatus =
        !paymentStatusFilter || r.paymentStatus === paymentStatusFilter;
      const matchesRideType = !rideTypeFilter || r.rideType === rideTypeFilter;

      return (
        matchesKeyword &&
        matchesStatus &&
        matchesPaymentStatus &&
        matchesRideType
      );
    });
  }, [rides, searchTerm, statusFilter, paymentStatusFilter, rideTypeFilter]);

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setPaymentStatusFilter("");
    setRideTypeFilter("");
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredRides.length / PAGE_SIZE);
  const currentRides = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredRides.slice(start, start + PAGE_SIZE);
  }, [filteredRides, currentPage]);

  const handlePageChange = useCallback(
    (page: number) => {
      if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
      }
    },
    [totalPages]
  );

  const handleCreateRide = (data: any) => {
    const newRide: Ride = {
      srNo: rides.length + 1,
      id: `RID-${String(Math.floor(Math.random() * 10000)).padStart(4, "0")}`,
      customer: {
        id: `CUS-${Math.floor(Math.random() * 10000)}`,
        name: data.customerName || "New Customer",
        phone: data.customerPhone || "+91 9876543210",
        email: data.riderIdentifier,
        rating: 5,
        totalRides: 1,
      },
      pickupAddress: data.pickupAddress || "N/A",
      pickupCity: data.pickupCity || "",
      pickupState: data.pickupState || "",
      pickupZip: data.pickupZip || "",
      dropAddress: data.dropAddress || "N/A",
      dropCity: data.dropCity || "",
      requestDate: new Date(),
      acceptedDate: undefined,
      pickupTime: undefined,
      startRideDate: undefined,
      completedDate: undefined,
      vehicleType: data.vehicleType || "Car",
      status: "PENDING",
      rideType: data.rideType || "IMMEDIATE",
      paymentStatus: "PENDING",
      paymentMethod: data.paymentMethod || "CASH",
      fare: parseInt(data.estimatedFare) || 0,
      distance: 0,
      duration: 0,
      notes: data.notes || "",
    };
    setRides((prev) => [newRide, ...prev]);
    setCurrentPage(1);
  };

  const handleDeleteRide = (id: string) => {
    if (window.confirm("Are you sure you want to delete this ride request?")) {
      setRides((prev) =>
        prev.filter((r) => r.id !== id).map((r, i) => ({ ...r, srNo: i + 1 }))
      );
    }
  };

  const openViewDetail = (ride: Ride) => {
    setSelectedRide(ride);
    setIsViewDetailModalOpen(true);
    setIsActionMenuOpen(null);
  };

  const openDriverResponseLog = (ride: Ride) => {
    setSelectedRide(ride);
    setIsDriverResponseModalOpen(true);
    setIsActionMenuOpen(null);
  };

  const openUpdateModal = (ride: Ride) => {
    setSelectedRide(ride);
    setIsUpdateModalOpen(true);
    setIsActionMenuOpen(null);
  };

  const handleUpdateRide = (data: Partial<Ride>) => {
    if (!selectedRide) return;
    setRides((prev) =>
      prev.map((r) => (r.id === selectedRide.id ? { ...r, ...data } : r))
    );
    setSelectedRide(null);
    setIsUpdateModalOpen(false);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      {/* Page Header */}
      <div className="mb-6">
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white px-2 py-2 font-normal rounded-xl shadow-sm">
          <h1 className="text-2xl font-bold">Ride Requests</h1>
        </div>
        <p className="text-black pl-3 text-sm mt-1">
          Manage and monitor all ride requests
        </p>

        <nav className="flex items-center gap-2 mt-2 text-sm">
          <Link
            href="/ride"
            className="text-blacl hover:text-emerald-700 hover:underline font-medium flex items-center gap-1"
          >
            <Home className="w-3.5 h-3.5" /> Home
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-600">Ride Requests</span>
        </nav>
      </div>

      {/* Search & Filters */}
      <Card className="mb-6">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-700">
            <Filter className="w-4 h-4" />
            <span className="font-medium text-sm">Search & Filters</span>
          </div>
        </div>
        <CardContent className="p-4">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search by customer name, email, phone, request ID, or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-11 pl-10 pr-4 text-sm bg-white border-2 border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-colors placeholder:text-gray-400"
            />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Status
              </label>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-9 text-sm"
              >
                <option value="">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="ACCEPTED">Accepted</option>
                <option value="ON_RIDE">On Ride</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="AUTO_CANCELLED">Auto Cancelled</option>
              </Select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Payment
              </label>
              <Select
                value={paymentStatusFilter}
                onChange={(e) => setPaymentStatusFilter(e.target.value)}
                className="h-9 text-sm"
              >
                <option value="">All Payment</option>
                <option value="PENDING">Pending</option>
                <option value="PAID">Paid</option>
                <option value="FAILED">Failed</option>
                <option value="REFUNDED">Refunded</option>
              </Select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Ride Type
              </label>
              <Select
                value={rideTypeFilter}
                onChange={(e) => setRideTypeFilter(e.target.value)}
                className="h-9 text-sm"
              >
                <option value="">All Types</option>
                <option value="IMMEDIATE">Immediate</option>
                <option value="SCHEDULED">Scheduled</option>
                <option value="SHARED">Shared</option>
                <option value="PRIORITY">Priority</option>
                <option value="MULTI_STOP">Multi-Stop</option>
                <option value="PACKAGE">Package</option>
                <option value="ACCESSIBLE">Accessible</option>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={handleClearFilters}
                className="h-9 w-full text-sm gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </Button>
            </div>
            <div className="flex items-end">
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="h-9 w-full text-sm"
              >
                <Plus className="w-4 h-4" /> Create ride request
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">
            Ride requests list
          </h2>
          <span className="text-sm text-gray-500">
            {filteredRides.length} total
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700  w-12">
                  Ride ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700  min-w-[180px]">
                  Customer details
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700  min-w-[200px]">
                  Pickup address
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700  min-w-[200px]">
                  Drop address
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700  w-32">
                  Request Time
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700  w-32">
                  Pickup Time
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700  w-24">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700  w-32">
                  Status
                </th>
                <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 w-20">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentRides.map((ride, index) => (
                <tr
                  key={ride.id}
                  className={`hover:bg-gray-50 transition-colors ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                  }`}
                >
                  <td className="px-4 py-4 text-xs font-medium text-blue-600">
                    {ride.srNo}
                  </td>
                  <td className="px-4 py-4">
                    <div className="space-y-0.5">
                      <p className="text-xs text-gray-900">
                        <span className="font-medium text-gray-500">N:</span>{" "}
                        {ride.customer.name}
                      </p>
                      <p className="text-xs text-gray-600">
                        <span className="font-medium text-gray-500">P:</span>{" "}
                        {ride.customer.phone}
                      </p>
                      <p className="text-xs text-gray-600">
                        <span className="font-medium text-gray-500">E:</span>{" "}
                        {ride.customer.email}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-xs text-gray-900">
                      {ride.pickupAddress}
                    </p>
                    <p className="text-xs text-gray-500">
                      {ride.pickupCity}, {ride.pickupState}
                    </p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-xs text-gray-900">{ride.dropAddress}</p>
                    <p className="text-xs text-gray-500">{ride.dropCity}</p>
                  </td>
                  {/* Request Time */}
                  <td className="px-4 py-4">
                    <p className="text-xs font-medium text-gray-900">
                      {formatDate(ride.requestDate)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatTime(ride.requestDate)}
                    </p>
                  </td>
                  {/* Pickup Time - Only shows when status is ACCEPTED, ON_RIDE, or COMPLETED */}
                  <td className="px-4 py-4">
                    {ride.pickupTime ? (
                      <div>
                        <p className="text-xs font-medium text-emerald-600">
                          {formatDate(ride.pickupTime)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatTime(ride.pickupTime)}
                        </p>
                        {ride.status === "ACCEPTED" && (
                          <span className="inline-flex items-center mt-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-100 text-blue-700">
                            Driver en route
                          </span>
                        )}
                        {ride.status === "ON_RIDE" && (
                          <span className="inline-flex items-center mt-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-indigo-100 text-indigo-700">
                            Picked up
                          </span>
                        )}
                        {ride.status === "COMPLETED" && (
                          <span className="inline-flex items-center mt-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-100 text-emerald-700">
                            Completed
                          </span>
                        )}
                      </div>
                    ) : (
                      <div>
                        <span className="text-xs text-gray-400">—</span>
                        <p className="text-xs text-gray-400 mt-1">
                          {ride.status === "PENDING" && "Awaiting driver"}
                          {(ride.status === "CANCELLED" ||
                            ride.status === "AUTO_CANCELLED") &&
                            "Ride cancelled"}
                        </p>
                      </div>
                    )}
                  </td>
                  {/* Type */}
                  <td className="px-4 py-4">
                    <span className="text-xs text-gray-900">
                      {RIDE_TYPE_LABELS[ride.rideType].split(" ")[0]}
                    </span>
                  </td>
                  {/* Status */}
                  <td className="px-4 py-4">
                    <RideStatusBadge status={ride.status} />
                  </td>
                  <td className="px-4 py-4 text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        onClick={() =>
                          setIsActionMenuOpen(
                            isActionMenuOpen === ride.id ? null : ride.id
                          )
                        }
                      >
                        <MoreVertical className="h-5 w-5 text-gray-900" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        isOpen={isActionMenuOpen === ride.id}
                        onClose={() => setIsActionMenuOpen(null)}
                      >
                        <DropdownMenuItem
                          onClick={() => openViewDetail(ride)}
                          icon={<Eye className="h-4 w-4 text-emerald-600" />}
                        >
                          View Detail
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => openUpdateModal(ride)}
                          icon={<Edit className="h-4 w-4 text-blue-600" />}
                        >
                          Update
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => openDriverResponseLog(ride)}
                          icon={<Truck className="h-4 w-4 text-gray-500" />}
                        >
                          Driver Response
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteRide(ride.id)}
                          icon={<Trash2 className="h-4 w-4 text-red-500" />}
                        >
                          <span className="text-red-600">Delete</span>
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
          <div className="p-8 text-center text-gray-500">
            No ride requests found matching your criteria.
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
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
              >
                <ChevronsLeft className="h-4 w-4 text-black" />
              </Button>
              <Button
                variant="outline"
                className="p-2 h-8 w-8"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="flex items-center justify-center h-8 px-3 text-sm font-medium bg-gray-900 text-white rounded-lg">
                {currentPage} / {totalPages}
              </span>
              <Button
                variant="outline"
                className="p-2 h-8 w-8 text-black"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="p-2 h-8 w-8"
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Modals */}
      <CreateRideModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateRide}
      />

      {isViewDetailModalOpen && selectedRide && (
        <ViewDetailModal
          isOpen={isViewDetailModalOpen}
          onClose={() => setIsViewDetailModalOpen(false)}
          ride={selectedRide}
        />
      )}

      {isDriverResponseModalOpen && selectedRide && (
        <DriverResponseModal
          isOpen={isDriverResponseModalOpen}
          onClose={() => setIsDriverResponseModalOpen(false)}
          rideId={selectedRide.id}
          responses={mockDriverResponses[selectedRide.id] || []}
        />
      )}

      {isUpdateModalOpen && selectedRide && (
        <UpdateRideModal
          isOpen={isUpdateModalOpen}
          onClose={() => {
            setIsUpdateModalOpen(false);
            setSelectedRide(null);
          }}
          ride={selectedRide}
          onSave={handleUpdateRide}
        />
      )}
    </div>
  );
};

export default RideRequestAdminPage;
