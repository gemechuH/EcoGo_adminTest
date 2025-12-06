"use client";
import React, { useState, useMemo } from "react";
import {
  MoreVertical,
  Search,
  X,
  ChevronDown,
  AlertTriangle,
  User,
  Car,
  FileText,
  MessageSquare,
  CheckCircle,
  Clock,
  Trash2,
  Eye,
  Shield,
  Phone,
  Mail,
  Calendar,
  AlertCircle,
  RefreshCw,
  DollarSign,
  Ban,
  Star,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Plus,
  Send,
  History,
  UserX,
  CarFront,
} from "lucide-react";

// --- TYPES & INTERFACES ---
type ComplaintStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
type ComplaintPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
type ComplaintCategory =
  | "SAFETY"
  | "BEHAVIOR"
  | "VEHICLE_CONDITION"
  | "PAYMENT"
  | "ROUTE"
  | "CANCELLATION"
  | "LOST_ITEM"
  | "OTHER";
type ReportedByType = "RIDER" | "DRIVER";
type ActionType =
  | "CREATED"
  | "ASSIGNED"
  | "NOTE_ADDED"
  | "STATUS_CHANGED"
  | "REFUND_ISSUED"
  | "WARNING_ISSUED"
  | "RESOLVED"
  | "CLOSED"
  | "REOPENED";

interface CaseAction {
  id: string;
  type: ActionType;
  description: string;
  performedBy: string;
  timestamp: Date;
  details?: string;
}

interface Rider {
  id: string;
  name: string;
  phone: string;
  email: string;
  rating: number;
  totalRides: number;
}

interface Driver {
  id: string;
  name: string;
  phone: string;
  email: string;
  rating: number;
  vehicleNumber: string;
  vehicleModel: string;
  totalRides: number;
}

interface Complaint {
  id: string;
  bookingId: string;
  reportedBy: ReportedByType;
  reporter: Rider | Driver;
  rider: Rider;
  driver: Driver;
  category: ComplaintCategory;
  priority: ComplaintPriority;
  subject: string;
  description: string;
  status: ComplaintStatus;
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
  closedAt?: Date;
  resolution?: string;
  refundAmount?: number;
  actions: CaseAction[];
  rideDetails: {
    pickupAddress: string;
    dropAddress: string;
    fare: number;
    distance: number;
    rideDate: Date;
  };
}

// --- CONSTANTS ---
const PAGE_SIZE = 10;

const CATEGORY_CONFIG: Record<
  ComplaintCategory,
  { label: string; icon: React.ReactNode; color: string }
> = {
  SAFETY: {
    label: "Safety Concern",
    icon: <Shield className="w-4 h-4" />,
    color: "text-red-600 bg-red-50",
  },
  BEHAVIOR: {
    label: "Behavior Issue",
    icon: <UserX className="w-4 h-4" />,
    color: "text-orange-600 bg-orange-50",
  },
  VEHICLE_CONDITION: {
    label: "Vehicle Condition",
    icon: <CarFront className="w-4 h-4" />,
    color: "text-yellow-600 bg-yellow-50",
  },
  PAYMENT: {
    label: "Payment Issue",
    icon: <DollarSign className="w-4 h-4" />,
    color: "text-green-600 bg-green-50",
  },
  ROUTE: {
    label: "Route Problem",
    icon: <MapPin className="w-4 h-4" />,
    color: "text-blue-600 bg-blue-50",
  },
  CANCELLATION: {
    label: "Cancellation",
    icon: <Ban className="w-4 h-4" />,
    color: "text-purple-600 bg-purple-50",
  },
  LOST_ITEM: {
    label: "Lost Item",
    icon: <AlertCircle className="w-4 h-4" />,
    color: "text-indigo-600 bg-indigo-50",
  },
  OTHER: {
    label: "Other",
    icon: <FileText className="w-4 h-4" />,
    color: "text-gray-600 bg-gray-50",
  },
};

const STATUS_CONFIG: Record<
  ComplaintStatus,
  { label: string; color: string; bgColor: string }
> = {
  OPEN: {
    label: "Open",
    color: "text-blue-700",
    bgColor: "bg-blue-100 border-blue-200",
  },
  IN_PROGRESS: {
    label: "In Progress",
    color: "text-amber-700",
    bgColor: "bg-amber-100 border-amber-200",
  },
  RESOLVED: {
    label: "Resolved",
    color: "text-emerald-700",
    bgColor: "bg-emerald-100 border-emerald-200",
  },
  CLOSED: {
    label: "Closed",
    color: "text-gray-700",
    bgColor: "bg-gray-100 border-gray-200",
  },
};

const PRIORITY_CONFIG: Record<
  ComplaintPriority,
  { label: string; color: string; bgColor: string }
> = {
  LOW: { label: "Low", color: "text-gray-600", bgColor: "bg-gray-100" },
  MEDIUM: { label: "Medium", color: "text-blue-600", bgColor: "bg-blue-100" },
  HIGH: { label: "High", color: "text-orange-600", bgColor: "bg-orange-100" },
  CRITICAL: { label: "Critical", color: "text-red-600", bgColor: "bg-red-100" },
};

const ACTION_CONFIG: Record<ActionType, { label: string; color: string }> = {
  CREATED: { label: "Case Created", color: "bg-blue-500" },
  ASSIGNED: { label: "Assigned", color: "bg-purple-500" },
  NOTE_ADDED: { label: "Note Added", color: "bg-gray-500" },
  STATUS_CHANGED: { label: "Status Changed", color: "bg-amber-500" },
  REFUND_ISSUED: { label: "Refund Issued", color: "bg-green-500" },
  WARNING_ISSUED: { label: "Warning Issued", color: "bg-orange-500" },
  RESOLVED: { label: "Resolved", color: "bg-emerald-500" },
  CLOSED: { label: "Closed", color: "bg-gray-600" },
  REOPENED: { label: "Reopened", color: "bg-red-500" },
};

// --- MOCK DATA ---
const generateMockComplaints = (): Complaint[] => {
  const complaints: Complaint[] = [];
  const categories: ComplaintCategory[] = [
    "SAFETY",
    "BEHAVIOR",
    "VEHICLE_CONDITION",
    "PAYMENT",
    "ROUTE",
    "CANCELLATION",
    "LOST_ITEM",
    "OTHER",
  ];
  const priorities: ComplaintPriority[] = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];
  const statuses: ComplaintStatus[] = [
    "OPEN",
    "IN_PROGRESS",
    "RESOLVED",
    "CLOSED",
  ];

  const riderNames = [
    "John Smith",
    "Sarah Johnson",
    "Michael Brown",
    "Emily Davis",
    "David Wilson",
    "Lisa Anderson",
  ];
  const driverNames = [
    "Amit Kumar",
    "Raj Singh",
    "Priya Sharma",
    "Vikram Patel",
    "Neha Gupta",
    "Arjun Reddy",
  ];

  const subjects = [
    "Driver was rude and unprofessional",
    "Vehicle was not clean",
    "Driver took longer route",
    "Payment charged twice",
    "Driver cancelled after waiting",
    "Left my bag in the car",
    "Felt unsafe during the ride",
    "AC was not working",
    "Driver was on phone while driving",
    "Wrong fare charged",
  ];

  for (let i = 0; i < 25; i++) {
    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - Math.floor(Math.random() * 30));

    const status = statuses[i % statuses.length];
    const isResolved = status === "RESOLVED" || status === "CLOSED";

    const closedAt = isResolved
      ? new Date(createdAt.getTime() + Math.random() * 86400000 * 5)
      : undefined;

    const reportedBy: ReportedByType = Math.random() > 0.5 ? "RIDER" : "DRIVER";

    const rider: Rider = {
      id: `RID-${1000 + i}`,
      name: riderNames[i % riderNames.length],
      phone: `+91 ${9000000000 + Math.floor(Math.random() * 999999999)}`,
      email: `rider${i}@email.com`,
      rating: 4 + Math.random(),
      totalRides: Math.floor(Math.random() * 100) + 10,
    };

    const driver: Driver = {
      id: `DRV-${2000 + i}`,
      name: driverNames[i % driverNames.length],
      phone: `+91 ${8000000000 + Math.floor(Math.random() * 999999999)}`,
      email: `driver${i}@ecogo.com`,
      rating: 4 + Math.random(),
      vehicleNumber: `PB-${10 + (i % 20)}-${["AB", "CD", "EF", "GH"][i % 4]}-${
        1000 + i
      }`,
      vehicleModel: [
        "Toyota Camry",
        "Honda City",
        "Maruti Swift",
        "Hyundai Creta",
      ][i % 4],
      totalRides: Math.floor(Math.random() * 500) + 50,
    };

    const actions: CaseAction[] = [
      {
        id: `ACT-${i}-1`,
        type: "CREATED",
        description: `Case created by ${
          reportedBy === "RIDER" ? rider.name : driver.name
        }`,
        performedBy: "System",
        timestamp: createdAt,
      },
    ];

    if (status !== "OPEN") {
      actions.push({
        id: `ACT-${i}-2`,
        type: "ASSIGNED",
        description: "Case assigned to support team",
        performedBy: "Admin",
        timestamp: new Date(createdAt.getTime() + 3600000),
        details: "Assigned to Support Agent Sarah",
      });
    }

    if (
      status === "IN_PROGRESS" ||
      status === "RESOLVED" ||
      status === "CLOSED"
    ) {
      actions.push({
        id: `ACT-${i}-3`,
        type: "STATUS_CHANGED",
        description: "Status changed to In Progress",
        performedBy: "Support Agent Sarah",
        timestamp: new Date(createdAt.getTime() + 7200000),
      });
    }

    if (status === "RESOLVED" || status === "CLOSED") {
      actions.push({
        id: `ACT-${i}-4`,
        type: "RESOLVED",
        description: "Case resolved with appropriate action",
        performedBy: "Support Agent Sarah",
        timestamp: closedAt || new Date(),
        details: "Issue investigated and resolved. Customer notified.",
      });
    }

    if (status === "CLOSED") {
      actions.push({
        id: `ACT-${i}-5`,
        type: "CLOSED",
        description: "Case officially closed",
        performedBy: "Admin",
        timestamp: closedAt || new Date(),
      });
    }

    complaints.push({
      id: `CASE-${String(i + 1).padStart(4, "0")}`,
      bookingId: `BK-${100000 + i}`,
      reportedBy,
      reporter: reportedBy === "RIDER" ? rider : driver,
      rider,
      driver,
      category: categories[i % categories.length],
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      subject: subjects[i % subjects.length],
      description: `Detailed description of the complaint: ${
        subjects[i % subjects.length]
      }. This happened during the ride and needs immediate attention.`,
      status,
      assignedTo: status !== "OPEN" ? "Support Agent Sarah" : undefined,
      createdAt,
      updatedAt: closedAt || createdAt,
      closedAt,
      resolution: isResolved
        ? "Issue has been investigated and appropriate action has been taken. The customer has been notified and compensated where applicable."
        : undefined,
      refundAmount:
        isResolved && Math.random() > 0.5
          ? Math.floor(Math.random() * 200) + 50
          : undefined,
      actions,
      rideDetails: {
        pickupAddress: `${Math.floor(Math.random() * 100) + 1}, Sector ${
          60 + (i % 20)
        }, Chandigarh`,
        dropAddress: `${Math.floor(Math.random() * 100) + 1}, Phase ${
          (i % 10) + 1
        }, Mohali`,
        fare: Math.floor(100 + Math.random() * 400),
        distance: Math.floor(5 + Math.random() * 20),
        rideDate: new Date(createdAt.getTime() - 3600000),
      },
    });
  }

  return complaints.sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  );
};

const MOCK_COMPLAINTS = generateMockComplaints();

// --- UTILITY COMPONENTS ---
const StatusBadge: React.FC<{ status: ComplaintStatus }> = ({ status }) => {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${config.bgColor} ${config.color}`}
    >
      {config.label}
    </span>
  );
};

const PriorityBadge: React.FC<{ priority: ComplaintPriority }> = ({
  priority,
}) => {
  const config = PRIORITY_CONFIG[priority];
  return (
    <span
      className={`px-2 py-0.5 text-xs font-medium rounded ${config.bgColor} ${config.color}`}
    >
      {config.label}
    </span>
  );
};

const CategoryBadge: React.FC<{ category: ComplaintCategory }> = ({
  category,
}) => {
  const config = CATEGORY_CONFIG[category];
  return <span className="text-sm text-gray-900">{config.label}</span>;
};

// --- MAIN COMPONENT ---
const RideComplaintsPage: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>(MOCK_COMPLAINTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [reportedByFilter, setReportedByFilter] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  // Modal States
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(
    null
  );
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isSolveModalOpen, setIsSolveModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"DESC" | "ASC">("DESC");

  // Solve Case Form State
  const [resolution, setResolution] = useState("");
  const [actionType, setActionType] = useState<string>("RESOLVE");
  const [refundAmount, setRefundAmount] = useState("");
  const [warningType, setWarningType] = useState<string>("NONE");
  const [internalNote, setInternalNote] = useState("");

  // Stats
  const stats = useMemo(() => {
    return {
      total: complaints.length,
      open: complaints.filter((c) => c.status === "OPEN").length,
      inProgress: complaints.filter((c) => c.status === "IN_PROGRESS").length,
      resolved: complaints.filter((c) => c.status === "RESOLVED").length,
      closed: complaints.filter((c) => c.status === "CLOSED").length,
    };
  }, [complaints]);

  // Filter and sort complaints
  const filteredComplaints = useMemo(() => {
    const filtered = complaints.filter((c) => {
      const matchesSearch =
        c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.rider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.subject.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === "ALL" || c.status === statusFilter;
      const matchesCategory =
        categoryFilter === "ALL" || c.category === categoryFilter;
      const matchesReportedBy =
        reportedByFilter === "ALL" || c.reportedBy === reportedByFilter;

      return (
        matchesSearch && matchesStatus && matchesCategory && matchesReportedBy
      );
    });

    // Sort by created date
    return filtered.sort((a, b) => {
      if (sortOrder === "DESC") {
        return b.createdAt.getTime() - a.createdAt.getTime();
      } else {
        return a.createdAt.getTime() - b.createdAt.getTime();
      }
    });
  }, [
    complaints,
    searchTerm,
    statusFilter,
    categoryFilter,
    reportedByFilter,
    sortOrder,
  ]);

  // Pagination
  const totalPages = Math.ceil(filteredComplaints.length / PAGE_SIZE);
  const paginatedComplaints = filteredComplaints.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // Format functions
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();

    // Handle future dates or invalid dates
    if (diffMs < 0) return formatDate(date);

    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hr ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    if (diffDays < 30)
      return `${Math.floor(diffDays / 7)} week${
        Math.floor(diffDays / 7) > 1 ? "s" : ""
      } ago`;
    return formatDate(date);
  };

  // Actions
  const handleViewCase = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setIsViewModalOpen(true);
    setActionMenuOpen(null);
  };

  const handleSolveCase = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setResolution("");
    setActionType("RESOLVE");
    setRefundAmount("");
    setWarningType("NONE");
    setInternalNote("");
    setIsSolveModalOpen(true);
    setActionMenuOpen(null);
  };

  const handleDeleteCase = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setIsDeleteModalOpen(true);
    setActionMenuOpen(null);
  };

  const handleReopenCase = (complaint: Complaint) => {
    const updatedComplaints = complaints.map((c) => {
      if (c.id === complaint.id) {
        const newAction: CaseAction = {
          id: `ACT-${Date.now()}`,
          type: "REOPENED",
          description: "Case reopened for further investigation",
          performedBy: "Admin",
          timestamp: new Date(),
        };
        return {
          ...c,
          status: "OPEN" as ComplaintStatus,
          closedAt: undefined,
          resolution: undefined,
          actions: [...c.actions, newAction],
          updatedAt: new Date(),
        };
      }
      return c;
    });
    setComplaints(updatedComplaints);
    setActionMenuOpen(null);
  };

  const submitResolution = () => {
    if (!selectedComplaint || !resolution.trim()) {
      alert("Please provide a resolution message.");
      return;
    }

    const newActions: CaseAction[] = [];

    if (internalNote.trim()) {
      newActions.push({
        id: `ACT-${Date.now()}-note`,
        type: "NOTE_ADDED",
        description: "Internal note added",
        performedBy: "Admin",
        timestamp: new Date(),
        details: internalNote,
      });
    }

    if (refundAmount && parseFloat(refundAmount) > 0) {
      newActions.push({
        id: `ACT-${Date.now()}-refund`,
        type: "REFUND_ISSUED",
        description: `Refund of ₹${refundAmount} issued to ${
          selectedComplaint.reportedBy === "RIDER" ? "rider" : "driver"
        }`,
        performedBy: "Admin",
        timestamp: new Date(),
        details: `Amount: ₹${refundAmount}`,
      });
    }

    if (warningType !== "NONE") {
      newActions.push({
        id: `ACT-${Date.now()}-warning`,
        type: "WARNING_ISSUED",
        description: `Warning issued to ${
          warningType === "DRIVER" ? "driver" : "rider"
        }`,
        performedBy: "Admin",
        timestamp: new Date(),
        details:
          warningType === "DRIVER"
            ? selectedComplaint.driver.name
            : selectedComplaint.rider.name,
      });
    }

    newActions.push({
      id: `ACT-${Date.now()}-resolve`,
      type: actionType === "CLOSE" ? "CLOSED" : "RESOLVED",
      description: resolution,
      performedBy: "Admin",
      timestamp: new Date(),
      details: resolution,
    });

    const updatedComplaints = complaints.map((c) => {
      if (c.id === selectedComplaint.id) {
        return {
          ...c,
          status: (actionType === "CLOSE"
            ? "CLOSED"
            : "RESOLVED") as ComplaintStatus,
          resolution,
          closedAt: new Date(),
          updatedAt: new Date(),
          refundAmount: refundAmount ? parseFloat(refundAmount) : undefined,
          actions: [...c.actions, ...newActions],
        };
      }
      return c;
    });

    setComplaints(updatedComplaints);
    setIsSolveModalOpen(false);
    setSelectedComplaint(null);
  };

  const confirmDelete = () => {
    if (!selectedComplaint) return;
    setComplaints((prev) => prev.filter((c) => c.id !== selectedComplaint.id));
    setIsDeleteModalOpen(false);
    setSelectedComplaint(null);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("ALL");
    setCategoryFilter("ALL");
    setReportedByFilter("ALL");
    setSortOrder("DESC");
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="bg-gray-900 text-white px-4 py-3 rounded-xl">
          <h1 className="text-2xl font-bold">Ride Complaints</h1>
        </div>
        <p className="text-gray-600 text-sm mt-2 pl-1">
          Manage and resolve rider and driver complaints
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <p className="text-xs text-gray-500 uppercase font-semibold">
            Total Cases
          </p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <p className="text-xs text-blue-600 uppercase font-semibold">Open</p>
          <p className="text-2xl font-bold text-blue-700">{stats.open}</p>
        </div>
        <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
          <p className="text-xs text-amber-600 uppercase font-semibold">
            In Progress
          </p>
          <p className="text-2xl font-bold text-amber-700">
            {stats.inProgress}
          </p>
        </div>
        <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
          <p className="text-xs text-emerald-600 uppercase font-semibold">
            Resolved
          </p>
          <p className="text-2xl font-bold text-emerald-700">
            {stats.resolved}
          </p>
        </div>
        <div className="bg-gray-100 rounded-xl p-4 border border-gray-300">
          <p className="text-xs text-gray-600 uppercase font-semibold">
            Closed
          </p>
          <p className="text-2xl font-bold text-gray-700">{stats.closed}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-5 mb-6 border border-gray-200">
        <div className="grid grid-cols-6 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Case ID, Booking ID, Name..."
                className="w-full h-10 pl-9 pr-3 border-2 border-gray-300 rounded-lg text-sm focus:border-gray-900 focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Sort By Created
            </label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as "DESC" | "ASC")}
              className="w-full h-10 px-3 border-2 border-gray-300 rounded-lg text-sm focus:border-gray-900 focus:outline-none"
            >
              <option value="DESC">Newest First</option>
              <option value="ASC">Oldest First</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full h-10 px-3 border-2 border-gray-300 rounded-lg text-sm focus:border-gray-900 focus:outline-none"
            >
              <option value="ALL">All Status</option>
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full h-10 px-3 border-2 border-gray-300 rounded-lg text-sm focus:border-gray-900 focus:outline-none"
            >
              <option value="ALL">All Categories</option>
              {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
                <option key={key} value={key}>
                  {config.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Reported By
            </label>
            <select
              value={reportedByFilter}
              onChange={(e) => setReportedByFilter(e.target.value)}
              className="w-full h-10 px-3 border-2 border-gray-300 rounded-lg text-sm focus:border-gray-900 focus:outline-none"
            >
              <option value="ALL">All</option>
              <option value="RIDER">Rider</option>
              <option value="DRIVER">Driver</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="h-10 px-4 border-2 border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-bold text-white bg-black w-full p-1 rounded">
            Complaints List
          </h2>
        </div>
        <span className="text-sm text-gray-500">
          {filteredComplaints.length} cases
        </span>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-2 py-3 text-left text-xs font-bold text-gray-800 ">
                  Case ID
                </th>
                <th className="px-2 py-3 text-left text-xs font-bold text-gray-800 ">
                  Booking
                </th>
                <th className="px-2 py-3 text-left text-xs font-bold text-gray-800 ">
                  Reported By
                </th>
                <th className="px-2 py-3 text-left text-xs font-bold text-gray-800 ">
                  Rider
                </th>
                <th className="px-2 py-3 text-left text-xs font-bold text-gray-800">
                  Driver
                </th>
                <th className="px-2 py-3 text-left text-xs font-bold text-gray-800 ">
                  Category
                </th>
                <th className="px-2 py-3 text-left text-xs font-bold text-gray-800 ">
                  Priority
                </th>
                <th className="px-2 py-3 text-left text-xs font-bold text-gray-800 ">
                  Created
                </th>
                <th className="px-2 py-3 text-left text-xs font-bold text-gray-800 ">
                  Closed
                </th>
                <th className="px-2 py-3 text-left text-xs font-bold text-gray-800 ">
                  Status
                </th>
                <th className="px-2 py-3 text-center text-xs font-bold text-gray-800 ">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedComplaints.map((complaint) => (
                <tr key={complaint.id} className="hover:bg-gray-50">
                  <td className="px-2 py-3">
                    <span className="text-xs font-mono font-bold text-gray-900">
                      {complaint.id}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-gray-700">
                      {complaint.bookingId}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded ${
                        complaint.reportedBy === "RIDER"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-purple-100 text-purple-700"
                      }`}
                    >
                      {complaint.reportedBy}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-xs font-medium text-gray-900">
                      {complaint.rider.name}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-xs font-medium text-gray-900">
                      {complaint.driver.name}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-xs">
                    <CategoryBadge category={complaint.category} />
                  </td>
                  <td className="px-4 py-3">
                    <PriorityBadge priority={complaint.priority} />
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-xs text-gray-900">
                      {formatDate(complaint.createdAt)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {getTimeAgo(complaint.createdAt)}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    {complaint.closedAt ? (
                      <>
                        <p className="text-xs text-gray-900">
                          {formatDate(complaint.closedAt)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {getTimeAgo(complaint.closedAt)}
                        </p>
                      </>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={complaint.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="relative flex justify-center">
                      <button
                        onClick={() =>
                          setActionMenuOpen(
                            actionMenuOpen === complaint.id
                              ? null
                              : complaint.id
                          )
                        }
                        className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                      >
                        <MoreVertical className="w-4 h-4 text-gray-900" />
                      </button>
                      {actionMenuOpen === complaint.id && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setActionMenuOpen(null)}
                          />
                          <div className="absolute right-0 top-full mt-1 z-20 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1">
                            <button
                              onClick={() => handleViewCase(complaint)}
                              className="flex items-center w-full px-4 py-2 text-xs text-gray-700 hover:bg-gray-50"
                            >
                              <Eye className="w-4 h-4 mr-2" /> View Case
                            </button>
                            {(complaint.status === "OPEN" ||
                              complaint.status === "IN_PROGRESS") && (
                              <button
                                onClick={() => handleSolveCase(complaint)}
                                className="flex items-center w-full px-4 py-2 text-xs text-emerald-600 hover:bg-emerald-50"
                              >
                                <CheckCircle className="w-4 h-4 mr-2" /> Solve
                                Case
                              </button>
                            )}
                            {(complaint.status === "RESOLVED" ||
                              complaint.status === "CLOSED") && (
                              <button
                                onClick={() => handleReopenCase(complaint)}
                                className="flex items-center w-full px-4 py-2 text-xs text-amber-600 hover:bg-amber-50"
                              >
                                <RefreshCw className="w-4 h-4 mr-2" /> Reopen
                                Case
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteCase(complaint)}
                              className="flex items-center w-full px-4 py-2 text-xs text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4 mr-2" /> Delete Case
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredComplaints.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No complaints found matching your criteria.
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {(currentPage - 1) * PAGE_SIZE + 1} to{" "}
              {Math.min(currentPage * PAGE_SIZE, filteredComplaints.length)} of{" "}
              {filteredComplaints.length}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => p - 1)}
                disabled={currentPage === 1}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4 text-gray-900" />
              </button>
              <span className="px-4 py-2 bg-gray-900 text-white rounded-lg text-xs font-medium">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={currentPage === totalPages}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50"
              >
                <ChevronRight className="w-4 h-4 text-gray-900" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* VIEW CASE MODAL */}
      {isViewModalOpen && selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between shrink-0">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold">Case Details</h3>
                  <span className="font-mono text-gray-400">
                    {selectedComplaint.id}
                  </span>
                  <StatusBadge status={selectedComplaint.status} />
                </div>
                <p className="text-gray-400 text-xs mt-1">
                  Created on {formatDateTime(selectedComplaint.createdAt)}
                </p>
              </div>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-5">
                  {/* Complaint Info */}
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">
                      Complaint Details
                    </h4>
                    <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Category</span>
                        <CategoryBadge category={selectedComplaint.category} />
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Priority</span>
                        <PriorityBadge priority={selectedComplaint.priority} />
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">
                          Reported By
                        </span>
                        <span className="text-xs font-medium text-gray-900">
                          {selectedComplaint.reportedBy}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-500">
                          Booking ID
                        </span>
                        <span className="text-xs font-mono text-gray-900">
                          {selectedComplaint.bookingId}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Subject & Description */}
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">
                      Subject
                    </h4>
                    <p className="text-sm font-medium text-gray-900 bg-gray-50 rounded-lg p-3">
                      {selectedComplaint.subject}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">
                      Description
                    </h4>
                    <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">
                      {selectedComplaint.description}
                    </p>
                  </div>

                  {/* Resolution */}
                  {selectedComplaint.resolution && (
                    <div>
                      <h4 className="text-xs font-semibold text-emerald-600 uppercase mb-2">
                        Resolution
                      </h4>
                      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                        <p className="text-sm text-emerald-800">
                          {selectedComplaint.resolution}
                        </p>
                        {selectedComplaint.refundAmount && (
                          <p className="text-sm font-medium text-emerald-700 mt-2">
                            Refund Issued: ₹{selectedComplaint.refundAmount}
                          </p>
                        )}
                        {selectedComplaint.closedAt && (
                          <p className="text-xs text-emerald-600 mt-2">
                            Closed on{" "}
                            {formatDateTime(selectedComplaint.closedAt)}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Rider Info */}
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">
                      Rider Information
                    </h4>
                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                      <p className="font-semibold text-gray-900">
                        {selectedComplaint.rider.name}
                      </p>
                      <div className="mt-2 space-y-1 text-sm text-gray-600">
                        <p>
                          <span className="font-bold">ID:</span>{" "}
                          {selectedComplaint.rider.id}
                        </p>
                        <p>
                          <span className="font-bold">Phone:</span>{" "}
                          {selectedComplaint.rider.phone}
                        </p>
                        <p>
                          <span className="font-bold">Email:</span>{" "}
                          {selectedComplaint.rider.email}
                        </p>
                        <p>
                          <span className="font-bold">Rating:</span>{" "}
                          {selectedComplaint.rider.rating.toFixed(1)} ⭐
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Driver Info */}
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">
                      Driver Information
                    </h4>
                    <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                      <p className="font-semibold text-gray-900">
                        {selectedComplaint.driver.name}
                      </p>
                      <div className="mt-2 space-y-1 text-sm text-gray-600">
                        <p>
                          <span className="font-bold">ID:</span>{" "}
                          {selectedComplaint.driver.id}
                        </p>
                        <p>
                          <span className="font-bold">Phone:</span>{" "}
                          {selectedComplaint.driver.phone}
                        </p>
                        <p>
                          <span className="font-bold">Vehicle:</span>{" "}
                          {selectedComplaint.driver.vehicleModel}
                        </p>
                        <p>
                          <span className="font-bold">Plate:</span>{" "}
                          {selectedComplaint.driver.vehicleNumber}
                        </p>
                        <p>
                          <span className="font-bold">Rating:</span>{" "}
                          {selectedComplaint.driver.rating.toFixed(1)} ⭐
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Timeline */}
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">
                    Case Timeline
                  </h4>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <div className="relative pl-6">
                      <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-gray-300" />
                      {selectedComplaint.actions.map((action, idx) => (
                        <div
                          key={action.id}
                          className="relative mb-4 last:mb-0"
                        >
                          <div
                            className={`absolute -left-6 top-1 w-4 h-4 rounded-full ${
                              ACTION_CONFIG[action.type].color
                            }`}
                          />
                          <div>
                            <p className="text-xs font-semibold text-gray-500">
                              {ACTION_CONFIG[action.type].label}
                            </p>
                            <p className="text-sm text-gray-900">
                              {action.description}
                            </p>
                            {action.details && (
                              <p className="text-xs text-gray-500 mt-0.5">
                                {action.details}
                              </p>
                            )}
                            <p className="text-xs text-gray-400 mt-1">
                              {formatDateTime(action.timestamp)} •{" "}
                              {action.performedBy}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Ride Details */}
                  <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2 mt-5">
                    Ride Details
                  </h4>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Ride Date</span>
                      <span className="text-gray-900">
                        {formatDate(selectedComplaint.rideDetails.rideDate)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Fare</span>
                      <span className="font-semibold text-gray-900">
                        ₹{selectedComplaint.rideDetails.fare}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Distance</span>
                      <span className="text-gray-900">
                        {selectedComplaint.rideDetails.distance} km
                      </span>
                    </div>
                    <div className="pt-2 border-t border-gray-200">
                      <p className="text-xs text-gray-500">Pickup</p>
                      <p className="text-sm text-gray-900">
                        {selectedComplaint.rideDetails.pickupAddress}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Drop</p>
                      <p className="text-sm text-gray-900">
                        {selectedComplaint.rideDetails.dropAddress}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3 shrink-0">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 font-medium"
              >
                Close
              </button>
              {(selectedComplaint.status === "OPEN" ||
                selectedComplaint.status === "IN_PROGRESS") && (
                <button
                  onClick={() => {
                    setIsViewModalOpen(false);
                    handleSolveCase(selectedComplaint);
                  }}
                  className="px-5 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium"
                >
                  Solve Case
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SOLVE CASE MODAL */}
      {isSolveModalOpen && selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="bg-black text-white px-6 py-4 flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" /> Solve Case
                </h3>
                <p className="text-emerald-100 text-sm">
                  {selectedComplaint.id} - {selectedComplaint.subject}
                </p>
              </div>
              <button
                onClick={() => setIsSolveModalOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto flex-1 space-y-5">
              {/* Action Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Action Type
                </label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setActionType("RESOLVE")}
                    className={`flex-1 py-3 rounded-lg border-2 font-medium ${
                      actionType === "RESOLVE"
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                        : "border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    Mark as Resolved
                  </button>
                  <button
                    onClick={() => setActionType("CLOSE")}
                    className={`flex-1 py-3 rounded-lg border-2 font-medium ${
                      actionType === "CLOSE"
                        ? "border-gray-700 bg-gray-100 text-gray-900"
                        : "border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    Close Case
                  </button>
                </div>
              </div>

              {/* Resolution Message */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Resolution Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  rows={4}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none"
                  placeholder="Describe how this case was resolved..."
                />
              </div>

              {/* Refund Option */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Issue Refund (Optional)
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">₹</span>
                  <input
                    type="number"
                    value={refundAmount}
                    onChange={(e) => setRefundAmount(e.target.value)}
                    className="w-40 h-10 px-3 border-2 border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none"
                    placeholder="0.00"
                  />
                  <span className="text-sm text-gray-500">
                    to{" "}
                    {selectedComplaint.reportedBy === "RIDER"
                      ? "Rider"
                      : "Driver"}
                  </span>
                </div>
              </div>

              {/* Warning Option */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Issue Warning (Optional)
                </label>
                <select
                  value={warningType}
                  onChange={(e) => setWarningType(e.target.value)}
                  className="w-full h-10 px-3 border-2 border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none"
                >
                  <option value="NONE">No Warning</option>
                  <option value="RIDER">
                    Warn Rider ({selectedComplaint.rider.name})
                  </option>
                  <option value="DRIVER">
                    Warn Driver ({selectedComplaint.driver.name})
                  </option>
                </select>
              </div>

              {/* Internal Note */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Internal Note (Optional)
                </label>
                <textarea
                  value={internalNote}
                  onChange={(e) => setInternalNote(e.target.value)}
                  rows={2}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none"
                  placeholder="Add internal notes for record..."
                />
              </div>

              {/* Warning Notice */}
              <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800">
                  This action will officially{" "}
                  {actionType === "CLOSE" ? "close" : "resolve"} the case. The{" "}
                  {selectedComplaint.reportedBy === "RIDER"
                    ? "rider"
                    : "driver"}{" "}
                  will be notified of the resolution.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3 shrink-0">
              <button
                onClick={() => setIsSolveModalOpen(false)}
                className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={submitResolution}
                className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Submit Resolution
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {isDeleteModalOpen && selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                Delete Case
              </h3>
              <p className="text-gray-600 text-center mb-4">
                Are you sure you want to delete case{" "}
                <span className="font-mono font-bold">
                  {selectedComplaint.id}
                </span>
                ? This action cannot be undone.
              </p>
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <p className="text-sm text-gray-700">
                  <strong>Subject:</strong> {selectedComplaint.subject}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Status:</strong>{" "}
                  {STATUS_CONFIG[selectedComplaint.status].label}
                </p>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
              >
                Delete Case
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RideComplaintsPage;
