"use client";
import React, {
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
} from "react";
import {
  MoreVertical,
  ChevronDown,
  X,
  Map,
  DollarSign,
  Download,
  Calendar,
  Clock,
  Car,
  User,
  Phone,
  ArrowLeft,
  Search,
  Filter,
  Users,
  Eye,
} from "lucide-react";

// --- BRAND COLOR & CONSTANTS ---
const BRAND_GREEN = "emerald"; // Tailwind color: emerald-500
const ITEMS_PER_PAGE = 10;

// --- TYPESCRIPT INTERFACES (Data Structure) ---

interface FareSummary {
  netRideFare: number;
  totalBill: number;
}

interface RideDetailsInfo {
  status: string;
  starting: string;
  endedAt: string;
  startTime: string;
  endTime: string;
  timeMinutes: number;
  distanceKm: number;
  coupon: string;
}

interface VehicleInfo {
  number: string;
  makeModel: string;
  vehicleType: string;
}

interface DriverInfo {
  name: string;
  phone: string;
}

interface RiderInfo {
  name: string;
  phone: string;
  isRental: "Yes" | "No";
}

interface TransactionHistory {
  paymentMethod: string;
  paidAmount: number;
  rewardsEarned: number;
  transactionDate: string;
  status: "Completed" | "Pending" | "Failed";
}

interface Ride {
  srNo: number;
  id: string;
  bookingId: string;
  rider: RiderInfo;
  driver: DriverInfo;
  vehicle: VehicleInfo;
  bookedDate: string;
  bookedTime: string;
  tripStatus:
    | "Trip Started"
    | "Trip Completed"
    | "Cancelled by rider"
    | "Cancelled by driver";
  type: "Regular" | "Shared" | "Premium";
  detailData: {
    rideDetails: RideDetailsInfo;
    fareSummary: FareSummary;
    riderInfo: RiderInfo;
    driverInfo: DriverInfo;
    vehicleInfo: VehicleInfo;
  };
  transaction: TransactionHistory;
}

// --- MOCK DATA GENERATION ---

const generateMockRide = (srNo: number): Ride => ({
  srNo: srNo,
  id: `E764B55${srNo + 500}`,
  bookingId: `CH0154887${srNo}`,
  rider: {
    name: srNo % 3 === 0 ? "Jane Doe" : "John Test",
    phone: `66778899${10 + srNo}`,
    isRental: srNo % 4 === 0 ? "Yes" : "No",
  },
  driver: {
    name: `DriverSam ${srNo}`,
    phone: `112233445${srNo}`,
  },
  vehicle: {
    number: `CH0154887${srNo}`,
    makeModel: `Mahindra/XUV${srNo % 3 === 0 ? "300" : "500"}`,
    vehicleType: "Taxi",
  },
  bookedDate: `0${srNo % 12 || 1}/12/2025`,
  bookedTime: srNo % 2 === 0 ? "19:54" : "10:30",
  tripStatus:
    srNo % 4 === 0
      ? "Trip Completed"
      : srNo % 4 === 1
      ? "Trip Started"
      : srNo % 4 === 2
      ? "Cancelled by rider"
      : "Cancelled by driver",
  type: srNo % 5 === 0 ? "Shared" : "Regular",
  detailData: {
    rideDetails: {
      status: srNo % 4 === 0 ? "Trip Completed" : "Trip Started",
      starting: "12 Nieuwhout St, Wilgehof, Bloemfontein, 9301, South Africa",
      endedAt:
        srNo % 4 === 0
          ? "Raymond Mhlaba St, Noordhoek, Bloemfontein, 9301, South Africa"
          : "~NA~",
      startTime: "04/12/2025 19:54",
      endTime: srNo % 4 === 0 ? "04/12/2025 20:15" : "~NA~",
      timeMinutes: srNo % 4 === 0 ? 21 : 0,
      distanceKm:
        srNo % 4 === 0 ? parseFloat((Math.random() * 10).toFixed(2)) : 0.0,
      coupon: srNo % 7 === 0 ? "WELCOME20" : "~NA~",
    },
    fareSummary: {
      netRideFare:
        srNo % 4 === 0
          ? parseFloat((50 + Math.random() * 100).toFixed(2))
          : 0.0,
      totalBill:
        srNo % 4 === 0
          ? parseFloat((50 + Math.random() * 100).toFixed(2))
          : 0.0,
    },
    riderInfo: {
      name: srNo % 3 === 0 ? "Jane Doe" : "John Test",
      phone: `66778899${10 + srNo}`,
      isRental: srNo % 4 === 0 ? "Yes" : "No",
    },
    driverInfo: {
      name: `DriverSam ${srNo}`,
      phone: `112233445${srNo}`,
    },
    vehicleInfo: {
      number: `CH0154887${srNo}`,
      makeModel: `Mahindra/XUV${srNo % 3 === 0 ? "300" : "500"}`,
      vehicleType: "Taxi",
    },
  },
  transaction: {
    paymentMethod: srNo % 3 === 0 ? "Card Ending ****1234" : "Cash",
    paidAmount:
      srNo % 4 === 0 ? parseFloat((50 + Math.random() * 100).toFixed(2)) : 0.0,
    rewardsEarned: srNo % 4 === 0 ? (srNo % 10) * 5 : 0,
    transactionDate: `0${srNo % 12 || 1}/12/2025`,
    status: srNo % 4 === 0 ? "Completed" : "Pending",
  },
});

const mockRides: Ride[] = Array.from({ length: 25 }, (_, i) =>
  generateMockRide(i + 1)
);

// --- UTILITY COMPONENTS ---

/**
 * Custom Dropdown Menu for the Action Column
 */
const ActionMenu: React.FC<{
  ride: Ride;
  onAction: (action: string) => void;
}> = ({ ride, onAction }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const isCompleted = ride.tripStatus === "Trip Completed";

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={menuRef} className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-150"
        aria-expanded={isOpen}
      >
        <MoreVertical className="w-4 h-4 text-gray-700" />
      </button>

      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <div
            className="fixed inset-0 z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown Menu */}
          <div
            className="absolute right-0 z-50 w-45 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150"
            role="menu"
            aria-orientation="vertical"
          >
            <div className="p-1">
              <button
                onClick={() => {
                  setIsOpen(false);
                  onAction("viewDetail");
                }}
                className="flex items-center w-full px-3 py-2.5 text-sm text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
                role="menuitem"
              >
                <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center mr-3">
                  <Eye className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-sm">View Detail</p>
                  {/* <p className="text-xs text-gray-500">See full ride info</p> */}
                </div>
              </button>

              <button
                onClick={() => {
                  setIsOpen(false);
                  onAction("transactionHistory");
                }}
                className="flex items-center w-full px-3 py-2.5 text-sm text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
                role="menuitem"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center mr-3">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-sm">Transaction</p>
                  {/* <p className="text-xs text-gray-500">Payment history</p> */}
                </div>
              </button>

              <div className="h-px bg-gray-100 my-1" />

              <button
                onClick={() => {
                  if (isCompleted) {
                    setIsOpen(false);
                    onAction("invoke");
                  }
                }}
                disabled={!isCompleted}
                className={`flex items-center w-full px-3 py-2.5 text-sm rounded-md transition-colors ${
                  isCompleted
                    ? "text-gray-700 hover:bg-gray-100"
                    : "text-gray-400 cursor-not-allowed opacity-50"
                }`}
                role="menuitem"
                title={
                  !isCompleted ? "Only for completed trips" : "Download CSV"
                }
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                    isCompleted ? "bg-gray-100" : "bg-gray-50"
                  }`}
                >
                  <Download
                    className={`w-4 h-4 ${
                      isCompleted ? "text-gray-600" : "text-gray-400"
                    }`}
                  />
                </div>
                <div className="text-left">
                  <p className="font-medium text-sm">Download</p>
                  <p className="text-xs text-gray-500">
                    {isCompleted ? "Export as CSV" : "Completed only"}
                  </p>
                </div>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

/**
 * Status Badge for the table
 */
const StatusBadge: React.FC<{ status: Ride["tripStatus"] }> = ({ status }) => {
  let colorClass = "bg-gray-500/10 text-gray-600";
  let displayText: string = status;

  if (status === "Trip Completed") {
    colorClass = "bg-emerald-500/15 text-emerald-700";
    displayText = "Completed";
  } else if (status === "Trip Started") {
    colorClass = "bg-blue-500/15 text-blue-700";
    displayText = "In Progress";
  } else if (status === "Cancelled by rider") {
    colorClass = "bg-orange-500/15 text-orange-700";
    displayText = "Cancelled";
  } else if (status === "Cancelled by driver") {
    colorClass = "bg-red-500/15 text-red-700";
    displayText = "Cancelled";
  }

  return (
    <span
      className={`px-2 py-0.5 text-[11px] font-medium rounded ${colorClass}`}
    >
      {displayText}
    </span>
  );
};

// --- MODALS AND DRAWERS ---

/**
 * Ride Details Modal - Compact & Organized UI
 */
const RideDetailsModal: React.FC<{
  ride: Ride | null;
  onClose: () => void;
}> = ({ ride, onClose }) => {
  if (!ride) return null;

  const { detailData } = ride;

  const getStatusInfo = (status: string) => {
    if (status === "Trip Completed")
      return {
        text: "Completed",
        color: "text-emerald-600",
        bg: "bg-emerald-100",
      };
    if (status === "Trip Started")
      return { text: "In Progress", color: "text-blue-600", bg: "bg-blue-100" };
    if (status === "Cancelled by rider")
      return {
        text: "Rider Cancelled",
        color: "text-orange-600",
        bg: "bg-orange-100",
      };
    if (status === "Cancelled by driver")
      return {
        text: "Driver Cancelled",
        color: "text-red-600",
        bg: "bg-red-100",
      };
    return { text: status, color: "text-gray-600", bg: "bg-gray-100" };
  };

  const statusInfo = getStatusInfo(ride.tripStatus);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-3xl max-h-[90vh] bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gray-900 text-white px-5 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <h3 className="text-base font-bold">Ride Details</h3>
            <span className="text-gray-400 font-mono text-sm">#{ride.id}</span>
            <span
              className={`px-2 py-0.5 text-xs font-semibold rounded-full ${statusInfo.bg} ${statusInfo.color}`}
            >
              {statusInfo.text}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/10 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto flex-1">
          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            <div className="text-center py-2 px-3 bg-gray-50 rounded-lg">
              <p className="text-lg font-bold text-gray-900">
                {detailData.rideDetails.distanceKm}
              </p>
              <p className="text-[10px] text-gray-500 uppercase">km</p>
            </div>
            <div className="text-center py-2 px-3 bg-gray-50 rounded-lg">
              <p className="text-lg font-bold text-gray-900">
                {detailData.rideDetails.timeMinutes}
              </p>
              <p className="text-[10px] text-gray-500 uppercase">min</p>
            </div>
            <div className="text-center py-2 px-3 bg-gray-50 rounded-lg">
              <p className="text-lg font-bold text-gray-900">
                ${detailData.fareSummary.totalBill}
              </p>
              <p className="text-[10px] text-gray-500 uppercase">fare</p>
            </div>
            <div className="text-center py-2 px-3 bg-gray-50 rounded-lg">
              <p className="text-lg font-bold text-gray-900">{ride.type}</p>
              <p className="text-[10px] text-gray-500 uppercase">type</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Column */}
            <div className="space-y-3">
              {/* Rider & Driver */}
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10px] font-semibold text-gray-400 uppercase mb-1">
                      Rider
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {detailData.riderInfo.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {detailData.riderInfo.phone}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-gray-400 uppercase mb-1">
                      Driver
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {detailData.driverInfo.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {detailData.driverInfo.phone}
                    </p>
                  </div>
                </div>
              </div>

              {/* Vehicle */}
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-[10px] font-semibold text-gray-400 uppercase mb-1">
                  Vehicle
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {detailData.vehicleInfo.makeModel}
                    </p>
                    <p className="text-xs text-gray-500">
                      {detailData.vehicleInfo.vehicleType}
                    </p>
                  </div>
                  <span className="px-2 py-1 bg-gray-200 rounded text-xs font-mono font-bold text-gray-700">
                    {detailData.vehicleInfo.number}
                  </span>
                </div>
              </div>

              {/* Route */}
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-[10px] font-semibold text-gray-400 uppercase mb-2">
                  Route
                </p>
                <div className="flex gap-2">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <div className="w-0.5 flex-1 bg-gray-300 my-1" />
                    <div className="w-2 h-2 rounded-full bg-gray-800" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div>
                      <p className="text-xs text-gray-900">
                        {detailData.rideDetails.starting}
                      </p>
                      <p className="text-[10px] text-gray-500">
                        {detailData.rideDetails.startTime}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-900">
                        {detailData.rideDetails.endedAt !== "~NA~"
                          ? detailData.rideDetails.endedAt
                          : "In Progress..."}
                      </p>
                      <p className="text-[10px] text-gray-500">
                        {detailData.rideDetails.endTime !== "~NA~"
                          ? detailData.rideDetails.endTime
                          : "—"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking Info */}
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-[10px] font-semibold text-gray-400 uppercase mb-1">
                  Booking Info
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">ID:</span>
                    <span className="font-medium text-gray-900">
                      {ride.bookingId}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Booked:</span>
                    <span className="font-medium text-gray-900">
                      {ride.bookedDate}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-3">
              {/* Real-Time Status */}
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-[10px] font-semibold text-gray-400 uppercase mb-2">
                  Status Timeline
                </p>
                <div className="space-y-2">
                  {[
                    {
                      label: "Booked",
                      value: `${ride.bookedDate} ${ride.bookedTime}`,
                      active: true,
                    },
                    {
                      label: "Driver Assigned",
                      value: detailData.driverInfo.name,
                      active:
                        ride.tripStatus === "Trip Started" ||
                        ride.tripStatus === "Trip Completed" ||
                        ride.tripStatus.startsWith("Cancelled"),
                    },
                    {
                      label: "Pickup",
                      value:
                        ride.tripStatus === "Trip Started" ||
                        ride.tripStatus === "Trip Completed"
                          ? "Picked Up"
                          : "Waiting",
                      active:
                        ride.tripStatus === "Trip Started" ||
                        ride.tripStatus === "Trip Completed",
                    },
                    {
                      label: "En Route",
                      value:
                        ride.tripStatus === "Trip Started"
                          ? "In Transit"
                          : ride.tripStatus === "Trip Completed"
                          ? "Completed"
                          : "—",
                      active:
                        ride.tripStatus === "Trip Started" ||
                        ride.tripStatus === "Trip Completed",
                      pulse: ride.tripStatus === "Trip Started",
                    },
                    {
                      label: "Dropoff",
                      value:
                        ride.tripStatus === "Trip Completed" ? "Arrived" : "—",
                      active: ride.tripStatus === "Trip Completed",
                    },
                  ].map((step, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          step.active
                            ? step.pulse
                              ? "bg-blue-500 animate-pulse"
                              : "bg-emerald-500"
                            : "bg-gray-300"
                        }`}
                      />
                      <span className="text-[10px] font-semibold text-gray-500 uppercase w-24">
                        {step.label}
                      </span>
                      <span className="text-xs text-gray-900 flex-1 truncate">
                        {step.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fare Summary */}
              <div className="bg-gray-900 text-white rounded-lg p-3">
                <p className="text-[10px] font-semibold text-gray-400 uppercase mb-2">
                  Fare Summary
                </p>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Net Ride Fare</span>
                    <span className="font-medium">
                      ${detailData.fareSummary.netRideFare}
                    </span>
                  </div>
                  {detailData.rideDetails.coupon !== "~NA~" && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">
                        Coupon ({detailData.rideDetails.coupon})
                      </span>
                      <span className="font-medium text-emerald-400">
                        -$5.00
                      </span>
                    </div>
                  )}
                  <div className="border-t border-gray-700 pt-1.5 mt-1.5">
                    <div className="flex justify-between">
                      <span className="font-semibold">Total</span>
                      <span className="text-base font-bold">
                        ${detailData.fareSummary.totalBill}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const InfoCard: React.FC<{
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, icon, children }) => (
  <div className="p-5 bg-white border border-gray-200 rounded-lg shadow-md space-y-3">
    <h4 className="flex items-center text-md font-bold mb-4 text-gray-800 border-b pb-2">
      {icon}
      <span className="ml-2">{title}</span>
    </h4>
    {children}
  </div>
);

const DetailRow: React.FC<{
  label: string;
  value: string | number | React.ReactNode;
  icon?: React.ReactNode;
}> = ({ label, value, icon }) => (
  <div className="flex justify-between items-center py-1">
    <div className="text-sm text-gray-500 flex items-center">
      {icon && <span className="w-4 h-4 mr-2 text-emerald-500">{icon}</span>}
      {label}
    </div>
    <div
      className={`text-sm font-medium ${
        typeof value === "string" && value.startsWith("$")
          ? "text-gray-800 font-bold"
          : "text-gray-700"
      }`}
    >
      {value}
    </div>
  </div>
);

/**
 * 3. Transaction History Drawer/Pop-up
 */
const TransactionHistoryDrawer: React.FC<{
  ride: Ride | null;
  onClose: () => void;
}> = ({ ride, onClose }) => {
  if (!ride) return null;

  const { transaction } = ride;

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-2xl flex flex-col">
        {/* Header */}
        <div
          className={`p-5 flex items-center justify-between text-white bg-${BRAND_GREEN}-600`}
        >
          <h2 className="text-xl font-bold flex items-center">
            <DollarSign className="w-6 h-6 mr-2" />
            Transaction History
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white hover:text-emerald-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex-grow overflow-y-auto space-y-6">
          <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-inner">
            <h3 className="mb-3 text-lg font-semibold text-gray-800 border-b pb-2">
              Payment Details
            </h3>
            <DetailRow
              label="Payment Method"
              value={transaction.paymentMethod}
            />
            <DetailRow
              label="Amount Paid"
              value={`$${transaction.paidAmount}`}
            />
            <DetailRow
              label="Transaction Date"
              value={transaction.transactionDate}
            />
            <div className="mt-3 pt-3 border-t">
              <DetailRow
                label="Transaction Status"
                value={
                  <span
                    className={`font-bold ${
                      transaction.status === "Completed"
                        ? "text-green-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {transaction.status}
                  </span>
                }
              />
            </div>
          </div>

          <div className="p-4 border border-green-200 rounded-lg bg-green-50 shadow-inner">
            <h3 className="mb-3 text-lg font-semibold text-green-800 border-b border-green-300 pb-2">
              Rewards Earned
            </h3>
            <p className="text-4xl font-extrabold text-green-600">
              {transaction.rewardsEarned}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Reward Points received for this ride.
            </p>
          </div>

          {/* Additional info block */}
          <div className="text-sm p-4 border rounded-lg border-blue-200 bg-blue-50">
            <p className="font-medium text-blue-700">Note:</p>
            <p className="text-gray-600">
              This history is based on the final, settled transaction record.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN APPLICATION COMPONENT ---

const CustomerRides: React.FC = () => {
  const [rides] = useState<Ride[]>(mockRides);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isTransactionDrawerOpen, setIsTransactionDrawerOpen] = useState(false);
  const [selectedRide, setSelectedRide] = useState<Ride | null>(null);

  // Simple filter states (for UI representation)
  const [filterBookingId, setFilterBookingId] = useState("");
  const [filterDriver, setFilterDriver] = useState("");
  const [filterStatus, setFilterStatus] = useState("Does not matter");

  // --- COMPUTED VALUES FOR PAGINATION ---
  const totalPages = Math.ceil(rides.length / ITEMS_PER_PAGE);
  const paginatedRides = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return rides.slice(start, start + ITEMS_PER_PAGE);
  }, [rides, currentPage]);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // --- ACTION HANDLERS ---

  /**
   * 4. Invoke Handler (Download Receipt/Ticket)
   */
  const handleInvokeDownload = useCallback((ride: Ride) => {
    if (ride.tripStatus !== "Trip Completed") {
      console.error("Download is only available for completed trips.");
      return;
    }

    const detail = ride.detailData;
    const currentDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    // Professional HTML Receipt/Ticket Template with EcoGo Branding
    const receiptHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>EcoGo Ride Receipt - ${ride.bookingId}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #f5f5f5; padding: 20px; }
    .receipt { max-width: 400px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #008236 0%, #006b2d 100%); color: white; padding: 24px; text-align: center; }
    .logo { font-size: 28px; font-weight: bold; margin-bottom: 4px; }
    .logo span { color: #90EE90; }
    .subtitle { font-size: 12px; opacity: 0.9; letter-spacing: 1px; }
    .ticket-id { background: rgba(255,255,255,0.2); padding: 8px 16px; border-radius: 20px; display: inline-block; margin-top: 12px; font-size: 13px; font-weight: 600; }
    .content { padding: 24px; }
    .section { margin-bottom: 20px; }
    .section-title { font-size: 10px; font-weight: 700; color: #008236; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; padding-bottom: 6px; border-bottom: 1px solid #e5e7eb; }
    .route { display: flex; gap: 12px; }
    .route-line { display: flex; flex-direction: column; align-items: center; padding-top: 4px; }
    .dot { width: 10px; height: 10px; border-radius: 50%; }
    .dot-green { background: #008236; }
    .dot-black { background: #1f2937; }
    .line { width: 2px; flex: 1; background: #d1d5db; margin: 4px 0; min-height: 30px; }
    .route-info { flex: 1; }
    .route-point { margin-bottom: 12px; }
    .route-label { font-size: 10px; font-weight: 600; color: #008236; text-transform: uppercase; }
    .route-address { font-size: 13px; color: #374151; margin-top: 2px; }
    .route-time { font-size: 11px; color: #9ca3af; margin-top: 2px; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .info-item { background: #f9fafb; padding: 10px 12px; border-radius: 8px; }
    .info-label { font-size: 10px; color: #9ca3af; text-transform: uppercase; font-weight: 600; }
    .info-value { font-size: 13px; color: #1f2937; font-weight: 500; margin-top: 2px; }
    .fare-box { background: #008236; color: white; border-radius: 10px; padding: 16px; }
    .fare-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; }
    .fare-row.total { border-top: 1px solid rgba(255,255,255,0.3); margin-top: 8px; padding-top: 12px; font-size: 16px; font-weight: 700; }
    .fare-label { color: rgba(255,255,255,0.8); }
    .fare-row.total .fare-label { color: white; }
    .footer { background: #f9fafb; padding: 16px 24px; text-align: center; border-top: 1px solid #e5e7eb; }
    .footer-text { font-size: 11px; color: #6b7280; }
    .footer-text strong { color: #374151; }
    .qr-placeholder { width: 60px; height: 60px; background: #e5e7eb; margin: 0 auto 8px; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 8px; color: #9ca3af; }
    .badge { display: inline-block; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 600; background: #e6f5ec; color: #008236; }
    .discount { color: #90EE90; }
    @media print { body { background: white; padding: 0; } .receipt { box-shadow: none; } }
  </style>
</head>
<body>
  <div class="receipt">
    <div class="header">
      <div class="logo">Eco<span>Go</span></div>
      <div class="subtitle">RIDE RECEIPT</div>
      <div class="ticket-id">${ride.bookingId}</div>
    </div>
    
    <div class="content">
      <div class="section">
        <div class="section-title">Trip Route</div>
        <div class="route">
          <div class="route-line">
            <div class="dot dot-green"></div>
            <div class="line"></div>
            <div class="dot dot-black"></div>
          </div>
          <div class="route-info">
            <div class="route-point">
              <div class="route-label">Pickup</div>
              <div class="route-address">${detail.rideDetails.starting}</div>
              <div class="route-time">${detail.rideDetails.startTime}</div>
            </div>
            <div class="route-point">
              <div class="route-label" style="color: #374151;">Dropoff</div>
              <div class="route-address">${detail.rideDetails.endedAt}</div>
              <div class="route-time">${detail.rideDetails.endTime}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Trip Details</div>
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">Distance</div>
            <div class="info-value">${detail.rideDetails.distanceKm} km</div>
          </div>
          <div class="info-item">
            <div class="info-label">Duration</div>
            <div class="info-value">${detail.rideDetails.timeMinutes} min</div>
          </div>
          <div class="info-item">
            <div class="info-label">Ride Type</div>
            <div class="info-value">${ride.type}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Status</div>
            <div class="info-value"><span class="badge">Completed</span></div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Rider</div>
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">Name</div>
            <div class="info-value">${detail.riderInfo.name}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Phone</div>
            <div class="info-value">${detail.riderInfo.phone}</div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Driver & Vehicle</div>
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">Driver</div>
            <div class="info-value">${detail.driverInfo.name}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Phone</div>
            <div class="info-value">${detail.driverInfo.phone}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Vehicle</div>
            <div class="info-value">${detail.vehicleInfo.makeModel}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Plate</div>
            <div class="info-value">${detail.vehicleInfo.number}</div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Payment Summary</div>
        <div class="fare-box">
          <div class="fare-row">
            <span class="fare-label">Base Fare</span>
            <span>$${detail.fareSummary.netRideFare.toFixed(2)}</span>
          </div>
          ${
            detail.rideDetails.coupon !== "~NA~"
              ? `
          <div class="fare-row">
            <span class="fare-label">Coupon (${detail.rideDetails.coupon})</span>
            <span class="discount">-$5.00</span>
          </div>
          `
              : ""
          }
          <div class="fare-row">
            <span class="fare-label">Payment Method</span>
            <span>${ride.transaction.paymentMethod}</span>
          </div>
          <div class="fare-row total">
            <span class="fare-label">Total Paid</span>
            <span>$${detail.fareSummary.totalBill.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="footer">
      <div class="qr-placeholder">QR</div>
      <div class="footer-text">
        <strong>Thank you for riding with EcoGo!</strong><br>
        Receipt generated on ${currentDate}<br>
        Booking ID: ${ride.bookingId} | Ride ID: ${ride.id}
      </div>
    </div>
  </div>
</body>
</html>`;

    // Create and download the HTML file
    const blob = new Blob([receiptHTML], { type: "text/html;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `EcoGo_Receipt_${ride.bookingId}.html`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    console.log(`Successfully downloaded receipt for ride: ${ride.id}`);
  }, []);

  /**
   * General Action Dispatcher from the table menu
   */
  const handleAction = useCallback(
    (action: string, ride: Ride) => {
      setSelectedRide(ride);
      switch (action) {
        case "viewDetail":
          setIsDetailsModalOpen(true);
          break;
        case "transactionHistory":
          setIsTransactionDrawerOpen(true);
          break;
        case "invoke":
          handleInvokeDownload(ride);
          break;
        default:
          console.warn(`Unknown action: ${action}`);
      }
    },
    [handleInvokeDownload]
  );

  const handleCloseDetail = () => {
    setIsDetailsModalOpen(false);
    setSelectedRide(null);
  };

  const handleCloseTransaction = () => {
    setIsTransactionDrawerOpen(false);
    setSelectedRide(null);
  };

  // --- RENDER FUNCTIONS ---

  const renderPagination = () => (
    <div className="flex items-center justify-between py-3 border-t">
      <div className="text-sm text-gray-700">
        Showing{" "}
        <span className="font-medium">
          {(currentPage - 1) * ITEMS_PER_PAGE + 1}
        </span>{" "}
        to{" "}
        <span className="font-medium">
          {Math.min(currentPage * ITEMS_PER_PAGE, rides.length)}
        </span>{" "}
        of <span className="font-medium">{rides.length}</span> results
      </div>
      <div className="flex space-x-1">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
        >
          Previous
        </button>
        {totalPages > 0 &&
          Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => goToPage(page)}
              className={`px-3 py-1 text-sm font-medium rounded-md ${
                page === currentPage
                  ? `bg-${BRAND_GREEN}-600 text-white`
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              {page}
            </button>
          ))}
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen p-8 bg-gray-50 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header/Breadcrumb */}
        <div className="mb-6 text-sm text-gray-500">
          <span className="font-semibold text-gray-700">Home</span> / Customer
          rides
        </div>

        {/* Main Card */}
        <div className="p-6 bg-white rounded-xl shadow-lg">
          <h1 className="mb-6 text-2xl font-bold text-gray-800 border-b pb-3">
            Customer Ride History
          </h1>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-end gap-4 mb-6 p-4 bg-gray-50 border rounded-lg">
            <Filter className="w-6 h-6 text-gray-500" />
            <div className="flex flex-col flex-1 min-w-[150px]">
              <label className="text-xs font-medium text-gray-600 mb-1">
                Booking ID
              </label>
              <input
                type="text"
                value={filterBookingId}
                onChange={(e) => setFilterBookingId(e.target.value)}
                placeholder="Vehicle registration number"
                className="p-2 border border-gray-300 rounded-md text-sm focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <div className="flex flex-col flex-1 min-w-[150px]">
              <label className="text-xs font-medium text-gray-600 mb-1">
                Driver
              </label>
              <input
                type="text"
                value={filterDriver}
                onChange={(e) => setFilterDriver(e.target.value)}
                placeholder="Driver Name"
                className="p-2 border border-gray-300 rounded-md text-sm focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <div className="flex flex-col flex-1 min-w-[150px]">
              <label className="text-xs font-medium text-gray-600 mb-1">
                Status
              </label>
              <div className="relative">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm appearance-none bg-white focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option>Does not matter</option>
                  <option>Trip Completed</option>
                  <option>Trip Started</option>
                  <option>Cancelled by rider</option>
                  <option>Cancelled by driver</option>
                </select>
                <ChevronDown className="absolute w-4 h-4 text-gray-400 right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
            {/* Additional Date Filters Placeholder */}
            <div className="flex flex-col flex-1 min-w-[150px]">
              <label className="text-xs font-medium text-gray-600 mb-1">
                Booked Date From
              </label>
              <input
                type="date"
                className="p-2 border border-gray-300 rounded-md text-sm focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <div className="flex flex-col flex-1 min-w-[150px]">
              <label className="text-xs font-medium text-gray-600 mb-1">
                Booked Date To
              </label>
              <input
                type="date"
                className="p-2 border border-gray-300 rounded-md text-sm focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <button
              className={`px-4 py-2 text-sm font-semibold text-white bg-${BRAND_GREEN}-600 rounded-lg hover:bg-${BRAND_GREEN}-700 flex items-center`}
            >
              <Search className="w-4 h-4 mr-1" /> Search
            </button>
            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300">
              Clear search
            </button>
          </div>

          {/* List of Rides Table */}
          <h2 className="mb-4 text-lg font-semibold text-gray-800">
            List of ride requests accepted by drivers
          </h2>
          <div className="overflow-x-auto shadow-md rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">
                    Booking ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">
                    Rider
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">
                    Driver
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">
                    Vehicle
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">
                    Pickup Time
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">
                    Dropoff Time
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">
                    Type
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {paginatedRides.map((ride) => (
                  <tr key={ride.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-mono font-bold text-gray-900">
                      {ride.id}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-xs text-gray-900">
                        <span className="font-bold">N:</span> {ride.rider.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        <span className="font-bold text-gray-700">P:</span>{" "}
                        {ride.rider.phone}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-xs text-gray-900">
                        <span className="font-bold">N:</span> {ride.driver.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        <span className="font-bold text-gray-700">P:</span>{" "}
                        {ride.driver.phone}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-xs text-gray-900">
                        <span className="font-bold">N:</span>{" "}
                        {ride.vehicle.makeModel}
                      </p>
                      <p className="text-xs text-gray-500">
                        <span className="font-bold text-gray-700">P:</span>{" "}
                        {ride.vehicle.number}
                      </p>
                    </td>
                    <td className="px-2 py-3">
                      {ride.tripStatus === "Trip Started" ||
                      ride.tripStatus === "Trip Completed" ? (
                        <span className="text-xs text-gray-900 font-medium">
                          {ride.detailData.rideDetails.startTime}
                        </span>
                      ) : ride.tripStatus === "Cancelled by rider" ? (
                        <span className="text-xs text-orange-600/80">
                          No pickup
                        </span>
                      ) : ride.tripStatus === "Cancelled by driver" ? (
                        <span className="text-xs text-red-600/80">
                          No pickup
                        </span>
                      ) : (
                        <span className="text-xs text-amber-600 font-medium">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {ride.tripStatus === "Trip Completed" ? (
                        <span className="text-xs text-gray-900 font-medium">
                          {ride.detailData.rideDetails.endTime}
                        </span>
                      ) : ride.tripStatus === "Trip Started" ? (
                        <span className="text-xs text-blue-600 font-medium">
                          In Transit
                        </span>
                      ) : ride.tripStatus === "Cancelled by rider" ? (
                        <span className="text-xs text-orange-600/80">
                          Rider cancelled
                        </span>
                      ) : ride.tripStatus === "Cancelled by driver" ? (
                        <span className="text-xs text-red-600/80">
                          Driver cancelled
                        </span>
                      ) : (
                        <span className="text-xs text-gray-500">Awaiting</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={ride.tripStatus} />
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-700">
                      {ride.type}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <ActionMenu
                        ride={ride}
                        onAction={(action) => handleAction(action, ride)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {rides.length > ITEMS_PER_PAGE && renderPagination()}
        </div>
      </div>

      {/* Conditional Modals/Drawers */}
      {isDetailsModalOpen && selectedRide && (
        <RideDetailsModal ride={selectedRide} onClose={handleCloseDetail} />
      )}

      {isTransactionDrawerOpen && selectedRide && (
        <TransactionHistoryDrawer
          ride={selectedRide}
          onClose={handleCloseTransaction}
        />
      )}
    </div>
  );
};

export default CustomerRides;
