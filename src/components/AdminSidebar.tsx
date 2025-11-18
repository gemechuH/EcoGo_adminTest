"use client";

import { FC } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "../../src/firebase/config";
import Link from "next/link";

interface AdminSidebarProps {
  name?: string;
  email?: string;
  role?: string;
}

const AdminSidebar: FC<AdminSidebarProps> = ({ name, email, role }) => {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <div className="w-64 bg-emerald-700 text-white flex flex-col p-6 shadow-xl">
      <h1 className="text-3xl font-extrabold mb-10 tracking-wider">EcoGO</h1>

      {/* Admin Info */}
      <div className="mb-8 p-3 rounded-lg bg-emerald-800/50">
        <p className="text-sm font-semibold truncate">{name || "Admin User"}</p>
        {/* <p className="text-xs opacity-75 truncate">{email || "N/A"}</p> */}
      </div>

      {/* Navigation Links */}
      <nav className="flex-grow">
        <Link
          href="/admin"
          className="flex items-center p-3 rounded-lg text-lg font-medium bg-emerald-800 hover:bg-emerald-600 transition duration-150 mb-2"
        >
          Dashboard
        </Link>
        
          <Link
            href="/admin/wallet"
            className="w-full flex items-center p-3 rounded-lg text-lg font-medium hover:bg-emerald-600 transition duration-150 mb-2 opacity-75"
          >
            Wallet
          </Link>
        
        <Link
          href="/admin/settings"
          className="flex items-center p-3 rounded-lg text-lg font-medium hover:bg-emerald-600 transition duration-150 mb-2 opacity-75"
        >
          Settings
        </Link>
      </nav>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="w-full bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition duration-150 shadow-md"
      >
        Logout
      </button>
    </div>
  );
};

export default AdminSidebar;
