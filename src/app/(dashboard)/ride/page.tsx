"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  Car,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Gift,
  Calendar,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Activity,
  DollarSign,
  MapPin,
  Timer,
  AlertCircle,
  FileText,
  BarChart3,
  PieChart,
  Zap,
  Star,
  Route,
  UserCheck,
  CarFront,
  Hourglass,
  CircleDollarSign,
  Eye,
} from "lucide-react";

// --- UI COMPONENTS ---
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

// --- MOCK DATA ---
const generateStats = () => {
  // Today's stats
  const todayCompleted = Math.floor(Math.random() * 50) + 80;
  const todayCancelled = Math.floor(Math.random() * 15) + 5;
  const todayScheduled = Math.floor(Math.random() * 30) + 20;
  const todayPending = Math.floor(Math.random() * 20) + 10;
  const todayEarnings = (todayCompleted * 15.5 + Math.random() * 500).toFixed(
    2
  );
  const todayActiveDrivers = Math.floor(Math.random() * 30) + 45;
  const todayActiveRiders = Math.floor(Math.random() * 100) + 150;

  // Yesterday's stats (for comparison)
  const yesterdayCompleted = Math.floor(Math.random() * 50) + 75;
  const yesterdayCancelled = Math.floor(Math.random() * 15) + 8;
  const yesterdayEarnings = (
    yesterdayCompleted * 15.5 +
    Math.random() * 500
  ).toFixed(2);

  // Weekly stats
  const weekCompleted = todayCompleted * 7 + Math.floor(Math.random() * 100);
  const weekCancelled = todayCancelled * 7 + Math.floor(Math.random() * 30);
  const weekEarnings = (
    parseFloat(todayEarnings) * 7 +
    Math.random() * 2000
  ).toFixed(2);
  const weekNewRiders = Math.floor(Math.random() * 50) + 30;

  // Calculate trends
  const completedTrend = Math.round(
    ((todayCompleted - yesterdayCompleted) / yesterdayCompleted) * 100
  );
  const cancelledTrend = Math.round(
    ((todayCancelled - yesterdayCancelled) / yesterdayCancelled) * 100
  );
  const earningsTrend = Math.round(
    ((parseFloat(todayEarnings) - parseFloat(yesterdayEarnings)) /
      parseFloat(yesterdayEarnings)) *
      100
  );

  return {
    today: {
      completed: todayCompleted,
      cancelled: todayCancelled,
      scheduled: todayScheduled,
      pending: todayPending,
      earnings: todayEarnings,
      activeDrivers: todayActiveDrivers,
      activeRiders: todayActiveRiders,
      totalRides:
        todayCompleted + todayCancelled + todayScheduled + todayPending,
    },
    week: {
      completed: weekCompleted,
      cancelled: weekCancelled,
      earnings: weekEarnings,
      newRiders: weekNewRiders,
      avgRidesPerDay: Math.round(weekCompleted / 7),
    },
    trends: {
      completed: completedTrend,
      cancelled: cancelledTrend,
      earnings: earningsTrend,
    },
    rewards: {
      totalPoints: 125000,
      redeemed: 45000,
      activeUsers: 320,
    },
  };
};

const STATS = generateStats();

// Recent activities
const RECENT_ACTIVITIES = [
  {
    id: 1,
    type: "completed",
    message: "Ride #1234 completed successfully",
    time: "2 min ago",
    icon: CheckCircle,
    color: "text-emerald-600 bg-emerald-50",
  },
  {
    id: 2,
    type: "cancelled",
    message: "Ride #1235 cancelled by rider",
    time: "5 min ago",
    icon: XCircle,
    color: "text-gray-700 bg-gray-100",
  },
  {
    id: 3,
    type: "scheduled",
    message: "New scheduled ride for tomorrow 9 AM",
    time: "10 min ago",
    icon: Calendar,
    color: "text-blue-600 bg-blue-50",
  },
  {
    id: 4,
    type: "completed",
    message: "Ride #1233 completed - $24.50",
    time: "15 min ago",
    icon: CheckCircle,
    color: "text-emerald-600 bg-emerald-50",
  },
  {
    id: 5,
    type: "reward",
    message: "User earned 500 points",
    time: "20 min ago",
    icon: Gift,
    color: "text-purple-600 bg-purple-50",
  },
  {
    id: 6,
    type: "pending",
    message: "New ride request from Downtown",
    time: "25 min ago",
    icon: Clock,
    color: "text-amber-600 bg-amber-50",
  },
];

// Quick links data
const QUICK_LINKS = [
  {
    title: "Ride Requests",
    description: "Manage incoming ride requests",
    href: "/ride/ride-requests",
    icon: FileText,
    color: "bg-blue-500",
    stats: { value: STATS.today.pending, label: "Pending" },
  },
  {
    title: "Completed Rides",
    description: "View completed ride history",
    href: "/ride/completed",
    icon: CheckCircle,
    color: "bg-emerald-500",
    stats: { value: STATS.today.completed, label: "Today" },
  },
  {
    title: "Cancelled Rides",
    description: "Analyze cancellation reasons",
    href: "/ride/cancelled",
    icon: XCircle,
    color: "bg-gray-700",
    stats: { value: STATS.today.cancelled, label: "Today" },
  },
  {
    title: "Scheduled Rides",
    description: "Upcoming scheduled rides",
    href: "/ride/scheduled",
    icon: Calendar,
    color: "bg-indigo-500",
    stats: { value: STATS.today.scheduled, label: "Upcoming" },
  },
  {
    title: "Customer Rides",
    description: "Customer ride history",
    href: "/ride/customer-rides",
    icon: Users,
    color: "bg-cyan-500",
    stats: { value: STATS.today.activeRiders, label: "Active" },
  },
  {
    title: "Rewards",
    description: "Manage rewards & points",
    href: "/ride/rewards",
    icon: Gift,
    color: "bg-purple-500",
    stats: { value: STATS.rewards.activeUsers, label: "Users" },
  },
];

// --- COMPONENT ---
export default function RideDashboard() {
  const [timeFilter, setTimeFilter] = useState<"today" | "week" | "month">(
    "today"
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      {/* Page Header */}
      <div className="mb-6">
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white px-2 py-2 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Ride Dashboard</h1>
            </div>
            
          </div>
        </div>
        <p className="text-black text-sm mt-1 pl-2">
          Overview and management of all ride operations
        </p>
      </div>

      {/* Time Filter Tabs */}
      <div className="flex items-center gap-2 mb-6">
        {[
          { key: "today", label: "Today", icon: <Zap className="w-4 h-4" /> },
          {
            key: "week",
            label: "This Week",
            icon: <Calendar className="w-4 h-4" />,
          },
          {
            key: "month",
            label: "This Month",
            icon: <BarChart3 className="w-4 h-4" />,
          },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setTimeFilter(tab.key as typeof timeFilter)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              timeFilter === tab.key
                ? "bg-gray-900 text-white shadow-sm"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {/* Total Rides */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 rounded-lg bg-blue-50">
              <Car className="w-5 h-5 text-blue-600" />
            </div>
            <span
              className={`text-xs font-medium flex items-center gap-1 ${
                STATS.trends.completed >= 0
                  ? "text-emerald-600"
                  : "text-gray-600"
              }`}
            >
              {STATS.trends.completed >= 0 ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {Math.abs(STATS.trends.completed)}%
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {STATS.today.totalRides}
          </p>
          <p className="text-xs text-gray-500 mt-1">Total Rides Today</p>
        </Card>

        {/* Completed */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 rounded-lg bg-emerald-50">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="text-xs font-medium text-emerald-600 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {STATS.trends.completed}%
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {STATS.today.completed}
          </p>
          <p className="text-xs text-gray-500 mt-1">Completed</p>
        </Card>

        {/* Cancelled */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 rounded-lg bg-gray-100">
              <XCircle className="w-5 h-5 text-gray-700" />
            </div>
            <span
              className={`text-xs font-medium flex items-center gap-1 ${
                STATS.trends.cancelled > 0
                  ? "text-gray-700"
                  : "text-emerald-600"
              }`}
            >
              {STATS.trends.cancelled > 0 ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {Math.abs(STATS.trends.cancelled)}%
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {STATS.today.cancelled}
          </p>
          <p className="text-xs text-gray-500 mt-1">Cancelled</p>
        </Card>

        {/* Scheduled */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 rounded-lg bg-indigo-50">
              <Calendar className="w-5 h-5 text-indigo-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {STATS.today.scheduled}
          </p>
          <p className="text-xs text-gray-500 mt-1">Scheduled</p>
        </Card>

        {/* Earnings */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 rounded-lg bg-green-50">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <span
              className={`text-xs font-medium flex items-center gap-1 ${
                STATS.trends.earnings >= 0
                  ? "text-emerald-600"
                  : "text-gray-600"
              }`}
            >
              {STATS.trends.earnings >= 0 ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {Math.abs(STATS.trends.earnings)}%
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            ${STATS.today.earnings}
          </p>
          <p className="text-xs text-gray-500 mt-1">Earnings Today</p>
        </Card>

        {/* Active Drivers */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 rounded-lg bg-amber-50">
              <CarFront className="w-5 h-5 text-amber-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {STATS.today.activeDrivers}
          </p>
          <p className="text-xs text-gray-500 mt-1">Active Drivers</p>
        </Card>
      </div>

      {/* Quick Navigation Cards */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Quick Navigation
          </h2>
          <span className="text-sm text-gray-500">
            Manage all ride operations
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {QUICK_LINKS.map((link) => (
            <Link key={link.href} href={link.href}>
              <Card className="p-4 hover:shadow-md transition-all hover:border-gray-200 cursor-pointer group">
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-xl ${link.color}`}>
                    <link.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">
                      {link.stats.value}
                    </p>
                    <p className="text-xs text-gray-500">{link.stats.label}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors flex items-center gap-2">
                    {link.title}
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {link.description}
                  </p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Weekly Summary */}
        <Card className="lg:col-span-2 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-gray-600" />
              Weekly Summary
            </h2>
            <span className="text-sm text-gray-500">Last 7 days</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-500 mb-1">Total Completed</p>
              <p className="text-xl font-bold text-gray-900">
                {STATS.week.completed}
              </p>
              <p className="text-xs text-emerald-600 mt-1">
                +12% from last week
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-500 mb-1">Total Cancelled</p>
              <p className="text-xl font-bold text-gray-900">
                {STATS.week.cancelled}
              </p>
              <p className="text-xs text-gray-600 mt-1">-5% from last week</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-500 mb-1">Weekly Earnings</p>
              <p className="text-xl font-bold text-gray-900">
                ${STATS.week.earnings}
              </p>
              <p className="text-xs text-emerald-600 mt-1">
                +8% from last week
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-500 mb-1">New Riders</p>
              <p className="text-xl font-bold text-gray-900">
                {STATS.week.newRiders}
              </p>
              <p className="text-xs text-emerald-600 mt-1">
                +15% from last week
              </p>
            </div>
          </div>

          {/* Simple Bar Chart Visualization */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">
              Daily Ride Distribution
            </p>
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
              (day, idx) => {
                const completed = Math.floor(Math.random() * 30) + 70;
                const cancelled = Math.floor(Math.random() * 10) + 5;
                const total = completed + cancelled;
                return (
                  <div key={day} className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 w-8">{day}</span>
                    <div className="flex-1 h-2 bg-white border border-gray-200 rounded-full overflow-hidden flex">
                      <div
                        className="h-full bg-gray-900 transition-all"
                        style={{ width: `${(completed / total) * 100}%` }}
                      />
                      <div
                        className="h-full bg-gray-300 transition-all"
                        style={{ width: `${(cancelled / total) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-600 w-12 text-right">
                      {total}
                    </span>
                  </div>
                );
              }
            )}
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-gray-900" />
                <span className="text-xs text-gray-500">Completed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                <span className="text-xs text-gray-500">Cancelled</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Activity className="w-5 h-5 text-gray-600" />
              Recent Activity
            </h2>
            <button className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
              View All
            </button>
          </div>
          <div className="space-y-3">
            {RECENT_ACTIVITIES.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className={`p-2 rounded-lg ${activity.color}`}>
                  <activity.icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800 truncate">
                    {activity.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Bottom Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Performance Card */}
        <Card className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-emerald-50">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">
                Completion Rate
              </p>
              <p className="text-xs text-gray-500">Today&apos;s performance</p>
            </div>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-gray-900">
              {Math.round(
                (STATS.today.completed / STATS.today.totalRides) * 100
              )}
              %
            </span>
            <span className="text-sm text-emerald-600 mb-1">+3.2%</span>
          </div>
          <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full"
              style={{
                width: `${
                  (STATS.today.completed / STATS.today.totalRides) * 100
                }%`,
              }}
            />
          </div>
        </Card>

        {/* Average Wait Time */}
        <Card className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-amber-50">
              <Timer className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">Avg Wait Time</p>
              <p className="text-xs text-gray-500">Rider wait time</p>
            </div>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-gray-900">4.2</span>
            <span className="text-lg text-gray-500 mb-1">min</span>
          </div>
          <p className="text-xs text-emerald-600 mt-2">
            ↓ 0.5 min from yesterday
          </p>
        </Card>

        {/* Rewards Overview */}
        <Card className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-purple-50">
              <Gift className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">
                Rewards Program
              </p>
              <p className="text-xs text-gray-500">Points & redemption</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Points</span>
              <span className="text-sm font-semibold text-gray-900">
                {STATS.rewards.totalPoints.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Redeemed</span>
              <span className="text-sm font-semibold text-gray-900">
                {STATS.rewards.redeemed.toLocaleString()}
              </span>
            </div>
          </div>
        </Card>

        {/* Active Users */}
        <Card className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-blue-50">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">Active Users</p>
              <p className="text-xs text-gray-500">Currently online</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-2 bg-gray-50 rounded-lg text-center">
              <p className="text-xl font-bold text-gray-900">
                {STATS.today.activeRiders}
              </p>
              <p className="text-xs text-gray-500">Riders</p>
            </div>
            <div className="p-2 bg-gray-50 rounded-lg text-center">
              <p className="text-xl font-bold text-gray-900">
                {STATS.today.activeDrivers}
              </p>
              <p className="text-xs text-gray-500">Drivers</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions Footer */}
      <Card className="mt-6 p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gray-900">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-medium text-gray-800">Quick Actions</p>
              <p className="text-sm text-gray-500">Jump to common tasks</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/ride/ride-requests"
              className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              View Requests
            </Link>
            <Link
              href="/ride/completed"
              className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              View History
            </Link>
            <Link
              href="/ride/scheduled"
              className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              Scheduled
            </Link>
            <Link
              href="/ride/rewards"
              className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Gift className="w-4 h-4" />
              Rewards
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
