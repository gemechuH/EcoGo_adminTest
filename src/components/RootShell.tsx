"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { LoginPage } from "@/components/LoginPage";
import { DashboardPage } from "@/components/DashboardPage";
import { UsersPage } from "@/components/UsersPage";
import { DriversPage } from "@/components/DriversPage";
import { RidersPage } from "@/components/RidersPage";
import { AdminsPage } from "@/components/AdminsPage";
import { OperatorsPage } from "@/components/OperatorsPage";
import { BookingsPage } from "@/components/BookingsPage";
import { ReportsPage } from "@/components/ReportsPage";
import { SettingsPage } from "@/components/SettingsPage";
import ComingSoon from "@/components/ComingSoon";
import { auth, db } from "@/firebase/config";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "sonner";
import { UserRole } from "@/types";

// Cache to reduce flicker between navigations
let __ROOT_SHELL_CACHE: {
  isLoggedIn: boolean;
  userRole: UserRole;
  userName: string;
} | null = null;

export function RootShell() {
  const router = useRouter();
  const pathname = usePathname();

  const [mounted, setMounted] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [routeLoading, setRouteLoading] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(
    __ROOT_SHELL_CACHE?.isLoggedIn ?? false
  );
  const [userRole, setUserRole] = useState<UserRole>(
    __ROOT_SHELL_CACHE?.userRole ?? "admin"
  );
  const [userName, setUserName] = useState(__ROOT_SHELL_CACHE?.userName ?? "");
  const [currentPage, setCurrentPage] = useState("dashboard");

  useEffect(() => setMounted(true), []);

  // Track route changes for loading indicator & current page
  useEffect(() => {
    if (!mounted) return;
    const page = pathname.replace(/^\//, "");
    setCurrentPage(page);
    setRouteLoading(true);
    const t = setTimeout(() => setRouteLoading(false), 160);
    return () => clearTimeout(t);
  }, [pathname, mounted]);

  // Auth subscription
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          setIsLoggedIn(true);
          const email = user.email || "";
          let computedName = email
            ? email.split("@")[0].replace(/\./g, " ")
            : "";
          try {
            const adminRef = doc(db, "admins", user.uid);
            const snap = await getDoc(adminRef);
            if (snap.exists()) {
              const data = snap.data() as {
                role?: UserRole;
                firstName?: string;
                lastName?: string;
              };
              if (data.role === "admin" || data.role === "operator")
                setUserRole(data.role);
              if (data.firstName || data.lastName) {
                const name = [data.firstName, data.lastName]
                  .filter(Boolean)
                  .join(" ");
                if (name) computedName = name;
              }
            } else {
              const role = (typeof window !== "undefined" &&
                localStorage.getItem("ecogo.userRole")) as UserRole | null;
              if (role === "admin" || role === "operator") setUserRole(role);
            }
          } catch {}
          setUserName(computedName);
          __ROOT_SHELL_CACHE = {
            isLoggedIn: true,
            userRole,
            userName: computedName,
          };
        } else {
          setIsLoggedIn(false);
          setUserName("");
          __ROOT_SHELL_CACHE = { isLoggedIn: false, userRole, userName: "" };
        }
      } finally {
        setAuthChecking(false);
      }
    });
    return () => unsub();
  }, [pathname, router, userRole]);

  const handleLogin = async (
    email: string,
    password: string,
    role: UserRole
  ) => {
    try {
      localStorage.setItem("ecogo.userRole", role);
    } catch {}
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Navigate to dashboard only after explicit login
      router.push("/dashboard");
    } catch (e) {
      const code = (e as any)?.code as string | undefined;
      const message = getFriendlyAuthError(code);
      toast.error(message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch {}
    setIsLoggedIn(false);
    setUserName("");
    __ROOT_SHELL_CACHE = { isLoggedIn: false, userRole, userName: "" };
    router.push("/");
  };

  const handleNavigate = (page: string) => {
    router.push(`/${page}`);
  };

  function getFriendlyAuthError(code?: string): string {
    switch (code) {
      case "auth/invalid-credential":
      case "auth/wrong-password":
        return "Incorrect email or password. Please try again.";
      case "auth/user-not-found":
        return "No account found for this email.";
      case "auth/invalid-email":
        return "Please enter a valid email address.";
      case "auth/too-many-requests":
        return "Too many attempts. Please wait a moment and try again.";
      case "auth/network-request-failed":
        return "Network error. Check your connection and try again.";
      default:
        return "Sign-in failed. Please try again or contact support.";
    }
  }

  const adminOnly = new Set([
    "users",
    "drivers",
    "riders",
    "admins",
    "operators",
    "settings",
  ]);

  const renderPage = () => {
    if (!isLoggedIn) return <LoginPage onLogin={handleLogin} />;
    if (adminOnly.has(currentPage) && userRole !== "admin")
      return <ComingSoon />;
    switch (currentPage) {
      case "dashboard":
        return <DashboardPage />;
      case "users":
        return <UsersPage />;
      case "drivers":
        return <DriversPage />;
      case "riders":
        return <RidersPage />;
      case "admins":
        return <AdminsPage />;
      case "operators":
        return <OperatorsPage />;
      case "bookings":
        return <BookingsPage />;
      case "reports":
        return <ReportsPage userRole={userRole} />;
      case "settings":
        return <SettingsPage />;
      case "refunds":
        return <ComingSoon />;
      case "safety":
        return <ComingSoon />;
      default:
        return <ComingSoon />; // fallback
    }
  };

  // While mounting/auth checking: show loader
  if (!mounted || authChecking) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[#2DB85B] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If not logged in: show login page only (no sidebar)
  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // If logged in at '/', prefer to render dashboard content without redirect
  const effectivePage = currentPage || "dashboard";

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        currentPage={effectivePage}
        onNavigate={handleNavigate}
        userRole={userRole}
        userName={userName}
        onLogout={handleLogout}
      />
      <main className="flex-1 overflow-y-auto">
        {(() => {
          if (adminOnly.has(effectivePage) && userRole !== "admin")
            return <ComingSoon />;
          switch (effectivePage) {
            case "dashboard":
              return <DashboardPage />;
            case "users":
              return <UsersPage />;
            case "drivers":
              return <DriversPage />;
            case "riders":
              return <RidersPage />;
            case "admins":
              return <AdminsPage />;
            case "operators":
              return <OperatorsPage />;
            case "bookings":
              return <BookingsPage />;
            case "reports":
              return <ReportsPage userRole={userRole} />;
            case "settings":
              return <SettingsPage />;
            case "refunds":
              return <ComingSoon />;
            case "safety":
              return <ComingSoon />;
            default:
              return <ComingSoon />;
          }
        })()}
      </main>
      {routeLoading && (
        <div className="fixed top-0 left-0 right-0 h-1 bg-linear-to-r from-[#2DB85B] via-[#66cc88] to-[#2DB85B] animate-pulse z-50" />
      )}
    </div>
  );
}

export default RootShell;
