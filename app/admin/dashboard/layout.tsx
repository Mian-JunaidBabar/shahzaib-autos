import "./globals.css";

import AdminSidebar from "@/components/admin/sidebar";
import AuthGuard from "@/components/auth/auth-guard";
import AdminHeader from "@/components/admin/header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin panel for managing Shahzaib Autos business operations",
};

// Force dynamic rendering for all admin routes (uses cookies/session)
export const dynamic = "force-dynamic";

import { getServerSession } from "@/lib/services/auth.service";
import { redirect } from "next/navigation";

export default async function AdminDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();

  if (!session) {
    redirect("/admin/auth/login");
  }

  if (!session.user.isAdmin) {
    // Redirect to a 403 / 404 unauthorized page.
    redirect("/admin/auth/unauthorized");
  }
  return (
    <AuthGuard>
      <div className="h-screen overflow-hidden flex bg-background">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <AdminHeader />
          <main className="flex-1 overflow-y-auto m-0 p-0 light">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
