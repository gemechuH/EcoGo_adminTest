"use client";

import dynamic from "next/dynamic";

// Now dynamic works normally
const UserCreate = dynamic(() => import("@/components/UserCreate"), {
  ssr: false,
});

export default function UserCreatePage() {
  return (
    <div className="p-6">
      <UserCreate />
    </div>
  );
}
