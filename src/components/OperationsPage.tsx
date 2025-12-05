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
  DollarSign,
  Clock,
  MapPin,
  CreditCard,
  Wallet,
  CheckCircle,
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
  Receipt,
} from "lucide-react";

// --- CONFIGURATION ---
const GREEN_BRAND_COLOR = "bg-emerald-600 hover:bg-emerald-700";
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
  onClose: () => void;
}> = ({ children, isOpen }) => {
  if (!isOpen) return null;
  return (
    <div className="absolute right-0 z-20 mt-1 w-48 rounded-lg bg-white shadow-lg border border-gray-200">
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

  const sizeClasses = {
    md: "max-w-md",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

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
type PaymentMethod = "CARD" | "CASH" | "WALLET" | "UPI";
type PaymentStatus = "PAID" | "REFUNDED";

interface Driver {
  id: string;
  name: string;
  phone: string;
  email: string;
  rating: number;
  totalRides: number;
  vehicleNumber: string;
  vehicleModel: string;
  photo: string;
}

interface Rider {
  id: string;
  name: string;
  phone: string;
  email: string;
  rating: number;
  totalRides: number;
  photo: string;
}

interface CompletedRide {
  id: string;
  srNo: number;
  rider: Rider;
  driver: Driver;
  pickupAddress: string;
  dropAddress: string;
  pickupTime: string;
  dropTime: string;
  completedAt: Date;
  distance: number;
  duration: number;
  baseFare: number;
  taxes: number;
  tip: number;
  totalFare: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  transactionId: string;
  rideType: string;
  vehicleType: string;
  rating: number;
  feedback?: string;
}

// --- MOCK DATA ---
const MOCK_DRIVERS: Driver[] = [
  {
    id: "DRV001",
    name: "Michael Johnson",
    phone: "+1 555-0101",
    email: "michael.j@driver.com",
    rating: 4.9,
    totalRides: 1250,
    vehicleNumber: "ABC-1234",
    vehicleModel: "Toyota Camry 2022",
    photo: "",
  },
  {
    id: "DRV002",
    name: "Sarah Williams",
    phone: "+1 555-0102",
    email: "sarah.w@driver.com",
    rating: 4.8,
    totalRides: 890,
    vehicleNumber: "XYZ-5678",
    vehicleModel: "Honda Accord 2021",
    photo: "",
  },
  {
    id: "DRV003",
    name: "James Brown",
    phone: "+1 555-0103",
    email: "james.b@driver.com",
    rating: 4.7,
    totalRides: 2100,
    vehicleNumber: "DEF-9012",
    vehicleModel: "Tesla Model 3",
    photo: "",
  },
  {
    id: "DRV004",
    name: "Emily Davis",
    phone: "+1 555-0104",
    email: "emily.d@driver.com",
    rating: 4.95,
    totalRides: 560,
    vehicleNumber: "GHI-3456",
    vehicleModel: "BMW 3 Series",
    photo: "",
  },
  {
    id: "DRV005",
    name: "Robert Miller",
    phone: "+1 555-0105",
    email: "robert.m@driver.com",
    rating: 4.6,
    totalRides: 1800,
    vehicleNumber: "JKL-7890",
    vehicleModel: "Ford Fusion 2020",
    photo: "",
  },
];

const MOCK_RIDERS: Rider[] = [
  {
    id: "RDR001",
    name: "John Smith",
    phone: "+1 555-1001",
    email: "john.smith@email.com",
    rating: 4.8,
    totalRides: 45,
    photo: "",
  },
  {
    id: "RDR002",
    name: "Lisa Anderson",
    phone: "+1 555-1002",
    email: "lisa.a@email.com",
    rating: 4.9,
    totalRides: 120,
    photo: "",
  },
  {
    id: "RDR003",
    name: "David Wilson",
    phone: "+1 555-1003",
    email: "david.w@email.com",
    rating: 4.5,
    totalRides: 30,
    photo: "",
  },
  {
    id: "RDR004",
    name: "Emma Thompson",
    phone: "+1 555-1004",
    email: "emma.t@email.com",
    rating: 5.0,
    totalRides: 200,
    photo: "",
  },
  {
    id: "RDR005",
    name: "Chris Martinez",
    phone: "+1 555-1005",
    email: "chris.m@email.com",
    rating: 4.7,
    totalRides: 75,
    photo: "",
  },
];

const PICKUP_LOCATIONS = [
  "123 Main Street, Downtown",
  "456 Oak Avenue, Westside",
  "789 Pine Road, Northgate",
  "321 Elm Boulevard, Eastpoint",
  "654 Maple Lane, Southpark",
  "987 Cedar Drive, Midtown",
];

const DROP_LOCATIONS = [
  "Airport Terminal 1",
  "Central Business District",
  "Grand Shopping Mall",
  "City Hospital",
  "University Campus",
  "Train Station",
];

const RIDE_TYPES = ["Standard", "Premium", "Shared", "XL"];
const VEHICLE_TYPES = ["Sedan", "SUV", "Hatchback", "Luxury"];
const PAYMENT_METHODS: PaymentMethod[] = ["CARD", "CASH", "WALLET", "UPI"];

// Generate mock completed rides
const generateMockRides = (count: number): CompletedRide[] => {
  const rides: CompletedRide[] = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const daysAgo = Math.floor(Math.random() * 14); // Last 14 days
    const hoursAgo = Math.floor(Math.random() * 24);
    const completedAt = new Date(now);
    completedAt.setDate(completedAt.getDate() - daysAgo);
    completedAt.setHours(completedAt.getHours() - hoursAgo);

    const duration = 15 + Math.floor(Math.random() * 45); // 15-60 mins
    const distance = 2 + Math.random() * 25; // 2-27 km
    const baseFare = 5 + distance * 1.5;
    const taxes = baseFare * 0.1;
    const tip = Math.random() > 0.5 ? Math.floor(Math.random() * 10) : 0;

    const pickupTime = new Date(completedAt);
    pickupTime.setMinutes(pickupTime.getMinutes() - duration);

    rides.push({
      id: `RIDE-${String(1000 + i).padStart(4, "0")}`,
      srNo: i + 1,
      rider: MOCK_RIDERS[i % MOCK_RIDERS.length],
      driver: MOCK_DRIVERS[i % MOCK_DRIVERS.length],
      pickupAddress: PICKUP_LOCATIONS[i % PICKUP_LOCATIONS.length],
      dropAddress: DROP_LOCATIONS[i % DROP_LOCATIONS.length],
      pickupTime: pickupTime.toLocaleString(),
      dropTime: completedAt.toLocaleString(),
      completedAt,
      distance: Math.round(distance * 10) / 10,
      duration,
      baseFare: Math.round(baseFare * 100) / 100,
      taxes: Math.round(taxes * 100) / 100,
      tip,
      totalFare: Math.round((baseFare + taxes + tip) * 100) / 100,
      paymentMethod: PAYMENT_METHODS[i % PAYMENT_METHODS.length],
      paymentStatus: Math.random() > 0.1 ? "PAID" : "REFUNDED",
      transactionId: `TXN${Date.now()}${i}`,
      rideType: RIDE_TYPES[i % RIDE_TYPES.length],
      vehicleType: VEHICLE_TYPES[i % VEHICLE_TYPES.length],
      rating: 3 + Math.random() * 2,
      feedback:
        Math.random() > 0.6 ? "Great ride! Very comfortable." : undefined,
    });
  }

  return rides.sort(
    (a, b) => b.completedAt.getTime() - a.completedAt.getTime()
  );
};

const MOCK_RIDES = generateMockRides(50);

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
              trend.isPositive ? "text-emerald-600" : "text-red-600"
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

const PaymentMethodBadge: React.FC<{ method: PaymentMethod }> = ({
  method,
}) => {
  const config = {
    CARD: {
      icon: <CreditCard className="w-3 h-3" />,
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
    },
    CASH: {
      icon: <DollarSign className="w-3 h-3" />,
      bg: "bg-green-50",
      text: "text-green-700",
      border: "border-green-200",
    },
    WALLET: {
      icon: <Wallet className="w-3 h-3" />,
      bg: "bg-purple-50",
      text: "text-purple-700",
      border: "border-purple-200",
    },
    UPI: {
      icon: <Phone className="w-3 h-3" />,
      bg: "bg-orange-50",
      text: "text-orange-700",
      border: "border-orange-200",
    },
  };
  const c = config[method];
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${c.bg} ${c.text} ${c.border}`}
    >
      {c.icon} {method}
    </span>
  );
};

const PaymentStatusBadge: React.FC<{ status: PaymentStatus }> = ({
  status,
}) => {
  const config = {
    PAID: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
      dot: "bg-emerald-500",
    },
    REFUNDED: {
      bg: "bg-purple-50",
      text: "text-purple-700",
      border: "border-purple-200",
      dot: "bg-purple-500",
    },
  };
  const c = config[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium border ${c.bg} ${c.text} ${c.border}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {status}
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

// --- DETAIL MODAL ---
const RideDetailModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  ride: CompletedRide | null;
}> = ({ isOpen, onClose, ride }) => {
  if (!ride) return null;

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={`Ride Details - ${ride.id}`}
      size="xl"
    >
      <div className="space-y-6">
        {/* Ride Summary Header */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
          <div>
            <p className="text-xs text-emerald-600 font-medium">Total Fare</p>
            <p className="text-3xl font-bold text-emerald-700">
              ${ride.totalFare.toFixed(2)}
            </p>
          </div>
          <div className="text-right">
            <PaymentStatusBadge status={ride.paymentStatus} />
            <p className="text-xs text-gray-500 mt-1">
              {ride.completedAt.toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Driver & Rider Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Driver Card */}
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <Car className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-semibold text-gray-700">
                Driver Information
              </span>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                <User className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="font-semibold text-gray-900">
                  {ride.driver.name}
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <RatingStars rating={ride.driver.rating} />
                  <span>•</span>
                  <span>{ride.driver.totalRides} rides</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Phone className="w-3 h-3" /> {ride.driver.phone}
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Mail className="w-3 h-3" /> {ride.driver.email}
                </div>
                <div className="mt-2 p-2 bg-white rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-500">Vehicle</p>
                  <p className="text-sm font-medium text-gray-900">
                    {ride.driver.vehicleModel}
                  </p>
                  <p className="text-xs text-gray-600">
                    {ride.driver.vehicleNumber}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Rider Card */}
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold text-gray-700">
                Rider Information
              </span>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="font-semibold text-gray-900">{ride.rider.name}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <RatingStars rating={ride.rider.rating} />
                  <span>•</span>
                  <span>{ride.rider.totalRides} rides</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Phone className="w-3 h-3" /> {ride.rider.phone}
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Mail className="w-3 h-3" /> {ride.rider.email}
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                  <span>Rider ID:</span>
                  <span className="font-mono text-gray-700">
                    {ride.rider.id}
                  </span>
                </div>
              </div>
            </div>
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
              <div className="w-0.5 h-16 bg-gray-300" />
              <div className="w-3 h-3 rounded-full bg-red-500 border-2 border-red-200" />
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <p className="text-xs text-gray-500">Pickup Location</p>
                <p className="text-sm font-medium text-gray-900">
                  {ride.pickupAddress}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {ride.pickupTime}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Drop Location</p>
                <p className="text-sm font-medium text-gray-900">
                  {ride.dropAddress}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{ride.dropTime}</p>
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
                <p className="text-xs text-gray-500">Duration</p>
                <p className="text-lg font-bold text-gray-900">
                  {ride.duration} min
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment & Transaction */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Fare Breakdown */}
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <Receipt className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-semibold text-gray-700">
                Fare Breakdown
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Base Fare</span>
                <span className="font-medium text-gray-900">
                  ${ride.baseFare.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Taxes & Fees</span>
                <span className="font-medium text-gray-900">
                  ${ride.taxes.toFixed(2)}
                </span>
              </div>
              {ride.tip > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tip</span>
                  <span className="font-medium text-emerald-600">
                    ${ride.tip.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="pt-2 mt-2 border-t border-gray-200 flex justify-between">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="font-bold text-emerald-600 text-lg">
                  ${ride.totalFare.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Transaction Info */}
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-semibold text-gray-700">
                Transaction Details
              </span>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500">Transaction ID</p>
                <p className="text-sm font-mono text-gray-900">
                  {ride.transactionId}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Payment Method</p>
                <div className="mt-1">
                  <PaymentMethodBadge method={ride.paymentMethod} />
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500">Payment Status</p>
                <div className="mt-1">
                  <PaymentStatusBadge status={ride.paymentStatus} />
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500">Completed At</p>
                <p className="text-sm text-gray-900">
                  {ride.completedAt.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Ride Info & Rating */}
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
                <p className="text-xs text-gray-500">Ride ID</p>
                <p className="text-sm font-mono text-gray-900">{ride.id}</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-semibold text-gray-700">
                Rating & Feedback
              </span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    star <= Math.round(ride.rating)
                      ? "fill-amber-400 text-amber-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
              <span className="text-sm font-medium text-gray-700 ml-1">
                {ride.rating.toFixed(1)}
              </span>
            </div>
            {ride.feedback && (
              <p className="text-sm text-gray-600 italic">
                &quot;{ride.feedback}&quot;
              </p>
            )}
          </div>
        </div>
      </div>
    </Dialog>
  );
};

// --- MAIN COMPONENT ---
interface OperationsPageProps {
  defaultTab?: string;
}

export const OperationsPage: React.FC<OperationsPageProps> = () => {
  const [timeFilter, setTimeFilter] = useState<
    "today" | "yesterday" | "week" | "custom"
  >("today");
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [rideTypeFilter, setRideTypeFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRide, setSelectedRide] = useState<CompletedRide | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);

  // Filter rides based on time
  const getFilteredByTime = (rides: CompletedRide[]) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    switch (timeFilter) {
      case "today":
        return rides.filter((r) => r.completedAt >= today);
      case "yesterday":
        return rides.filter(
          (r) => r.completedAt >= yesterday && r.completedAt < today
        );
      case "week":
        return rides.filter((r) => r.completedAt >= weekAgo);
      default:
        return rides;
    }
  };

  // Calculate stats
  const todayRides = MOCK_RIDES.filter((r) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return r.completedAt >= today;
  });

  const yesterdayRides = MOCK_RIDES.filter((r) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    return r.completedAt >= yesterday && r.completedAt < today;
  });

  const weekRides = MOCK_RIDES.filter((r) => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return r.completedAt >= weekAgo;
  });

  const todayEarnings = todayRides.reduce((sum, r) => sum + r.totalFare, 0);
  const yesterdayEarnings = yesterdayRides.reduce(
    (sum, r) => sum + r.totalFare,
    0
  );

  const ridesTrend =
    yesterdayRides.length > 0
      ? Math.round(
          ((todayRides.length - yesterdayRides.length) /
            yesterdayRides.length) *
            100
        )
      : 0;
  const earningsTrend =
    yesterdayEarnings > 0
      ? Math.round(
          ((todayEarnings - yesterdayEarnings) / yesterdayEarnings) * 100
        )
      : 0;

  // Filter and search
  const filteredRides = useMemo(() => {
    let rides = getFilteredByTime(MOCK_RIDES);

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      rides = rides.filter(
        (r) =>
          r.id.toLowerCase().includes(term) ||
          r.rider.name.toLowerCase().includes(term) ||
          r.driver.name.toLowerCase().includes(term) ||
          r.rider.email.toLowerCase().includes(term) ||
          r.driver.email.toLowerCase().includes(term)
      );
    }

    if (paymentFilter) {
      rides = rides.filter((r) => r.paymentMethod === paymentFilter);
    }

    if (rideTypeFilter) {
      rides = rides.filter((r) => r.rideType === rideTypeFilter);
    }

    return rides;
  }, [timeFilter, searchTerm, paymentFilter, rideTypeFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredRides.length / PAGE_SIZE);
  const paginatedRides = filteredRides.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleClearFilters = () => {
    setSearchTerm("");
    setPaymentFilter("");
    setRideTypeFilter("");
    setCurrentPage(1);
  };

  const openDetailModal = (ride: CompletedRide) => {
    setSelectedRide(ride);
    setIsDetailModalOpen(true);
    setActionMenuOpen(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      {/* Page Header */}
      <div className="mb-6">
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white px-4 py-3 rounded-lg shadow-sm">
          <h1 className="text-xl font-semibold">Completed Rides</h1>
        </div>
        <nav className="flex items-center gap-2 mt-2 text-sm">
          <Link
            href="/ride"
            className="text-emerald-600 hover:text-emerald-700 hover:underline font-medium flex items-center gap-1"
          >
            <Home className="w-3.5 h-3.5" />
            Home
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-600">Completed Rides</span>
        </nav>
      </div>

      {/* Time Filter Tabs */}
      <div className="flex items-center gap-2 mb-6">
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
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setTimeFilter(tab.key as typeof timeFilter);
              setCurrentPage(1);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              timeFilter === tab.key
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Today's Rides"
          value={todayRides.length}
          subtitle="Completed rides"
          icon={<Car className="w-5 h-5 text-emerald-600" />}
          trend={{ value: Math.abs(ridesTrend), isPositive: ridesTrend >= 0 }}
          color="bg-emerald-50"
        />
        <StatCard
          title="Today's Earnings"
          value={`$${todayEarnings.toFixed(2)}`}
          subtitle="Total revenue"
          icon={<DollarSign className="w-5 h-5 text-blue-600" />}
          trend={{
            value: Math.abs(earningsTrend),
            isPositive: earningsTrend >= 0,
          }}
          color="bg-blue-50"
        />
        <StatCard
          title="Yesterday's Rides"
          value={yesterdayRides.length}
          subtitle="Completed rides"
          icon={<CheckCircle className="w-5 h-5 text-purple-600" />}
          color="bg-purple-50"
        />
        <StatCard
          title="Weekly Rides"
          value={weekRides.length}
          subtitle={`$${weekRides
            .reduce((s, r) => s + r.totalFare, 0)
            .toFixed(2)} earned`}
          icon={<TrendingUp className="w-5 h-5 text-orange-600" />}
          color="bg-orange-50"
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
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search by ride ID, rider name, driver name, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-11 pl-10 pr-4 text-sm bg-white border-2 border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-colors placeholder:text-gray-400"
            />
          </div>

          {/* Filter Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Payment Method
              </label>
              <Select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
              >
                <option value="">All Methods</option>
                <option value="CARD">Card</option>
                <option value="CASH">Cash</option>
                <option value="WALLET">Wallet</option>
                <option value="UPI">UPI</option>
              </Select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Ride Type
              </label>
              <Select
                value={rideTypeFilter}
                onChange={(e) => setRideTypeFilter(e.target.value)}
              >
                <option value="">All Types</option>
                <option value="Standard">Standard</option>
                <option value="Premium">Premium</option>
                <option value="Shared">Shared</option>
                <option value="XL">XL</option>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={handleClearFilters}
                className="w-full h-9 gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </Button>
            </div>
            <div className="flex items-end">
              <Button variant="outline" className="w-full h-9 gap-1">
                <Download className="w-3.5 h-3.5" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Table Card */}
      <Card>
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-gray-500" />
            <h2 className="font-semibold text-gray-800">
              Ride History ({filteredRides.length})
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
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase min-w-[180px]">
                  Rider
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase min-w-[180px]">
                  Driver
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase min-w-[200px]">
                  Route
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Completed
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Fare
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Payment
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Rating
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
                  className={`hover:bg-emerald-50/30 transition-colors ${
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
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                        <User className="w-4 h-4 text-blue-600" />
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
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                        <Car className="w-4 h-4 text-emerald-600" />
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
                  </td>
                  <td className="px-4 py-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                        <span className="text-xs text-gray-600 truncate max-w-[160px]">
                          {ride.pickupAddress}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                        <span className="text-xs text-gray-600 truncate max-w-[160px]">
                          {ride.dropAddress}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm text-gray-900">
                        {ride.completedAt.toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        {ride.completedAt.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-semibold text-gray-900">
                      ${ride.totalFare.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="space-y-1">
                      <PaymentMethodBadge method={ride.paymentMethod} />
                      <PaymentStatusBadge status={ride.paymentStatus} />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <RatingStars rating={ride.rating} />
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
                      <DropdownMenuContent
                        isOpen={actionMenuOpen === ride.id}
                        onClose={() => setActionMenuOpen(null)}
                      >
                        <DropdownMenuItem
                          onClick={() => openDetailModal(ride)}
                          icon={<Eye className="h-4 w-4 text-gray-500" />}
                        >
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            // Download receipt logic
                            setActionMenuOpen(null);
                          }}
                          icon={<Download className="h-4 w-4 text-gray-500" />}
                        >
                          Download Receipt
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            // View transaction logic
                            setActionMenuOpen(null);
                          }}
                          icon={<Receipt className="h-4 w-4 text-gray-500" />}
                        >
                          View Transaction
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
            <Car className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No completed rides found</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              Showing {(currentPage - 1) * PAGE_SIZE + 1} to{" "}
              {Math.min(currentPage * PAGE_SIZE, filteredRides.length)} of{" "}
              {filteredRides.length} rides
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
              <span className="flex items-center justify-center h-8 px-3 text-sm font-medium bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200">
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
      <RideDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        ride={selectedRide}
      />
    </div>
  );
};

export default OperationsPage;
