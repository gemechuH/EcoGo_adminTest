import type { Metadata } from "next";
import AppShell from "@/components/AppShell";

const titles: Record<string, string> = {
  dashboard: "Dashboard • EcoGo",
  users: "Users • EcoGo",
  drivers: "Drivers • EcoGo",
  riders: "Riders • EcoGo",
  admins: "Admins • EcoGo",
  operators: "Operators • EcoGo",
  bookings: "Bookings • EcoGo",
  reports: "Audit Logs • EcoGo",
  settings: "Settings • EcoGo",
};

export function generateStaticParams() {
  return Object.keys(titles).map((page) => ({ page }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ page: string }>;
}): Promise<Metadata> {
  const { page } = await params;
  const title = titles[page] ?? "EcoGo";
  return {
    title,
    description: "EcoGo Admin — clean, sustainable, friendly, efficient.",
    openGraph: { title, siteName: "EcoGo", type: "website" },
    twitter: { card: "summary", title },
  };
}

export default function DynamicPage() {
  return <AppShell />;
}
