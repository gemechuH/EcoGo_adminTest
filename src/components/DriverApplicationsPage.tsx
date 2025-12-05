"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  MoreVertical,
  Eye,
  CheckCircle,
  XCircle,
  MessageSquare,
  Trash2,
  Home,
  Filter,
  RotateCcw,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  Car,
  FileText,
  Image,
  Shield,
  CreditCard,
  Download,
  ExternalLink,
  X,
  ChevronRight,
  ChevronLeft,
  ChevronsRight,
  ChevronsLeft,
  AlertTriangle,
  CheckCircle2,
  XOctagon,
  HelpCircle,
  UserX,
  TrendingUp,
  Users,
  FileCheck,
  AlertCircle,
  Loader2,
  Camera,
  BadgeCheck,
  CircleAlert,
  Send,
} from "lucide-react";

// --- CONFIGURATION ---
const PAGE_SIZE = 10;

// --- TYPES ---
type ApplicationStatus =
  | "pending"
  | "under_review"
  | "approved"
  | "rejected"
  | "needs_info"
  | "inactive";

type DocumentStatus = "pending" | "verified" | "rejected" | "not_uploaded";

interface Document {
  name: string;
  status: DocumentStatus;
  url: string;
  uploadedAt?: string;
  expiryDate?: string;
  notes?: string;
}

interface VehicleInfo {
  make: string;
  model: string;
  year: number;
  color: string;
  plateNumber: string;
  type: string;
}

interface DriverApplication {
  id: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    profilePhoto: string;
  };
  vehicle: VehicleInfo;
  documents: {
    driverLicense: Document;
    governmentId: Document;
    profilePhoto: Document;
    vehicleRegistration: Document;
    insurance: Document;
    backgroundCheck: Document;
  };
  status: ApplicationStatus;
  appliedOn: Date;
  lastUpdated: Date;
  reviewNotes?: string;
  rejectionReason?: string;
  requestedInfo?: string;
  assignedReviewer?: string;
  rating?: number;
  previousExperience?: string;
}

// --- STATUS CONFIGURATION ---
const STATUS_CONFIG: Record<
  ApplicationStatus,
  { label: string; color: string; bgColor: string; borderColor: string }
> = {
  pending: {
    label: "Pending",
    color: "text-amber-700",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
  },
  under_review: {
    label: "Under Review",
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  approved: {
    label: "Approved",
    color: "text-emerald-700",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
  },
  rejected: {
    label: "Rejected",
    color: "text-gray-700",
    bgColor: "bg-gray-100",
    borderColor: "border-gray-300",
  },
  needs_info: {
    label: "Needs Info",
    color: "text-purple-700",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
  },
  inactive: {
    label: "Inactive",
    color: "text-gray-500",
    bgColor: "bg-gray-50",
    borderColor: "border-gray-200",
  },
};

const DOC_STATUS_CONFIG: Record<
  DocumentStatus,
  { label: string; color: string; icon: React.ReactNode }
> = {
  pending: {
    label: "Pending",
    color: "text-amber-600 bg-amber-50",
    icon: <Clock className="w-4 h-4" />,
  },
  verified: {
    label: "Verified",
    color: "text-emerald-600 bg-emerald-50",
    icon: <CheckCircle className="w-4 h-4" />,
  },
  rejected: {
    label: "Rejected",
    color: "text-gray-600 bg-gray-100",
    icon: <XCircle className="w-4 h-4" />,
  },
  not_uploaded: {
    label: "Not Uploaded",
    color: "text-gray-400 bg-gray-50",
    icon: <AlertCircle className="w-4 h-4" />,
  },
};

// --- UI COMPONENTS ---
const Button: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "default" | "outline" | "ghost" | "destructive";
  }
> = ({ children, className = "", variant = "default", ...props }) => {
  const styles = {
    default: "bg-gray-900 text-white hover:bg-gray-800",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50",
    ghost: "text-gray-700 hover:bg-gray-100",
    destructive: "bg-gray-800 text-white hover:bg-gray-700",
  };
  return (
    <button
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2 ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = (
  props
) => (
  <select
    className="h-9 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
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
    <div className="absolute right-0 z-30 mt-1 w-56 rounded-lg bg-white shadow-lg border border-gray-200 py-1">
      {children}
    </div>
  );
};

const DropdownMenuItem: React.FC<{
  children: React.ReactNode;
  onClick: () => void;
  icon: React.ReactNode;
  variant?: "default" | "danger";
}> = ({ children, onClick, icon, variant = "default" }) => (
  <button
    onClick={onClick}
    className={`flex w-full items-center px-3 py-2 text-sm ${
      variant === "danger"
        ? "text-gray-700 hover:bg-gray-50"
        : "text-gray-700 hover:bg-gray-50"
    }`}
  >
    {icon}
    <span className="ml-2">{children}</span>
  </button>
);

const DropdownMenuDivider = () => (
  <div className="my-1 border-t border-gray-100" />
);

// Modal Dialog
const Dialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
}> = ({ isOpen, onClose, title, children, size = "lg" }) => {
  if (!isOpen) return null;
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-6xl",
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
          <div className="max-h-[80vh] overflow-y-auto">{children}</div>
        </div>
      </div>
    </div>
  );
};

// --- MOCK DATA GENERATION ---
const generateMockApplications = (): DriverApplication[] => {
  const firstNames = [
    "Michael",
    "Sarah",
    "James",
    "Emily",
    "David",
    "Jessica",
    "Robert",
    "Ashley",
    "William",
    "Amanda",
    "Daniel",
    "Stephanie",
    "Christopher",
    "Nicole",
    "Matthew",
  ];
  const lastNames = [
    "Johnson",
    "Williams",
    "Brown",
    "Jones",
    "Garcia",
    "Miller",
    "Davis",
    "Rodriguez",
    "Martinez",
    "Anderson",
    "Taylor",
    "Thomas",
    "Moore",
    "Jackson",
    "Martin",
  ];
  const cities = [
    "Los Angeles",
    "San Francisco",
    "New York",
    "Chicago",
    "Houston",
    "Phoenix",
    "Seattle",
    "Denver",
    "Miami",
    "Boston",
  ];
  const makes = [
    "Toyota",
    "Honda",
    "Ford",
    "Chevrolet",
    "Nissan",
    "BMW",
    "Mercedes",
    "Hyundai",
    "Kia",
    "Tesla",
  ];
  const models: Record<string, string[]> = {
    Toyota: ["Camry", "Corolla", "RAV4", "Highlander"],
    Honda: ["Civic", "Accord", "CR-V", "Pilot"],
    Ford: ["Fusion", "Escape", "Explorer", "F-150"],
    Chevrolet: ["Malibu", "Equinox", "Traverse", "Silverado"],
    Nissan: ["Altima", "Sentra", "Rogue", "Murano"],
    BMW: ["3 Series", "5 Series", "X3", "X5"],
    Mercedes: ["C-Class", "E-Class", "GLC", "GLE"],
    Hyundai: ["Elantra", "Sonata", "Tucson", "Santa Fe"],
    Kia: ["Forte", "K5", "Sportage", "Sorento"],
    Tesla: ["Model 3", "Model Y", "Model S", "Model X"],
  };
  const colors = ["Black", "White", "Silver", "Gray", "Blue", "Red"];
  const statuses: ApplicationStatus[] = [
    "pending",
    "under_review",
    "approved",
    "rejected",
    "needs_info",
    "inactive",
  ];
  const docStatuses: DocumentStatus[] = [
    "pending",
    "verified",
    "rejected",
    "not_uploaded",
  ];

  const applications: DriverApplication[] = [];

  for (let i = 0; i < 35; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const make = makes[Math.floor(Math.random() * makes.length)];
    const model = models[make][Math.floor(Math.random() * models[make].length)];
    const status = statuses[i % statuses.length];

    const appliedOn = new Date();
    appliedOn.setDate(appliedOn.getDate() - Math.floor(Math.random() * 30));

    applications.push({
      id: `APP-${String(1000 + i).padStart(4, "0")}`,
      personalInfo: {
        firstName,
        lastName,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
        phone: `+1 ${Math.floor(Math.random() * 900) + 100}-${
          Math.floor(Math.random() * 900) + 100
        }-${Math.floor(Math.random() * 9000) + 1000}`,
        dateOfBirth: `${1970 + Math.floor(Math.random() * 30)}-${String(
          Math.floor(Math.random() * 12) + 1
        ).padStart(2, "0")}-${String(
          Math.floor(Math.random() * 28) + 1
        ).padStart(2, "0")}`,
        address: `${Math.floor(Math.random() * 9999) + 1} ${
          ["Main", "Oak", "Maple", "Cedar", "Pine"][
            Math.floor(Math.random() * 5)
          ]
        } ${["St", "Ave", "Blvd", "Dr"][Math.floor(Math.random() * 4)]}`,
        city: cities[Math.floor(Math.random() * cities.length)],
        state: "CA",
        zipCode: String(90000 + Math.floor(Math.random() * 10000)),
        profilePhoto: "",
      },
      vehicle: {
        make,
        model,
        year: 2018 + Math.floor(Math.random() * 6),
        color: colors[Math.floor(Math.random() * colors.length)],
        plateNumber: `${String.fromCharCode(
          65 + Math.floor(Math.random() * 26)
        )}${String.fromCharCode(
          65 + Math.floor(Math.random() * 26)
        )}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}-${
          Math.floor(Math.random() * 9000) + 1000
        }`,
        type: ["Sedan", "SUV", "Hatchback"][Math.floor(Math.random() * 3)],
      },
      documents: {
        driverLicense: {
          name: "Driver License",
          status:
            status === "approved"
              ? "verified"
              : docStatuses[Math.floor(Math.random() * 3)],
          url: "/docs/license.pdf",
          uploadedAt: appliedOn.toISOString(),
        },
        governmentId: {
          name: "Government ID",
          status:
            status === "approved"
              ? "verified"
              : docStatuses[Math.floor(Math.random() * 3)],
          url: "/docs/gov-id.pdf",
          uploadedAt: appliedOn.toISOString(),
        },
        profilePhoto: {
          name: "Profile Photo",
          status:
            status === "approved"
              ? "verified"
              : docStatuses[Math.floor(Math.random() * 3)],
          url: "/docs/photo.jpg",
          uploadedAt: appliedOn.toISOString(),
        },
        vehicleRegistration: {
          name: "Vehicle Registration",
          status:
            status === "approved"
              ? "verified"
              : docStatuses[Math.floor(Math.random() * 3)],
          url: "/docs/registration.pdf",
          uploadedAt: appliedOn.toISOString(),
        },
        insurance: {
          name: "Insurance",
          status:
            status === "approved"
              ? "verified"
              : docStatuses[Math.floor(Math.random() * 3)],
          url: "/docs/insurance.pdf",
          uploadedAt: appliedOn.toISOString(),
          expiryDate: "2025-12-31",
        },
        backgroundCheck: {
          name: "Background Check",
          status:
            status === "approved"
              ? "verified"
              : docStatuses[Math.floor(Math.random() * 3)],
          url: "/docs/background.pdf",
          uploadedAt: appliedOn.toISOString(),
        },
      },
      status,
      appliedOn,
      lastUpdated: new Date(),
      reviewNotes:
        status === "under_review" ? "Currently reviewing documents" : undefined,
      rejectionReason:
        status === "rejected" ? "Invalid driver license" : undefined,
      requestedInfo:
        status === "needs_info"
          ? "Please provide updated insurance documents"
          : undefined,
      previousExperience:
        Math.random() > 0.5 ? "2 years with Uber, 1 year with Lyft" : undefined,
    });
  }

  return applications.sort(
    (a, b) => b.appliedOn.getTime() - a.appliedOn.getTime()
  );
};

const MOCK_APPLICATIONS = generateMockApplications();

// --- STATUS BADGE ---
const StatusBadge: React.FC<{ status: ApplicationStatus }> = ({ status }) => {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${config.bgColor} ${config.color} ${config.borderColor}`}
    >
      {config.label}
    </span>
  );
};

// --- DOCUMENT CARD ---
const DocumentCard: React.FC<{ doc: Document; onView: () => void }> = ({
  doc,
  onView,
}) => {
  const config = DOC_STATUS_CONFIG[doc.status];
  return (
    <div className="p-4 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-lg ${config.color}`}>{config.icon}</div>
          <div>
            <p className="text-sm font-medium text-gray-900">{doc.name}</p>
            <p className="text-xs text-gray-500">{config.label}</p>
          </div>
        </div>
      </div>
      {doc.status !== "not_uploaded" && (
        <div className="flex gap-2">
          <button
            onClick={onView}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Eye className="w-3 h-3" /> View
          </button>
          <button className="flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
            <ExternalLink className="w-3 h-3" />
          </button>
          <button className="flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
            <Download className="w-3 h-3" />
          </button>
        </div>
      )}
      {doc.expiryDate && (
        <p className="text-xs text-gray-500 mt-2">Expires: {doc.expiryDate}</p>
      )}
    </div>
  );
};

// --- VIEW DETAILS MODAL ---
const ViewDetailsModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  application: DriverApplication | null;
  onApprove: () => void;
  onReject: () => void;
  onRequestInfo: () => void;
}> = ({ isOpen, onClose, application, onApprove, onReject, onRequestInfo }) => {
  if (!application) return null;
  const { personalInfo, vehicle, documents, status } = application;

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Driver Application Details"
      size="full"
    >
      <div className="p-6">
        {/* Header with Status */}
        <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="w-8 h-8 text-gray-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {personalInfo.firstName} {personalInfo.lastName}
              </h2>
              <p className="text-sm text-gray-500">
                Application ID: {application.id}
              </p>
              <p className="text-sm text-gray-500">
                Applied: {application.appliedOn.toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="text-right">
            <StatusBadge status={status} />
            <p className="text-xs text-gray-500 mt-2">
              Last updated: {application.lastUpdated.toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="p-5 bg-gray-50 rounded-xl">
            <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2 mb-4">
              <User className="w-4 h-4" /> Personal Information
            </h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Full Name</p>
                  <p className="text-sm font-medium text-gray-900">
                    {personalInfo.firstName} {personalInfo.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Date of Birth</p>
                  <p className="text-sm font-medium text-gray-900">
                    {personalInfo.dateOfBirth}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-sm font-medium text-gray-900 flex items-center gap-1">
                  <Mail className="w-3 h-3 text-gray-400" />{" "}
                  {personalInfo.email}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Phone</p>
                <p className="text-sm font-medium text-gray-900 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-gray-400" />{" "}
                  {personalInfo.phone}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Address</p>
                <p className="text-sm font-medium text-gray-900 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-gray-400" />{" "}
                  {personalInfo.address}, {personalInfo.city},{" "}
                  {personalInfo.state} {personalInfo.zipCode}
                </p>
              </div>
              {application.previousExperience && (
                <div>
                  <p className="text-xs text-gray-500">Previous Experience</p>
                  <p className="text-sm font-medium text-gray-900">
                    {application.previousExperience}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Vehicle Information */}
          <div className="p-5 bg-gray-50 rounded-xl">
            <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2 mb-4">
              <Car className="w-4 h-4" /> Vehicle Information
            </h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Make</p>
                  <p className="text-sm font-medium text-gray-900">
                    {vehicle.make}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Model</p>
                  <p className="text-sm font-medium text-gray-900">
                    {vehicle.model}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Year</p>
                  <p className="text-sm font-medium text-gray-900">
                    {vehicle.year}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Color</p>
                  <p className="text-sm font-medium text-gray-900">
                    {vehicle.color}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Plate Number</p>
                  <p className="text-sm font-medium text-gray-900 font-mono">
                    {vehicle.plateNumber}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Vehicle Type</p>
                  <p className="text-sm font-medium text-gray-900">
                    {vehicle.type}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Documents Section */}
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2 mb-4">
            <FileText className="w-4 h-4" /> Uploaded Documents
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <DocumentCard doc={documents.driverLicense} onView={() => {}} />
            <DocumentCard doc={documents.governmentId} onView={() => {}} />
            <DocumentCard doc={documents.profilePhoto} onView={() => {}} />
            <DocumentCard
              doc={documents.vehicleRegistration}
              onView={() => {}}
            />
            <DocumentCard doc={documents.insurance} onView={() => {}} />
            <DocumentCard doc={documents.backgroundCheck} onView={() => {}} />
          </div>
        </div>

        {/* Review Notes */}
        {(application.reviewNotes ||
          application.rejectionReason ||
          application.requestedInfo) && (
          <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-200">
            <h3 className="text-sm font-semibold text-amber-800 flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4" /> Review Notes
            </h3>
            {application.reviewNotes && (
              <p className="text-sm text-amber-700">
                {application.reviewNotes}
              </p>
            )}
            {application.rejectionReason && (
              <p className="text-sm text-gray-700">
                Rejection Reason: {application.rejectionReason}
              </p>
            )}
            {application.requestedInfo && (
              <p className="text-sm text-purple-700">
                Requested Info: {application.requestedInfo}
              </p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        {status !== "approved" && status !== "inactive" && (
          <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <Button variant="outline" onClick={onRequestInfo}>
              <MessageSquare className="w-4 h-4" /> Request Info
            </Button>
            <Button variant="destructive" onClick={onReject}>
              <XCircle className="w-4 h-4" /> Reject
            </Button>
            <Button onClick={onApprove}>
              <CheckCircle className="w-4 h-4" /> Approve
            </Button>
          </div>
        )}
      </div>
    </Dialog>
  );
};

// --- APPROVE MODAL ---
const ApproveModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  application: DriverApplication | null;
  isLoading: boolean;
}> = ({ isOpen, onClose, onConfirm, application, isLoading }) => {
  if (!application) return null;
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Approve Application"
      size="md"
    >
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 rounded-full bg-emerald-100">
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Confirm Approval</h3>
            <p className="text-sm text-gray-500">
              You are about to approve {application.personalInfo.firstName}{" "}
              {application.personalInfo.lastName}&apos;s application.
            </p>
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-xl mb-6">
          <p className="text-sm text-gray-600 mb-2">This action will:</p>
          <ul className="text-sm text-gray-600 space-y-1">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" /> Set
              application status to &quot;Approved&quot;
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" /> Add driver to
              the active drivers list
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" /> Send approval
              notification to the driver
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" /> Enable driver
              to start accepting rides
            </li>
          </ul>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Processing...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" /> Confirm Approval
              </>
            )}
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

// --- REJECT MODAL ---
const RejectModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  application: DriverApplication | null;
  isLoading: boolean;
}> = ({ isOpen, onClose, onConfirm, application, isLoading }) => {
  const [reason, setReason] = useState("");
  const [selectedReason, setSelectedReason] = useState("");

  const predefinedReasons = [
    "Invalid or expired driver license",
    "Vehicle does not meet requirements",
    "Failed background check",
    "Incomplete or unclear documents",
    "Insurance documents invalid",
    "Does not meet age requirements",
    "Other (specify below)",
  ];

  if (!application) return null;

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Reject Application"
      size="md"
    >
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 rounded-full bg-gray-100">
            <XOctagon className="w-8 h-8 text-gray-700" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Reject Application</h3>
            <p className="text-sm text-gray-500">
              Please provide a reason for rejecting{" "}
              {application.personalInfo.firstName}{" "}
              {application.personalInfo.lastName}&apos;s application.
            </p>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Reason
            </label>
            <Select
              value={selectedReason}
              onChange={(e) => setSelectedReason(e.target.value)}
            >
              <option value="">Choose a reason...</option>
              {predefinedReasons.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Details
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Provide additional details about the rejection..."
              className="w-full h-32 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 resize-none"
            />
          </div>
        </div>

        <div className="p-4 bg-amber-50 rounded-xl mb-6 border border-amber-200">
          <p className="text-sm text-amber-800 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
            The applicant will receive an email notification with the rejection
            reason.
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => onConfirm(selectedReason || reason)}
            disabled={isLoading || (!selectedReason && !reason)}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Processing...
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4" /> Reject Application
              </>
            )}
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

// --- REQUEST INFO MODAL ---
const RequestInfoModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (message: string) => void;
  application: DriverApplication | null;
  isLoading: boolean;
}> = ({ isOpen, onClose, onConfirm, application, isLoading }) => {
  const [message, setMessage] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const documentRequests = [
    { id: "license", label: "Updated Driver License" },
    { id: "insurance", label: "Current Insurance Documents" },
    { id: "registration", label: "Vehicle Registration" },
    { id: "photo", label: "Clear Profile Photo" },
    { id: "background", label: "Background Check Authorization" },
    { id: "address", label: "Proof of Address" },
  ];

  if (!application) return null;

  const toggleItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Request More Information"
      size="md"
    >
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 rounded-full bg-purple-100">
            <HelpCircle className="w-8 h-8 text-purple-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              Request Additional Information
            </h3>
            <p className="text-sm text-gray-500">
              Ask {application.personalInfo.firstName}{" "}
              {application.personalInfo.lastName} to provide more information.
            </p>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Required Documents
            </label>
            <div className="grid grid-cols-2 gap-2">
              {documentRequests.map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => toggleItem(doc.id)}
                  className={`p-3 text-left text-sm rounded-lg border transition-colors ${
                    selectedItems.includes(doc.id)
                      ? "border-gray-900 bg-gray-900 text-white"
                      : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {doc.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add any specific instructions or requirements..."
              className="w-full h-24 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 resize-none"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={() => onConfirm(message)}
            disabled={isLoading || (selectedItems.length === 0 && !message)}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" /> Send Request
              </>
            )}
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

// --- DELETE CONFIRMATION MODAL ---
const DeleteModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  application: DriverApplication | null;
  isLoading: boolean;
}> = ({ isOpen, onClose, onConfirm, application, isLoading }) => {
  if (!application) return null;
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Mark as Inactive"
      size="sm"
    >
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 rounded-full bg-gray-100">
            <UserX className="w-8 h-8 text-gray-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              Mark Application Inactive
            </h3>
            <p className="text-sm text-gray-500">
              This will mark the application as inactive. The data will be
              preserved.
            </p>
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-xl mb-6">
          <p className="text-sm text-gray-600">
            Application for{" "}
            <strong>
              {application.personalInfo.firstName}{" "}
              {application.personalInfo.lastName}
            </strong>{" "}
            will be marked as inactive and hidden from the main list.
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Processing...
              </>
            ) : (
              <>Mark Inactive</>
            )}
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

// --- MAIN COMPONENT ---
export function DriverApplicationsPage() {
  const [applications, setApplications] =
    useState<DriverApplication[]>(MOCK_APPLICATIONS);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);

  // Modal states
  const [selectedApplication, setSelectedApplication] =
    useState<DriverApplication | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isRequestInfoModalOpen, setIsRequestInfoModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Stats
  const stats = useMemo(() => {
    const pending = applications.filter((a) => a.status === "pending").length;
    const underReview = applications.filter(
      (a) => a.status === "under_review"
    ).length;
    const approved = applications.filter((a) => a.status === "approved").length;
    const rejected = applications.filter((a) => a.status === "rejected").length;
    const needsInfo = applications.filter(
      (a) => a.status === "needs_info"
    ).length;
    return {
      pending,
      underReview,
      approved,
      rejected,
      needsInfo,
      total: applications.length,
    };
  }, [applications]);

  // Filtered applications
  const filteredApplications = useMemo(() => {
    let filtered = applications.filter((a) => a.status !== "inactive");

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.personalInfo.firstName.toLowerCase().includes(term) ||
          a.personalInfo.lastName.toLowerCase().includes(term) ||
          a.personalInfo.email.toLowerCase().includes(term) ||
          a.personalInfo.phone.includes(term) ||
          a.id.toLowerCase().includes(term)
      );
    }

    if (statusFilter) {
      filtered = filtered.filter((a) => a.status === statusFilter);
    }

    return filtered;
  }, [applications, searchTerm, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredApplications.length / PAGE_SIZE);
  const paginatedApplications = filteredApplications.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // Action handlers
  const handleApprove = async () => {
    if (!selectedApplication) return;
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setApplications((prev) =>
      prev.map((a) =>
        a.id === selectedApplication.id
          ? {
              ...a,
              status: "approved" as ApplicationStatus,
              lastUpdated: new Date(),
            }
          : a
      )
    );
    setIsLoading(false);
    setIsApproveModalOpen(false);
    setSelectedApplication(null);
  };

  const handleReject = async (reason: string) => {
    if (!selectedApplication) return;
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setApplications((prev) =>
      prev.map((a) =>
        a.id === selectedApplication.id
          ? {
              ...a,
              status: "rejected" as ApplicationStatus,
              rejectionReason: reason,
              lastUpdated: new Date(),
            }
          : a
      )
    );
    setIsLoading(false);
    setIsRejectModalOpen(false);
    setSelectedApplication(null);
  };

  const handleRequestInfo = async (message: string) => {
    if (!selectedApplication) return;
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setApplications((prev) =>
      prev.map((a) =>
        a.id === selectedApplication.id
          ? {
              ...a,
              status: "needs_info" as ApplicationStatus,
              requestedInfo: message,
              lastUpdated: new Date(),
            }
          : a
      )
    );
    setIsLoading(false);
    setIsRequestInfoModalOpen(false);
    setSelectedApplication(null);
  };

  const handleDelete = async () => {
    if (!selectedApplication) return;
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setApplications((prev) =>
      prev.map((a) =>
        a.id === selectedApplication.id
          ? {
              ...a,
              status: "inactive" as ApplicationStatus,
              lastUpdated: new Date(),
            }
          : a
      )
    );
    setIsLoading(false);
    setIsDeleteModalOpen(false);
    setSelectedApplication(null);
  };

  const openAction = (
    application: DriverApplication,
    action: "view" | "approve" | "reject" | "request" | "delete"
  ) => {
    setSelectedApplication(application);
    setActionMenuOpen(null);
    switch (action) {
      case "view":
        setIsViewModalOpen(true);
        break;
      case "approve":
        setIsApproveModalOpen(true);
        break;
      case "reject":
        setIsRejectModalOpen(true);
        break;
      case "request":
        setIsRequestInfoModalOpen(true);
        break;
      case "delete":
        setIsDeleteModalOpen(true);
        break;
    }
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      {/* Page Header */}
      <div className="mb-6">
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white px-5 py-4 rounded-xl shadow-sm">
          <h1 className="text-2xl font-bold">Driver Applications</h1>
          <p className="text-gray-300 text-sm mt-1">
            Review and manage driver onboarding applications
          </p>
        </div>
        <nav className="flex items-center gap-2 mt-2 text-sm">
          <Link
            href="/ride"
            className="text-emerald-600 hover:text-emerald-700 hover:underline font-medium flex items-center gap-1"
          >
            <Home className="w-3.5 h-3.5" /> Home
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-600">Driver Applications</span>
        </nav>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">
                Pending
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats.pending}
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-50">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">
                Under Review
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats.underReview}
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-50">
              <FileCheck className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">
                Approved
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats.approved}
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-50">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">
                Needs Info
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats.needsInfo}
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-purple-50">
              <HelpCircle className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">
                Rejected
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats.rejected}
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-gray-100">
              <XCircle className="w-5 h-5 text-gray-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <div className="p-4 border-b border-gray-100 flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="font-medium text-sm text-gray-700">
            Search & Filters
          </span>
        </div>
        <div className="p-4">
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-[250px]">
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, phone, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full h-10 pl-10 pr-4 text-sm border-2 border-gray-300 rounded-lg focus:border-gray-900 focus:ring-2 focus:ring-gray-900/20 focus:outline-none"
                />
              </div>
            </div>
            <div className="w-48">
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Status
              </label>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="under_review">Under Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="needs_info">Needs Info</option>
              </Select>
            </div>
            <Button
              variant="outline"
              onClick={handleClearFilters}
              className="h-10"
            >
              <RotateCcw className="w-4 h-4" /> Reset
            </Button>
          </div>
        </div>
      </Card>

      {/* Applications Table */}
      <Card>
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-500" />
            <h2 className="font-semibold text-gray-800">
              Applications ({filteredApplications.length})
            </h2>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Driver Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Phone
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Vehicle
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Applied On
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedApplications.map((app, idx) => (
                <tr
                  key={app.id}
                  className={`hover:bg-gray-50 transition-colors ${
                    idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                  }`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {app.personalInfo.firstName}{" "}
                          {app.personalInfo.lastName}
                        </p>
                        <p className="text-xs text-gray-500">{app.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-gray-600">
                      {app.personalInfo.phone}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-gray-600">
                      {app.personalInfo.email}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-gray-900">
                      {app.vehicle.year} {app.vehicle.make} {app.vehicle.model}
                    </p>
                    <p className="text-xs text-gray-500">
                      {app.vehicle.plateNumber}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={app.status} />
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-gray-600">
                      {app.appliedOn.toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {app.appliedOn.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        onClick={() =>
                          setActionMenuOpen(
                            actionMenuOpen === app.id ? null : app.id
                          )
                        }
                      >
                        <MoreVertical className="h-4 w-4 text-gray-500" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent isOpen={actionMenuOpen === app.id}>
                        <DropdownMenuItem
                          onClick={() => openAction(app, "view")}
                          icon={<Eye className="h-4 w-4 text-gray-500" />}
                        >
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuDivider />
                        <DropdownMenuItem
                          onClick={() => openAction(app, "approve")}
                          icon={
                            <CheckCircle className="h-4 w-4 text-emerald-500" />
                          }
                        >
                          Approve
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => openAction(app, "reject")}
                          icon={<XCircle className="h-4 w-4 text-gray-500" />}
                        >
                          Reject
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => openAction(app, "request")}
                          icon={
                            <MessageSquare className="h-4 w-4 text-purple-500" />
                          }
                        >
                          Request More Info
                        </DropdownMenuItem>
                        <DropdownMenuDivider />
                        <DropdownMenuItem
                          onClick={() => openAction(app, "delete")}
                          icon={<Trash2 className="h-4 w-4 text-gray-400" />}
                          variant="danger"
                        >
                          Delete (Inactive)
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredApplications.length === 0 && (
          <div className="p-8 text-center">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No applications found</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              Showing {(currentPage - 1) * PAGE_SIZE + 1} to{" "}
              {Math.min(currentPage * PAGE_SIZE, filteredApplications.length)}{" "}
              of {filteredApplications.length}
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
              <span className="flex items-center justify-center h-8 px-3 text-sm font-medium bg-gray-900 text-white rounded-lg">
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

      {/* Modals */}
      <ViewDetailsModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedApplication(null);
        }}
        application={selectedApplication}
        onApprove={() => {
          setIsViewModalOpen(false);
          setIsApproveModalOpen(true);
        }}
        onReject={() => {
          setIsViewModalOpen(false);
          setIsRejectModalOpen(true);
        }}
        onRequestInfo={() => {
          setIsViewModalOpen(false);
          setIsRequestInfoModalOpen(true);
        }}
      />

      <ApproveModal
        isOpen={isApproveModalOpen}
        onClose={() => {
          setIsApproveModalOpen(false);
          setSelectedApplication(null);
        }}
        onConfirm={handleApprove}
        application={selectedApplication}
        isLoading={isLoading}
      />

      <RejectModal
        isOpen={isRejectModalOpen}
        onClose={() => {
          setIsRejectModalOpen(false);
          setSelectedApplication(null);
        }}
        onConfirm={handleReject}
        application={selectedApplication}
        isLoading={isLoading}
      />

      <RequestInfoModal
        isOpen={isRequestInfoModalOpen}
        onClose={() => {
          setIsRequestInfoModalOpen(false);
          setSelectedApplication(null);
        }}
        onConfirm={handleRequestInfo}
        application={selectedApplication}
        isLoading={isLoading}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedApplication(null);
        }}
        onConfirm={handleDelete}
        application={selectedApplication}
        isLoading={isLoading}
      />
    </div>
  );
}

export default DriverApplicationsPage;
