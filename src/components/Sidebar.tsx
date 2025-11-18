"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Settings,
  FileText,
  LogOut,
  Shield,
  Menu,
  X,
} from "lucide-react";

import { UserRole } from "@/types";
import Image from "next/image";
import logo from "../assets/ecogo-logo.png";

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  userRole: UserRole;
  userName: string;
  onLogout: () => void;
}

export function Sidebar({
  currentPage,
  onNavigate,
  userRole,
  userName,
  onLogout,
}: SidebarProps) {
  const [isUserMenuExpanded, setIsUserMenuExpanded] = useState(false);
  const [isOperationsExpanded, setIsOperationsExpanded] = useState(false);
  const [isSystemExpanded, setIsSystemExpanded] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // for small screens

  const adminMenuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "users", label: "Users", icon: Users },
    { id: "operations", label: "Operations", icon: Calendar },
    { id: "system", label: "System", icon: Settings },
  ];

  const operatorMenuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "bookings", label: "Bookings", icon: Calendar },
    { id: "reports", label: "Reports", icon: FileText },
  ];

  const menuItems = userRole === "admin" ? adminMenuItems : operatorMenuItems;

  const userManagementItems = [
    { id: "drivers", label: "Drivers", count: 4 },
    { id: "riders", label: "Riders", count: 6 },
    { id: "admins", label: "Admins", count: 5 },
    { id: "operators", label: "Operators", count: 4 },
  ];

  const showUsersMenu = isUserMenuExpanded;

  return (
    <>
      {/* Small screen toggler */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded  text-black shadow"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? (
          <X className="w-4 h-4" />
        ) : (
          <Menu className="w-4 h-4" />
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-full z-40 w-70 flex flex-col transition-transform duration-300 ease-in-out
        bg-[var(--charcoal-dark)] ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Logo Section */}
        <div className="p-6">
          <div className="flex items-center gap-3">
            <Image
              src={logo}
              alt="EcoGo Logo"
              width={60}
              height={60}
              className="rounded-[10px]"
            />
            <div>
              <h3 className="text-white">EcoGo</h3>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="px-6 py-2 mb-2">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm uppercase tracking-wide font-semibold pl-3 text-white">
              {userRole}
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            // Users submenu
            if (item.id === "users") {
              return (
                <div key={item.id}>
                  <div
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1"
                    style={{ backgroundColor: "transparent", color: "white" }}
                  >
                    <input
                      type="checkbox"
                      checked={isUserMenuExpanded}
                      onChange={(e) => setIsUserMenuExpanded(e.target.checked)}
                      className="accent-[#2DB85B] w-4 h-4"
                      aria-label="Toggle Users section"
                    />
                    <span className="flex-1 text-left">{item.label}</span>
                  </div>
                  {showUsersMenu && (
                    <div className="ml-4 mb-2 space-y-1">
                      {userManagementItems.map((subItem) => (
                        <button
                          key={subItem.id}
                          onClick={() => onNavigate(subItem.id)}
                          className="w-full flex items-center justify-between px-4 py-2 rounded-lg cursor-pointer transition-colors text-sm"
                          style={{
                            backgroundColor: "transparent",
                            color: "white",
                          }}
                        >
                          <span>{subItem.label}</span>
                          <span className="px-2 py-0.5 rounded text-xs">
                            {subItem.count}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors"
                style={{
                  backgroundColor: "transparent",
                  color: "white",
                }}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 cursor-pointer rounded-lg transition-colors"
            style={{ color: "white", backgroundColor: "gray-500" }}
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>

        {/* Footer */}
        <div className="p-4 text-center text-xs text-gray-400">
          © 2025 EcoGo Canada
        </div>
      </aside>
    </>
  );
}
