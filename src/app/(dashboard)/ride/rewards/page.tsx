'use client';
import React, { useState, useMemo, ChangeEvent } from "react";
import { format, differenceInDays } from "date-fns";
import {
  ArrowUp,
  ArrowDown,
  Search,
  Plus,
  Trash2,
  Download,
  Upload,
  Award,
  ChevronDown,
  Clock,
  AlertTriangle,
  XCircle,
  CheckCircle,
} from "lucide-react";

// --- CONFIGURATION ---
const EcoGoGreen = "#3BB54A";
const EcoGoLightGreen = "#d1fae5";
const EcoGoGreenRings = "rgb(59, 181, 74)"; // For ring color
const EXPIRING_SOON_DAYS = 7;

// --- TYPES ---
type UserType = "Rider" | "Student" | "Pet Delivery";
type RewardStatus = "Active" | "Inactive";

interface Reward {
  id: string;
  validFrom: number; // Unix timestamp
  validUntil: number; // Unix timestamp
  rewardPoints: number;
  comments: string;
  status: RewardStatus;
  userType: UserType;
}

interface SortConfig {
  key: keyof Reward | "daysLeft";
  ascending: boolean;
}

// --- MOCK DATA GENERATION ---

// Helper to get a date object (Unix timestamp)
const getDate = (daysOffset: number): number => {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date.getTime();
};

const initialRewards: Reward[] = [
  {
    id: "RWD-001",
    validFrom: getDate(-30),
    validUntil: getDate(90),
    rewardPoints: 50,
    comments: "Sign-up bonus for new riders.",
    status: "Active",
    userType: "Rider",
  },
  {
    id: "RWD-002",
    validFrom: getDate(-5),
    validUntil: getDate(EXPIRING_SOON_DAYS - 2), // Expires in 5 days
    rewardPoints: 200,
    comments: "Weekend challenge completion.",
    status: "Active",
    userType: "Rider",
  },
  {
    id: "RWD-003",
    validFrom: getDate(-100),
    validUntil: getDate(-10), // Expired
    rewardPoints: 100,
    comments: "Expired promotional offer.",
    status: "Inactive",
    userType: "Student",
  },
  {
    id: "RWD-004",
    validFrom: getDate(1),
    validUntil: getDate(180),
    rewardPoints: 75,
    comments: "Referral reward for Pet Delivery services.",
    status: "Active",
    userType: "Pet Delivery",
  },
  {
    id: "RWD-005",
    validFrom: getDate(-60),
    validUntil: getDate(30),
    rewardPoints: 150,
    comments: "High volume rider loyalty bonus.",
    status: "Active",
    userType: "Rider",
  },
];

// --- PURE JS CSV HANDLERS (Replaces PapaParse) ---

/**
 * Converts an array of objects to a CSV string.
 * @param data Array of objects to convert.
 * @param headers Array of keys to use as headers.
 */
const jsonToCsv = (data: Record<string, any>[], headers: string[]): string => {
  if (!data.length) return "";

  const csvRows = [];

  // 1. Headers Row
  csvRows.push(headers.join(","));

  // 2. Data Rows
  for (const row of data) {
    const values = headers.map((header) => {
      const value = row[header];
      // Escape double quotes and enclose in quotes if value contains comma or quotes
      const escaped = ("" + value).replace(/"/g, '""');
      return /[",\n]/.test(escaped) ? `"${escaped}"` : escaped;
    });
    csvRows.push(values.join(","));
  }

  return csvRows.join("\n");
};

/**
 * Parses a CSV string into an array of objects.
 * NOTE: This is a basic implementation and does not handle all CSV complexities (like nested quotes)
 * @param csvString The input CSV string.
 */
const csvToJson = (csvString: string): Record<string, string>[] => {
  const lines = csvString.trim().split("\n");
  if (lines.length === 0) return [];

  const headers = lines[0].split(",").map((h) => h.trim());
  const result = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",");
    if (values.length !== headers.length) continue; // Skip malformed rows

    const obj: Record<string, string> = {};
    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = values[j]
        .trim()
        .replace(/^"|"$/g, "")
        .replace(/""/g, '"');
    }
    result.push(obj);
  }
  return result;
};

// --- ADMIN COMPONENT ---

export default function RewardsAdmin() {
  const [rewards, setRewards] = useState<Reward[]>(initialRewards);
  const [filters, setFilters] = useState({ from: "", to: "", search: "" });
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "rewardPoints",
    ascending: false,
  });
  const [nextId, setNextId] = useState(rewards.length + 1);
  // State for showing success/error messages
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const [newReward, setNewReward] = useState<
    Omit<Reward, "id" | "validFrom" | "validUntil"> & {
      validFrom: string;
      validUntil: string;
    }
  >({
    validFrom: "",
    validUntil: "",
    rewardPoints: 0,
    comments: "",
    status: "Active",
    userType: "Rider",
  });

  // Clear message after a few seconds
  const showMessage = (
    text: string,
    type: "success" | "error" | "info" = "info"
  ) => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 5000);
  };

  // --- CRUD OPERATIONS (Local State) ---

  const handleInlineUpdate = (id: string, field: keyof Reward, value: any) => {
    setRewards((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          let updatedValue = value;

          // Handle type conversions for the local state (timestamps)
          if (field === "rewardPoints") updatedValue = Number(value);
          if (field === "validFrom" || field === "validUntil")
            updatedValue = new Date(value).getTime();

          return { ...r, [field]: updatedValue };
        }
        return r;
      })
    );
    showMessage("Reward updated successfully.", "success");
  };

  const handleDelete = (id: string) => {
    if (
      window.confirm(
        `Are you sure you want to delete reward ${id}? This action cannot be undone.`
      )
    ) {
      setRewards((prev) => prev.filter((r) => r.id !== id));
      showMessage(`Reward ${id} deleted.`, "success");
    }
  };

  const handleAddNew = () => {
    if (
      !newReward.validFrom ||
      !newReward.validUntil ||
      newReward.rewardPoints <= 0
    ) {
      showMessage(
        "Validation Error: Please fill in valid dates and points (> 0).",
        "error"
      );
      return;
    }
    if (
      new Date(newReward.validFrom).getTime() >=
      new Date(newReward.validUntil).getTime()
    ) {
      showMessage(
        "Validation Error: 'Valid From' must be before 'Valid Until'.",
        "error"
      );
      return;
    }

    const newEntry: Reward = {
      id: `RWD-${String(nextId).padStart(3, "0")}`,
      validFrom: new Date(newReward.validFrom).getTime(),
      validUntil: new Date(newReward.validUntil).getTime(),
      rewardPoints: Number(newReward.rewardPoints),
      comments: newReward.comments || "No comment provided",
      status: newReward.status,
      userType: newReward.userType,
    };

    setRewards((prev) => [...prev, newEntry]);
    setNextId((prev) => prev + 1);

    // Reset form
    setNewReward({
      validFrom: "",
      validUntil: "",
      rewardPoints: 0,
      comments: "",
      status: "Active",
      userType: "Rider",
    });
    showMessage(
      `New reward RWD-${String(nextId).padStart(3, "0")} added successfully.`,
      "success"
    );
  };

  // --- FILTERING AND SORTING ---

  const sortedAndFilteredRewards = useMemo(() => {
    const tempRewards = rewards.map((r) => ({
      ...r,
      // Add calculated field for sorting/display
      daysLeft: differenceInDays(r.validUntil, Date.now()),
    }));

    // 1. Filtering
    const filtered = tempRewards.filter((r) => {
      const rewardValidFrom = r.validFrom;
      const rewardValidUntil = r.validUntil;

      // Date Filtering
      const fromDate = filters.from ? new Date(filters.from).getTime() : 0;
      const toDate = filters.to
        ? new Date(filters.to).getTime() + 86400000
        : Infinity; // +1 day for inclusive end date

      const matchesDate =
        rewardValidFrom >= fromDate && rewardValidUntil < toDate;

      // Search Filtering (ID, Points, Comments, User Type)
      const keyword = filters.search.toLowerCase();
      const matchesSearch =
        r.id.toLowerCase().includes(keyword) ||
        r.rewardPoints.toString().includes(keyword) ||
        r.comments.toLowerCase().includes(keyword) ||
        r.userType.toLowerCase().includes(keyword) ||
        r.status.toLowerCase().includes(keyword);

      return matchesDate && matchesSearch;
    });

    // 2. Sorting
    const sorted = filtered.sort((a, b) => {
      let aVal: any = a[sortConfig.key as keyof Reward] || a.daysLeft; // Fallback for daysLeft
      let bVal: any = b[sortConfig.key as keyof Reward] || b.daysLeft;

      if (sortConfig.key === "daysLeft") {
        aVal = a.daysLeft;
        bVal = b.daysLeft;
      }

      if (typeof aVal === "string") {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (aVal < bVal) return sortConfig.ascending ? -1 : 1;
      if (aVal > bVal) return sortConfig.ascending ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [rewards, filters, sortConfig]);

  const toggleSort = (key: keyof Reward | "daysLeft") => {
    setSortConfig((prev) => ({
      key,
      ascending: prev.key === key ? !prev.ascending : true,
    }));
  };

  // --- CSV OPERATIONS (Pure JS implementation) ---

  const exportCSV = () => {
    const dataToExport = sortedAndFilteredRewards.map((r) => ({
      ID: r.id,
      ValidFrom: format(r.validFrom, "yyyy-MM-dd"),
      ValidUntil: format(r.validUntil, "yyyy-MM-dd"),
      RewardPoints: r.rewardPoints,
      Comments: r.comments,
      Status: r.status,
      UserType: r.userType,
      DaysLeft: r.daysLeft,
    }));

    const headers = [
      "ID",
      "ValidFrom",
      "ValidUntil",
      "RewardPoints",
      "Comments",
      "Status",
      "UserType",
      "DaysLeft",
    ];
    const csv = jsonToCsv(dataToExport, headers);

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "EcoGo_Rewards_Export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showMessage("CSV data successfully exported.", "success");
  };

  const handleCSVUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const csvText = event.target?.result as string;
      const results = csvToJson(csvText);

      const newEntries: Reward[] = [];
      let currentNextId = nextId;

      for (let row of results) {
        // Keys might be upper or lowercase depending on how the CSV was created
        const points = Number(row.RewardPoints || row.rewardPoints);
        const fromDateString = row.ValidFrom || row.validFrom;
        const untilDateString = row.ValidUntil || row.validUntil;

        const from = new Date(fromDateString).getTime();
        const until = new Date(untilDateString).getTime();

        if (isNaN(points) || points <= 0 || isNaN(from) || isNaN(until)) {
          console.warn("Skipped invalid CSV row:", row);
          continue;
        }

        newEntries.push({
          id: `RWD-${String(currentNextId++).padStart(3, "0")}`,
          validFrom: from,
          validUntil: until,
          rewardPoints: points,
          comments: row.Comments || row.comments || "Imported via CSV",
          status: (row.Status || row.status || "Active") as RewardStatus,
          userType: (row.UserType || row.userType || "Rider") as UserType,
        });
      }

      if (newEntries.length > 0) {
        setRewards((prev) => [...prev, ...newEntries]);
        setNextId(currentNextId);
        showMessage(
          `${newEntries.length} rewards imported successfully from CSV.`,
          "success"
        );
      } else {
        showMessage(
          "No valid rewards found in the imported CSV file.",
          "error"
        );
      }

      // Clear file input
      e.target.value = "";
    };
    reader.onerror = () => {
      showMessage("Error reading file.", "error");
    };
    reader.readAsText(file);
  };

  // --- STYLE UTILITIES ---

  // Dynamic class for row color based on days left
  const getRowClass = (daysLeft: number) => {
    if (daysLeft < 0) return "bg-red-50 border-red-200"; // Expired
    if (daysLeft <= EXPIRING_SOON_DAYS) return "bg-yellow-50 border-yellow-200"; // Expiring Soon
    return "bg-white border-gray-100"; // Active
  };

  const getDaysLeftBadge = (daysLeft: number) => {
    if (daysLeft < 0)
      return (
        <span className="flex items-center text-sm font-medium text-red-600">
          <XCircle className="w-4 h-4 mr-1" /> Expired ({Math.abs(daysLeft)}d
          ago)
        </span>
      );
    if (daysLeft === 0)
      return (
        <span className="flex items-center text-sm font-bold text-red-700">
          <AlertTriangle className="w-4 h-4 mr-1" /> Expires Today!
        </span>
      );
    if (daysLeft <= EXPIRING_SOON_DAYS)
      return (
        <span className="flex items-center text-sm font-medium text-yellow-700">
          <AlertTriangle className="w-4 h-4 mr-1" /> {daysLeft} Days Left
        </span>
      );
    return (
      <span className="flex items-center text-sm text-gray-700">
        <CheckCircle className="w-4 h-4 mr-1 text-green-500" /> {daysLeft} Days
        Left
      </span>
    );
  };

  const renderSortIndicator = (key: keyof Reward | "daysLeft") => {
    if (sortConfig.key !== key) return null;
    return sortConfig.ascending ? (
      <ArrowUp className="w-3 h-3 ml-1" />
    ) : (
      <ArrowDown className="w-3 h-3 ml-1" />
    );
  };

  // --- RENDER ---

  const TableHeader = ({
    columnKey,
    title,
    className = "",
  }: {
    columnKey: keyof Reward | "daysLeft";
    title: string;
    className?: string;
  }) => (
    <th
      onClick={() => toggleSort(columnKey)}
      className={`px-6 py-3 text-xs font-bold text-white uppercase tracking-wider cursor-pointer transition-colors hover:bg-opacity-90 ${className}`}
      style={{ backgroundColor: EcoGoGreen }}
    >
      <div className="flex items-center justify-between">
        {title}
        {renderSortIndicator(columnKey)}
      </div>
    </th>
  );

  return (
    <div className="min-h-screen p-6 md:p-10 bg-gray-50 font-inter text-gray-800">
      {/* Toast Message Display */}
      {message && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-xl text-white font-semibold flex items-center gap-2 ${
            message.type === "success"
              ? "bg-green-500"
              : message.type === "error"
              ? "bg-red-500"
              : "bg-blue-500"
          }`}
        >
          {message.type === "success" && <CheckCircle className="w-5 h-5" />}
          {message.type === "error" && <XCircle className="w-5 h-5" />}
          {message.type === "info" && <Clock className="w-5 h-5" />}
          {message.text}
        </div>
      )}

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 flex items-center gap-3">
          <Award className="w-8 h-8" style={{ color: EcoGoGreen }} />
          EcoGo Rewards Admin Dashboard
        </h1>
        <p className="text-gray-500 mt-1">
          Manage, filter, and track all user reward promotions for Riders,
          Students, and Pet Deliveries.
        </p>
      </div>

      {/* Filters & CSV Actions */}
      <div className="max-w-7xl mx-auto bg-white p-6 rounded-xl shadow-lg mb-8 border border-gray-100">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">
          Filter & Data Operations
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 items-end">
          {/* Date Range Filters */}
          <div className="col-span-1 md:col-span-2 grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">
                Valid From
              </label>
              <input
                type="date"
                value={filters.from}
                onChange={(e) =>
                  setFilters({ ...filters, from: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-green-500"
                style={
                  { "--tw-ring-color": EcoGoGreenRings } as React.CSSProperties
                }
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">
                Valid Until
              </label>
              <input
                type="date"
                value={filters.to}
                onChange={(e) => setFilters({ ...filters, to: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-green-500"
                style={
                  { "--tw-ring-color": EcoGoGreenRings } as React.CSSProperties
                }
              />
            </div>
          </div>

          {/* Search Filter */}
          <div className="col-span-1">
            <label className="text-xs font-medium text-gray-500 block mb-1">
              Search Keywords
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
                placeholder="Points, Comments, ID, or Type"
                className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:border-green-500"
                style={
                  { "--tw-ring-color": EcoGoGreenRings } as React.CSSProperties
                }
              />
            </div>
          </div>

          {/* CSV Actions */}
          <div className="col-span-1 md:col-span-2 flex justify-end gap-3">
            <button
              onClick={exportCSV}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg shadow-md transition-all hover:opacity-90"
              style={{ backgroundColor: EcoGoGreen }}
            >
              <Download className="w-4 h-4" /> Export CSV (
              {sortedAndFilteredRewards.length})
            </button>
            <label className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg shadow-md transition-all cursor-pointer hover:bg-gray-200">
              <Upload className="w-4 h-4" /> Import CSV
              <input
                type="file"
                accept=".csv"
                onChange={handleCSVUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Rewards Table */}
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold">
            Reward Catalogue ({rewards.length} Total)
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left table-auto">
            <thead className="sticky top-0 shadow-sm">
              <tr>
                <TableHeader columnKey="id" title="ID" className="w-1/12" />
                <TableHeader
                  columnKey="validFrom"
                  title="Valid From"
                  className="w-1/12"
                />
                <TableHeader
                  columnKey="validUntil"
                  title="Valid Until"
                  className="w-1/12"
                />
                <TableHeader
                  columnKey="daysLeft"
                  title="Time Left"
                  className="w-1/12"
                />
                <TableHeader
                  columnKey="rewardPoints"
                  title="Points"
                  className="w-[8%]"
                />
                <TableHeader
                  columnKey="userType"
                  title="User Type"
                  className="w-[10%]"
                />
                <TableHeader
                  columnKey="status"
                  title="Status"
                  className="w-[8%]"
                />
                <TableHeader
                  columnKey="comments"
                  title="Comments"
                  className="w-3/12"
                />
                <TableHeader
                  columnKey="id"
                  title="Actions"
                  className="w-1/12"
                />
              </tr>
            </thead>

            <tbody>
              {/* Add New Reward Row */}
              <tr
                className="border-b-4 border-dashed"
                style={{ backgroundColor: EcoGoLightGreen }}
              >
                <td className="p-2 text-sm text-gray-500 font-bold">
                  New ID: RWD-{String(nextId).padStart(3, "0")}
                </td>
                <td className="p-2">
                  <input
                    type="date"
                    value={newReward.validFrom}
                    onChange={(e) =>
                      setNewReward({ ...newReward, validFrom: e.target.value })
                    }
                    className="w-full p-1 border rounded focus:ring-1 focus:ring-green-500"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="date"
                    value={newReward.validUntil}
                    onChange={(e) =>
                      setNewReward({ ...newReward, validUntil: e.target.value })
                    }
                    className="w-full p-1 border rounded focus:ring-1 focus:ring-green-500"
                  />
                </td>
                <td className="p-2 text-gray-500 text-sm italic">
                  {newReward.validFrom && newReward.validUntil
                    ? format(
                        new Date(newReward.validUntil).getTime() - Date.now(),
                        "d"
                      ) + " days"
                    : "Pending..."}
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    value={
                      newReward.rewardPoints === 0 ? "" : newReward.rewardPoints
                    }
                    onChange={(e) =>
                      setNewReward({
                        ...newReward,
                        rewardPoints: Number(e.target.value),
                      })
                    }
                    placeholder="Points"
                    min="1"
                    className="w-full p-1 border rounded text-center focus:ring-1 focus:ring-green-500"
                  />
                </td>
                <td className="p-2 relative">
                  <select
                    value={newReward.userType}
                    onChange={(e) =>
                      setNewReward({
                        ...newReward,
                        userType: e.target.value as UserType,
                      })
                    }
                    className="w-full p-1 border rounded focus:ring-1 focus:ring-green-500 appearance-none bg-white"
                  >
                    <option value="Rider">Rider</option>
                    <option value="Student">Student</option>
                    <option value="Pet Delivery">Pet Delivery</option>
                  </select>
                  <ChevronDown className="w-3 h-3 text-gray-400 pointer-events-none absolute right-4 top-1/2 -translate-y-1/2" />
                </td>
                <td className="p-2">
                  <select
                    value={newReward.status}
                    onChange={(e) =>
                      setNewReward({
                        ...newReward,
                        status: e.target.value as RewardStatus,
                      })
                    }
                    className="w-full p-1 border rounded focus:ring-1 focus:ring-green-500 appearance-none bg-white"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </td>
                <td className="p-2">
                  <input
                    type="text"
                    value={newReward.comments}
                    onChange={(e) =>
                      setNewReward({ ...newReward, comments: e.target.value })
                    }
                    placeholder="Description/Goal"
                    className="w-full p-1 border rounded focus:ring-1 focus:ring-green-500"
                  />
                </td>
                <td className="p-2 text-center">
                  <button
                    onClick={handleAddNew}
                    disabled={
                      !newReward.validFrom ||
                      !newReward.validUntil ||
                      newReward.rewardPoints <= 0
                    }
                    className="w-full flex items-center justify-center gap-1 px-3 py-1 text-sm font-semibold text-white rounded-lg shadow transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: EcoGoGreen }}
                  >
                    <Plus className="w-4 h-4" /> Add
                  </button>
                </td>
              </tr>

              {/* Existing Rewards */}
              {sortedAndFilteredRewards.length > 0 ? (
                sortedAndFilteredRewards.map((r) => (
                  <tr
                    key={r.id}
                    className={`border-b transition-all ${getRowClass(
                      r.daysLeft
                    )} hover:bg-opacity-70`}
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {r.id}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <input
                        type="date"
                        value={format(r.validFrom, "yyyy-MM-dd")}
                        onChange={(e) =>
                          handleInlineUpdate(r.id, "validFrom", e.target.value)
                        }
                        className="p-1 border border-gray-300 rounded focus:ring-1 focus:ring-green-500 w-full bg-transparent"
                      />
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <input
                        type="date"
                        value={format(r.validUntil, "yyyy-MM-dd")}
                        onChange={(e) =>
                          handleInlineUpdate(r.id, "validUntil", e.target.value)
                        }
                        className="p-1 border border-gray-300 rounded focus:ring-1 focus:ring-green-500 w-full bg-transparent"
                      />
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold">
                      {getDaysLeftBadge(r.daysLeft)}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-center">
                      <input
                        type="number"
                        value={r.rewardPoints}
                        onChange={(e) =>
                          handleInlineUpdate(
                            r.id,
                            "rewardPoints",
                            e.target.value
                          )
                        }
                        className="p-1 border border-gray-300 rounded text-center focus:ring-1 focus:ring-green-500 w-full bg-transparent"
                      />
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <select
                        value={r.userType}
                        onChange={(e) =>
                          handleInlineUpdate(r.id, "userType", e.target.value)
                        }
                        className="p-1 border border-gray-300 rounded focus:ring-1 focus:ring-green-500 w-full bg-transparent"
                      >
                        <option value="Rider">Rider</option>
                        <option value="Student">Student</option>
                        <option value="Pet Delivery">Pet Delivery</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <select
                        value={r.status}
                        onChange={(e) =>
                          handleInlineUpdate(r.id, "status", e.target.value)
                        }
                        className="p-1 border border-gray-300 rounded focus:ring-1 focus:ring-green-500 w-full bg-transparent"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <input
                        type="text"
                        value={r.comments}
                        onChange={(e) =>
                          handleInlineUpdate(r.id, "comments", e.target.value)
                        }
                        className="p-1 border border-gray-300 rounded focus:ring-1 focus:ring-green-500 w-full bg-transparent"
                      />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleDelete(r.id)}
                        className="p-2 text-white bg-red-500 rounded-full shadow-md hover:bg-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={9}
                    className="py-10 text-center text-gray-500 text-lg bg-gray-50"
                  >
                    <Search className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                    No rewards match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
