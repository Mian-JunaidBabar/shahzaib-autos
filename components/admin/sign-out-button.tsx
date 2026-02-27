"use client";

import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function SignOutButton({
  collapsed = false,
}: {
  collapsed?: boolean;
}) {
  const { logout } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await logout();
      router.push("/admin/auth/login");
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleSignOut}
      disabled={isLoading}
      title={collapsed ? "Sign Out" : undefined}
      className={cn(
        "flex items-center gap-2 text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors disabled:opacity-50",
        collapsed ? "p-2 justify-center w-full" : "px-3 py-2 w-full",
      )}
    >
      <LogOut className="h-4 w-4" />
      {!collapsed && <span>{isLoading ? "Signing out..." : "Sign Out"}</span>}
    </button>
  );
}
