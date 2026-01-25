import "./globals.css";

import AdminSidebar from "@/components/admin/sidebar";
import AuthGuard from "@/components/auth/auth-guard";
import AdminHeader from "@/components/admin/header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin panel for managing Shahzaib Autos business operations",
};

export default function AdminDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthGuard>
      <div className="h-screen overflow-hidden flex bg-background">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <AdminHeader />
          <main className="flex-1 overflow-y-auto p-4 md:p-8">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
