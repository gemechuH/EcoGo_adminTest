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
} from "lucide-react";

// --- CONFIGURATION & MOCK UI COMPONENTS ---

const GREEN_BRAND_COLOR = "bg-emerald-600 hover:bg-emerald-700";
const PAGE_SIZE = 10;
const TOTAL_MOCK_RIDES = 25;
const RIDER_MOCK_ID = "rider@example.com"; // Mock existing rider identifier

// Mock UI components (required for a single-file, runnable implementation)
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
    "px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50";
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
  color: "success" | "danger" | "warning" | "default";
}> = ({ children, color }) => {
  let style =
    "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold";
  if (color === "success")
    style += " bg-green-100 text-green-800 border-green-300";
  else if (color === "danger")
    style += " bg-red-100 text-red-800 border-red-300";
  else if (color === "warning")
    style += " bg-yellow-100 text-yellow-800 border-yellow-300";
  else style += " bg-gray-100 text-gray-800 border-gray-300";
  return <div className={style}>{children}</div>;
};

// Basic Dropdown/Popover implementation for action menus
const DropdownMenu: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <div className="relative inline-block text-left">{children}</div>;
const DropdownMenuTrigger: React.FC<{
  children: React.ReactNode;
  onClick: () => void;
}> = ({ children, onClick }) => (
  <Button variant="ghost" className="h-8 w-8 p-0" onClick={onClick}>
    {children}
  </Button>
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

// Full-screen Modal/Dialog implementation
const Dialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  fullScreen?: boolean;
}> = ({ isOpen, onClose, title, children, fullScreen = false }) => {
  if (!isOpen) return null;

  const sizeClass = fullScreen ? "w-full h-full max-w-full" : "max-w-xl";

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div
          className={`relative transform overflow-hidden rounded-xl bg-white text-left shadow-2xl transition-all ${sizeClass} sm:my-8`}
        >
          <div className="flex items-center justify-between p-6 border-b">
            <h3
              className="text-xl font-semibold text-gray-900"
              id="modal-title"
            >
              {title}
            </h3>
            <Button variant="ghost" onClick={onClose} className="p-1 h-8 w-8">
              <X className="h-5 w-5 text-gray-500" />
            </Button>
          </div>
          <div className="p-6 max-h-[80vh] overflow-y-auto">{children}</div>
        </div>
      </div>
    </div>
  );
};

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => (
  <div className={`rounded-xl bg-white shadow-lg ${className}`}>{children}</div>
);

const CardContent: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => (
  <div className={`p-6 ${className}`}>{children}</div>
);

// --- DATA STRUCTURES (TypeScript) ---

type RideStatus = "SCHEDULED" | "CANCELLED" | "COMPLETED" | "ON_RIDE";

type RideType =
  | "IMMEDIATE" // Immediate Ride (On-Demand)
  | "SCHEDULED" // Scheduled Ride (Future Pickup)
  | "SHARED" // Shared Ride / Carpool
  | "PRIORITY" // Priority Ride
  | "MULTI_STOP" // Multi-Stop Ride
  | "PACKAGE" // Package/Delivery Request
  | "ACCESSIBLE"; // Accessible Ride

const RIDE_TYPE_LABELS: Record<RideType, string> = {
  IMMEDIATE: "Immediate (On-Demand)",
  SCHEDULED: "Scheduled (Future)",
  SHARED: "Shared / Carpool",
  PRIORITY: "Priority Ride",
  MULTI_STOP: "Multi-Stop",
  PACKAGE: "Package/Delivery",
  ACCESSIBLE: "Accessible Ride",
};

// Payment Status Types
type PaymentStatus =
  | "PENDING" // Payment Pending - Waiting for card authorization or wallet top-up
  | "PAID" // Paid / Payment Successful - Transaction completed
  | "FAILED" // Payment Failed - Card declined; rider must update method
  | "REFUNDED"; // Refund / Adjustment Issued - Admin or system corrected fare

const PAYMENT_STATUS_CONFIG: Record<
  PaymentStatus,
  { label: string; bgColor: string; textColor: string; borderColor: string }
> = {
  PENDING: {
    label: "Payment Pending",
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
    label: "Payment Failed",
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

const PAYMENT_STATUSES: PaymentStatus[] = [
  "PENDING",
  "PAID",
  "FAILED",
  "REFUNDED",
];

type Ride = {
  srNo: number;
  id: string;
  riderName: string;
  riderId: string;
  pickupAddress: string;
  dropAddress: string;
  pickupTime: string;
  vehicleType: string;
  status: RideStatus;
  isScheduled: boolean;
  notes: string;
  driverId?: string;
  rideType: RideType;
  paymentStatus: PaymentStatus;
  fare: string;
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

const mockRides: Ride[] = Array.from({ length: TOTAL_MOCK_RIDES }, (_, i) => ({
  srNo: i + 1,
  id: `REQ-${1000 + i}`,
  riderName: i % 3 === 0 ? "John Doe" : `Rider ${i + 1}`,
  riderId: i % 3 === 0 ? RIDER_MOCK_ID : `rider${i + 1}@app.com`,
  pickupAddress: `123 Main St, Sector ${(i % 5) + 1}`,
  dropAddress: `456 Commerce Rd, Zone ${(i % 4) + 1}`,
  pickupTime: `04/${(i % 12) + 1}/2025, 1${i % 8}:00 PM`,
  vehicleType: i % 4 === 0 ? "Car" : i % 4 === 1 ? "Bike" : "Auto",
  status:
    i < 5
      ? "SCHEDULED"
      : i < 10
      ? "CANCELLED"
      : i < 15
      ? "COMPLETED"
      : "ON_RIDE",
  isScheduled: i % 2 === 0,
  notes: `Manual ride creation test for Sr. No ${i + 1}.`,
  driverId: i < 15 ? `DRV-${i + 1}` : undefined,
  rideType: RIDE_TYPES[i % RIDE_TYPES.length],
  paymentStatus: PAYMENT_STATUSES[i % PAYMENT_STATUSES.length],
  fare: `$${(10 + (i % 20) * 2.5).toFixed(2)}`,
}));

const mockDriverResponses: { [key: string]: DriverResponse[] } =
  mockRides.reduce((acc, ride) => {
    if (ride.status !== "CANCELLED") {
      acc[ride.id] = [
        {
          driverName: "Alice",
          driverId: "D101",
          action: "REJECTED",
          time: "1:05 PM",
          reason: "Too far",
        },
        {
          driverName: "Bob",
          driverId: "D102",
          action: "ACCEPTED",
          time: "1:10 PM",
        },
      ];
    } else {
      acc[ride.id] = [
        {
          driverName: "Charlie",
          driverId: "D103",
          action: "REJECTED",
          time: "1:05 PM",
        },
        {
          driverName: "Bob",
          driverId: "D102",
          action: "ACCEPTED",
          time: "1:10 PM",
        },
        {
          driverName: "Bob",
          driverId: "D102",
          action: "CANCELLED",
          time: "1:15 PM",
          reason: "Unexpected flat tire",
        },
      ];
    }
    return acc;
  }, {} as { [key: string]: DriverResponse[] });

// --- MODAL COMPONENTS ---

// 1. Create Ride Modal (Rider Check & Form)
const CreateRideModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}> = ({ isOpen, onClose, onSave }) => {
  const [step, setStep] = useState<"RIDER_CHECK" | "FORM">("RIDER_CHECK");
  const [riderIdentifier, setRiderIdentifier] = useState("");
  const [isRiderFound, setIsRiderFound] = useState(false);
  const [formData, setFormData] = useState<any>({}); // Basic state for ride form

  const handleRiderCheck = () => {
    if (riderIdentifier.toLowerCase() === RIDER_MOCK_ID) {
      setIsRiderFound(true);
      setStep("FORM");
    } else {
      setIsRiderFound(false);
      // Simulate redirect/prompt for creation
      console.log("Rider not found. Redirecting to Create Rider Page...");
      alert("Rider not found. (Simulated redirect to /create-rider)"); // Replaced window.confirm/alert
    }
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave({ ...formData, riderIdentifier });
    setStep("RIDER_CHECK"); // Reset for next open
  };

  const handleClose = () => {
    setStep("RIDER_CHECK"); // Reset step when closing
    setRiderIdentifier("");
    setIsRiderFound(false);
    setFormData({});
    onClose();
  };

  return (
    <Dialog isOpen={isOpen} onClose={handleClose} title="Create Ride Request">
      {step === "RIDER_CHECK" ? (
        <div className="space-y-4">
          <p className="text-sm font-medium">Rider Information Check</p>
          <div className="flex space-x-2">
            <Input
              placeholder="Enter Rider Email or Phone"
              value={riderIdentifier}
              onChange={(e) => setRiderIdentifier(e.target.value)}
              className="flex-grow"
            />
            <Button
              onClick={handleRiderCheck}
              disabled={!riderIdentifier}
              className={GREEN_BRAND_COLOR}
            >
              Check
            </Button>
          </div>
          {!isRiderFound && riderIdentifier && (
            <div className="text-sm text-red-500 flex items-center">
              Rider not found.{" "}
              <a
                href="#"
                onClick={() => alert("Redirecting to create rider page.")}
                className="underline ml-1 text-emerald-600"
              >
                Click to create rider.
              </a>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
            <p className="text-sm font-semibold text-emerald-800">
              Rider Found: {riderIdentifier}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Pickup Address
              </label>
              <Input
                name="pickupAddress"
                onChange={handleFormChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Drop Address
              </label>
              <Input name="dropAddress" onChange={handleFormChange} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Pickup Date/Time
              </label>
              <Input
                type="datetime-local"
                name="pickupTime"
                onChange={handleFormChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Vehicle Type
              </label>
              <Select name="vehicleType" onChange={handleFormChange} required>
                <option value="">Select</option>
                <option value="Car">Car</option>
                <option value="Bike">Bike</option>
                <option value="Auto">Auto</option>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Ride Type
              </label>
              <Select name="rideType" onChange={handleFormChange} required>
                <option value="">Select Ride Type</option>
                <option value="IMMEDIATE">Immediate (On-Demand)</option>
                <option value="SCHEDULED">Scheduled (Future)</option>
                <option value="SHARED">Shared / Carpool</option>
                <option value="PRIORITY">Priority Ride</option>
                <option value="MULTI_STOP">Multi-Stop</option>
                <option value="PACKAGE">Package/Delivery</option>
                <option value="ACCESSIBLE">Accessible Ride</option>
              </Select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Admin Notes (Internal)
              </label>
              <textarea
                name="notes"
                rows={3}
                className="w-full rounded-lg border border-gray-300 p-3"
                onChange={(e) =>
                  setFormData((p: any) => ({ ...p, notes: e.target.value }))
                }
              />
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <Button onClick={handleSave} className={GREEN_BRAND_COLOR}>
              Submit Ride Request
            </Button>
          </div>
        </div>
      )}
    </Dialog>
  );
};

// 2. Driver Response Log Modal
const DriverResponseModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  rideId: string;
  responses: DriverResponse[];
}> = ({ isOpen, onClose, rideId, responses }) => {
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={`Driver Response Log for ${rideId}`}
    >
      <div className="space-y-4">
        {responses.length === 0 ? (
          <p className="text-gray-500">
            No driver responses recorded for this request yet.
          </p>
        ) : (
          responses.map((res, index) => (
            <div
              key={index}
              className="flex items-start p-4 border rounded-lg hover:shadow-sm transition-shadow"
            >
              <Truck className="w-5 h-5 mt-1 text-gray-500 flex-shrink-0" />
              <div className="ml-4 flex-grow">
                <div className="flex justify-between items-center">
                  <p className="font-semibold">
                    {res.driverName} (ID: {res.driverId})
                  </p>
                  <Badge
                    color={
                      res.action === "ACCEPTED"
                        ? "success"
                        : res.action === "REJECTED"
                        ? "danger"
                        : "warning"
                    }
                  >
                    {res.action}
                  </Badge>
                </div>
                <p className="text-xs text-gray-500 mt-1">Time: {res.time}</p>
                {res.reason && (
                  <p className="text-sm mt-1 italic text-gray-600">
                    Reason: {res.reason}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </Dialog>
  );
};

// 3. View Detail Modal (Full Screen)
const ViewDetailModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  ride: Ride;
}> = ({ isOpen, onClose, ride }) => {
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={`Ride Details: ${ride.id}`}
      
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
        {/* Column 1: Core Info */}
        <div className="lg:col-span-1 space-y-6">
          <h4 className="text-lg font-bold border-b pb-2 text-emerald-700">
            Core Ride Information
          </h4>
          <DetailItem label="Request ID" value={ride.id} />
          <DetailItem label="Rider Name" value={ride.riderName} />
          <DetailItem label="Rider ID" value={ride.riderId} />
          <DetailItem label="Pickup Time" value={ride.pickupTime} />
          <DetailItem label="Vehicle Type" value={ride.vehicleType} />
          <DetailItem
            label="Ride Type"
            value={
              <span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-medium">
                {RIDE_TYPE_LABELS[ride.rideType]}
              </span>
            }
          />
          <DetailItem
            label="Driver Assigned"
            value={ride.driverId || "Pending"}
          />
        </div>

        {/* Column 2: Location & Status */}
        <div className="lg:col-span-1 space-y-6">
          <h4 className="text-lg font-bold border-b pb-2 text-emerald-700">
            Route & Scheduling
          </h4>
          <DetailItem
            label="Pickup Location"
            value={ride.pickupAddress}
            icon={<Home className="w-4 h-4 text-black" />}
          />
          <DetailItem
            label="Drop Location"
            value={ride.dropAddress}
            icon={<Home className="w-4 h-4 text-black" />}
          />
          <DetailItem
            label="Is Scheduled"
            value={ride.isScheduled ? "Yes" : "No"}
          />
          <DetailItem
            label="Current Status"
            value={<RideStatusBadge status={ride.status} />}
          />
        </div>

        {/* Column 3: Payment & Extra Details */}
        <div className="lg:col-span-1 space-y-6">
          <h4 className="text-lg font-bold border-b pb-2 text-emerald-700">
            Payment & Billing
          </h4>
          <DetailItem
            label="Payment Status"
            value={<PaymentStatusBadge status={ride.paymentStatus} />}
          />
          <DetailItem label="Fare Amount" value={ride.fare} />
          <DetailItem label="Distance (Km)" value="12.4 Km (Mock Data)" />
          <DetailItem label="Admin Notes" value={ride.notes} isLongText />
        </div>
      </div>
    </Dialog>
  );
};

const DetailItem: React.FC<{
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
  isLongText?: boolean;
}> = ({ label, value, icon, isLongText }) => (
  <div className="bg-gray-50 p-3 rounded-lg border">
    <div className="flex items-center text-xs font-medium text-gray-500 mb-1">
      {icon}
      <span className={icon ? "ml-1" : ""}>{label}</span>
    </div>
    {isLongText ? (
      <p className="text-sm text-gray-800 whitespace-pre-wrap">{value}</p>
    ) : (
      <p className="text-sm font-semibold text-gray-800">{value}</p>
    )}
  </div>
);

// Helper function to render status badge
const RideStatusBadge: React.FC<{ status: RideStatus }> = ({ status }) => {
  let color: "success" | "danger" | "warning" | "default";
  let text: string;

  switch (status) {
    case "SCHEDULED":
      color = "warning";
      text = "SCHEDULED";
      break;
    case "CANCELLED":
      color = "danger";
      text = "CANCELLED";
      break;
    case "COMPLETED":
      color = "success";
      text = "COMPLETED";
      break;
    case "ON_RIDE":
      color = "default";
      text = "ON RIDE";
      break;
    default:
      color = "default";
      text = "PENDING";
  }
  return <Badge color={color}>{text}</Badge>;
};

// Payment Status Badge Component
const PaymentStatusBadge: React.FC<{ status: PaymentStatus }> = ({
  status,
}) => {
  const config = PAYMENT_STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${config.bgColor} ${config.textColor} ${config.borderColor}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
          status === "PAID"
            ? "bg-emerald-500"
            : status === "PENDING"
            ? "bg-amber-500"
            : status === "FAILED"
            ? "bg-red-500"
            : "bg-purple-500"
        }`}
      />
      {config.label}
    </span>
  );
};

// --- MAIN PAGE COMPONENT ---

const RideRequestAdminPage: React.FC = () => {
  const [rides, setRides] = useState<Ride[]>(mockRides);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [rideTypeFilter, setRideTypeFilter] = useState<string>("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDriverResponseModalOpen, setIsDriverResponseModalOpen] =
    useState(false);
  const [isViewDetailModalOpen, setIsViewDetailModalOpen] = useState(false);
  const [selectedRide, setSelectedRide] = useState<Ride | null>(null);
  const [isActionMenuOpen, setIsActionMenuOpen] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditMode, setIsEditMode] = useState(false);

  // --- Filtering & Pagination Logic ---
  const filteredRides = useMemo(() => {
    const lowerCaseTerm = searchTerm.toLowerCase();
    return rides.filter((r) => {
      // Keyword search
      const matchesKeyword =
        !searchTerm ||
        r.riderName.toLowerCase().includes(lowerCaseTerm) ||
        r.id.toLowerCase().includes(lowerCaseTerm) ||
        r.riderId.toLowerCase().includes(lowerCaseTerm) ||
        r.pickupAddress.toLowerCase().includes(lowerCaseTerm) ||
        r.dropAddress.toLowerCase().includes(lowerCaseTerm);

      // Status filter
      const matchesStatus = !statusFilter || r.status === statusFilter;

      // Date filter (matches the date part of pickupTime)
      const matchesDate =
        !dateFilter ||
        r.pickupTime.includes(dateFilter.split("-").slice(1).join("/"));

      // Type filter (Scheduled/Regular)
      const matchesType =
        !typeFilter ||
        (typeFilter === "Scheduled" && r.isScheduled) ||
        (typeFilter === "Regular" && !r.isScheduled);

      // Ride Type filter
      const matchesRideType = !rideTypeFilter || r.rideType === rideTypeFilter;

      // Payment Status filter
      const matchesPaymentStatus =
        !paymentStatusFilter || r.paymentStatus === paymentStatusFilter;

      return (
        matchesKeyword &&
        matchesStatus &&
        matchesDate &&
        matchesType &&
        matchesRideType &&
        matchesPaymentStatus
      );
    });
  }, [
    rides,
    searchTerm,
    statusFilter,
    dateFilter,
    typeFilter,
    rideTypeFilter,
    paymentStatusFilter,
  ]);

  // Clear all filters
  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setDateFilter("");
    setTypeFilter("");
    setRideTypeFilter("");
    setPaymentStatusFilter("");
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

  // --- Action Handlers ---

  const handleCreateRide = (data: any) => {
    const newRide: Ride = {
      srNo: rides.length + 1,
      id: `REQ-${Math.floor(Math.random() * 10000)}`,
      riderName: "Admin Created", // Simplified rider name for new mock
      riderId: data.riderIdentifier,
      pickupAddress: data.pickupAddress || "N/A",
      dropAddress: data.dropAddress || "N/A",
      pickupTime: data.pickupTime
        ? new Date(data.pickupTime).toLocaleString()
        : "N/A",
      vehicleType: data.vehicleType || "N/A",
      status: "SCHEDULED",
      isScheduled: true,
      notes: data.notes || "",
      rideType: (data.rideType as RideType) || "IMMEDIATE",
      paymentStatus: "PENDING",
      fare: "$0.00",
    };
    setRides((prev) => [newRide, ...prev]);
    setIsCreateModalOpen(false);
    // Move to page 1 to see the new request
    setCurrentPage(1);
  };

  const handleUpdateRide = (updatedData: Partial<Ride>) => {
    setRides((prev) =>
      prev.map((r) =>
        r.id === selectedRide?.id ? { ...r, ...updatedData } : r
      )
    );
    setSelectedRide(null);
    setIsEditMode(false);
    setIsCreateModalOpen(false); // Close modal after update
  };

  const handleDeleteRide = (id: string) => {
    if (window.confirm("Are you sure you want to delete this ride request?")) {
      setRides((prev) =>
        prev.filter((r) => r.id !== id).map((r, i) => ({ ...r, srNo: i + 1 }))
      );
    }
  };

  const openDriverResponseLog = (ride: Ride) => {
    setSelectedRide(ride);
    setIsDriverResponseModalOpen(true);
    setIsActionMenuOpen(null);
  };

  const openViewDetail = (ride: Ride) => {
    setSelectedRide(ride);
    setIsViewDetailModalOpen(true);
    setIsActionMenuOpen(null);
  };

  const openEditModal = (ride: Ride) => {
    setSelectedRide(ride);
    setIsEditMode(true);
    setIsCreateModalOpen(true);
    setIsActionMenuOpen(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      {/* Page Header */}
      <div className="mb-6">
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white px-4 py-3 rounded-lg shadow-sm">
          <h1 className="text-xl font-semibold">Ride Requests</h1>
        </div>
        <nav className="flex items-center gap-2 mt-2 text-sm">
          <Link
            href="/ride"
            className="text-black hover:text-emerald-700 hover:underline font-medium flex items-center gap-1"
          >
            <Home className="w-3.5 h-3.5" />
            Home
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-600">Ride Requests</span>
        </nav>
      </div>

      {/* Search & Filters Card */}
      <Card className="mb-6">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-2 text-gray-700">
            <Filter className="w-4 h-4" />
            <span className="font-medium text-sm">Search & Filters</span>
          </div>
        </div>
        <CardContent className="p-4">
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search by rider name, email, request ID, or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-11 pl-10 pr-4 text-sm bg-white border-2 border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-colors placeholder:text-gray-400"
            />
          </div>

          {/* Filter Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Ride Status
              </label>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-9 text-sm"
              >
                <option value="">All</option>
                <option value="SCHEDULED">Scheduled</option>
                <option value="ON_RIDE">On Ride</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
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
                <option value="">All</option>
                <option value="PENDING">Pending</option>
                <option value="PAID">Paid</option>
                <option value="FAILED">Failed</option>
                <option value="REFUNDED">Refunded</option>
              </Select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Date
              </label>
              <Input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="h-9 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Booking
              </label>
              <Select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="h-9 text-sm"
              >
                <option value="">All</option>
                <option value="Regular">Regular</option>
                <option value="Scheduled">Scheduled</option>
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
                <option value="">All</option>
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
                className="h-9 w-full flex items-center justify-center text-sm gap-1 p-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ride List Card */}
      <Card>
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">
            Ride requests list ({filteredRides.length})
          </h2>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-16">
                  #
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[180px]">
                  Rider
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[200px]">
                  Route
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-28">
                  Time
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-32">
                  Ride Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-28">
                  Ride Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-36">
                  Payment
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-20">
                  Fare
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider w-20">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {currentRides.map((ride, index) => (
                <tr
                  key={ride.id}
                  className={`hover:bg-emerald-50/50 transition-colors ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                  }`}
                >
                  {/* Sr No */}
                  <td className="px-4 py-3 text-sm font-medium text-gray-500">
                    {ride.srNo}
                  </td>

                  {/* Rider Details */}
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-900">
                        {ride.riderName}
                      </span>
                      <span className="text-xs text-gray-500 mt-0.5">
                        {ride.riderId}
                      </span>
                      <span className="text-xs text-gray-400 mt-0.5">
                        {ride.isScheduled ? "📅 Scheduled" : "⚡ Regular"}
                      </span>
                    </div>
                  </td>

                  {/* Route */}
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-start gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                        <span className="text-xs text-gray-600 line-clamp-1">
                          {ride.pickupAddress}
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0" />
                        <span className="text-xs text-gray-600 line-clamp-1">
                          {ride.dropAddress}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Time */}
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900">
                        {ride.pickupTime.split(",")[0]}
                      </span>
                      <span className="text-xs text-gray-500">
                        {ride.pickupTime.split(",")[1]}
                      </span>
                    </div>
                  </td>

                  {/* Ride Type */}
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-medium border border-blue-100">
                      {RIDE_TYPE_LABELS[ride.rideType]}
                    </span>
                  </td>

                  {/* Ride Status */}
                  <td className="px-4 py-3">
                    <RideStatusBadge status={ride.status} />
                  </td>

                  {/* Payment Status */}
                  <td className="px-4 py-3">
                    <PaymentStatusBadge status={ride.paymentStatus} />
                  </td>

                  {/* Fare */}
                  <td className="px-4 py-3">
                    <span className="text-sm font-semibold text-gray-900">
                      {ride.fare}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="px-4 py-3 text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        onClick={() =>
                          setIsActionMenuOpen(
                            isActionMenuOpen === ride.id ? null : ride.id
                          )
                        }
                      >
                        <MoreVertical className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        isOpen={isActionMenuOpen === ride.id}
                        onClose={() => setIsActionMenuOpen(null)}
                      >
                        <DropdownMenuItem
                          onClick={() => openDriverResponseLog(ride)}
                          icon={<Truck className="h-4 w-4" />}
                        >
                          Driver Response
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => openViewDetail(ride)}
                          icon={<Eye className="h-4 w-4" />}
                        >
                          View Detail
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => openEditModal(ride)}
                          icon={<Edit className="h-4 w-4" />}
                        >
                          Update
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteRide(ride.id)}
                          icon={<Trash2 className="h-4 w-4 text-red-600" />}
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
          <div className="p-6 text-center text-gray-500">
            No ride requests found matching your criteria.
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t">
            <div className="text-sm text-gray-600">
              Showing {(currentPage - 1) * PAGE_SIZE + 1} to{" "}
              {Math.min(currentPage * PAGE_SIZE, filteredRides.length)} of{" "}
              {filteredRides.length} requests
            </div>
            <div className="flex space-x-1">
              <Button
                variant="outline"
                className="p-2 h-8 w-8"
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="p-2 h-8 w-8"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="flex items-center justify-center h-8 w-12 text-sm font-medium border rounded-lg bg-emerald-50 text-emerald-800">
                {currentPage}
              </span>
              <Button
                variant="outline"
                className="p-2 h-8 w-8"
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
        isOpen={isCreateModalOpen && !isEditMode}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateRide}
      />

      {/* Driver Response Log Modal */}
      {isDriverResponseModalOpen && selectedRide && (
        <DriverResponseModal
          isOpen={isDriverResponseModalOpen}
          onClose={() => setIsDriverResponseModalOpen(false)}
          rideId={selectedRide.id}
          responses={mockDriverResponses[selectedRide.id] || []}
        />
      )}

      {/* Full Detail View Modal */}
      {isViewDetailModalOpen && selectedRide && (
        <ViewDetailModal
          isOpen={isViewDetailModalOpen}
          onClose={() => setIsViewDetailModalOpen(false)}
          ride={selectedRide}
        />
      )}

      {/* Edit/Update Modal (Reuses CreateRideModal structure for simplicity) */}
      {isCreateModalOpen && isEditMode && selectedRide && (
        <Dialog
          isOpen={isCreateModalOpen && isEditMode}
          onClose={() => setIsCreateModalOpen(false)}
          title={`Update Ride Request: ${selectedRide.id}`}
        >
          <div className="space-y-6">
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm font-semibold text-blue-800">
                Updating Rider: {selectedRide.riderId}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Pickup Address
                </label>
                <Input
                  name="pickupAddress"
                  defaultValue={selectedRide.pickupAddress}
                  onChange={(e) =>
                    setSelectedRide((p) =>
                      p ? { ...p, pickupAddress: e.target.value } : null
                    )
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Drop Address
                </label>
                <Input
                  name="dropAddress"
                  defaultValue={selectedRide.dropAddress}
                  onChange={(e) =>
                    setSelectedRide((p) =>
                      p ? { ...p, dropAddress: e.target.value } : null
                    )
                  }
                  required
                />
              </div>
              {/* ... other fields ... */}
            </div>
            <div className="flex justify-end pt-4">
              <Button
                onClick={() => handleUpdateRide(selectedRide)}
                className={GREEN_BRAND_COLOR}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
};

export default RideRequestAdminPage;
