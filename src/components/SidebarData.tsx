import {
  LayoutDashboard,
  Users,
  Calendar,
  Settings,
  FileText,
  Truck,
  MapPin,
  Activity,
  Layers,
  DollarSign,
  CreditCard,
  Percent,
  MessageSquare,
  Megaphone,
  Gift,
  Bell,
  BarChart,
  PieChart,
} from "lucide-react";

export const adminMenuItems = [
  {
    id: "dashboard",
    label: "Admin Dashboard",
    icon: LayoutDashboard,
    isDropdown: false,
  },
  {
    id: "users",
    label: "Users",
    icon: Users,
    isDropdown: true,
    children: [
      { id: "drivers", label: "Drivers" },
      { id: "riders", label: "Riders" },
      { id: "admins", label: "Admins" },
      { id: "operators", label: "Operators" },
      { id: "driver-applications", label: "Driver Applications" },
    ],
  },
  {
    id: "operations",
    label: "Operations",
    icon: Activity,
    isDropdown: true,
    children: [
      { id: "operations/live-tracking", label: "Live Tracking" },
      { id: "operations/pending-rides", label: "Pending Rides" },
      { id: "operations/scheduled-rides", label: "Scheduled Rides" },
      { id: "operations/completed-history", label: "Completed History" },
      { id: "operations/cancelled-rides", label: "Cancelled Rides" },
      { id: "operations/driver-performance", label: "Driver Performance" },
      { id: "operations/heatmap", label: "Heatmap / Demand Zones" },
    ],
  },
  {
    id: "fleet",
    label: "Fleet Management",
    icon: Truck,
    isDropdown: true,
    children: [
      { id: "fleet/vehicles", label: "Vehicles" },
      { id: "fleet/vehicle-types", label: "Vehicle Types" },
      { id: "fleet/vehicle-documents", label: "Vehicle Documents" },
      { id: "fleet/maintenance", label: "Maintenance Logs" },
    ],
  },
  {
    id: "finance",
    label: "Finance & Payments",
    icon: DollarSign,
    isDropdown: true,
    children: [
      { id: "finance/driver-payouts", label: "Driver Payouts" },
      { id: "finance/rider-payments", label: "Rider Payments" },
      { id: "finance/withdrawals", label: "Withdrawal Requests" },
      { id: "finance/commissions", label: "Commissions & Earnings" },
      { id: "promo-codes", label: "Promo Codes" },
      { id: "transactions", label: "Transactions" },
    ],
  },

  {
    id: "support",
    label: "Complaints & Support",
    icon: MessageSquare,
    isDropdown: true,
    children: [
      { id: "support/ride-complaints", label: "Ride Complaints" },
      { id: "support/driver-complaints", label: "Driver Complaints" },
      { id: "support/rider-complaints", label: "Rider Complaints" },
      { id: "support/tickets", label: "Support Tickets" },
    ],
  },
  {
    id: "marketing",
    label: "Marketing Tools",
    icon: Megaphone,
    isDropdown: true,
    children: [
      { id: "marketing/referral", label: "Referral Program" },
      { id: "marketing/rewards", label: "Reward Points" },
      { id: "marketing/campaigns", label: "Promotional Campaigns" },
      { id: "marketing/broadcast", label: "Broadcast Notifications" },
    ],
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    isDropdown: true,
    children: [
      {
        id: "settings/general",
        label: "General",
        children: [
          { id: "settings/general/system", label: "System" },
          { id: "settings/general/profile", label: "Profile" },
        ],
      },
      { id: "settings/config", label: "Configuration" },
      { id: "settings/pricing", label: "Pricing Rules" },
      { id: "settings/notifications", label: "Notification Settings" },
      { id: "settings/api", label: "API Keys" },
      { id: "settings/audit", label: "Audit Logs" },
    ],
  },
  {
    id: "reports",
    label: "Reports",
    icon: BarChart,
    isDropdown: true,
    children: [
      { id: "reports/ride-reports", label: "Ride Reports" },
      { id: "reports/driver-reports", label: "Driver Reports" },
      { id: "reports/revenue-reports", label: "Revenue Reports" },
      { id: "reports/payout-reports", label: "Payout Reports" },
    ],
  },
];


export const operatorMenuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    isDropdown: false,
  },
  { id: "bookings", label: "Bookings", icon: Calendar, isDropdown: false },
  { id: "reports", label: "Reports", icon: FileText, isDropdown: false },
];

export default adminMenuItems;