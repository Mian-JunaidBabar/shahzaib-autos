"use client";

import { useState, useTransition } from "react";
import { Save, Loader2 } from "lucide-react";
import { updateProfileAction } from "@/app/actions/profileActions";
import { useAuth } from "@/context/auth-context";

interface ProfileFormProps {
  initialData: {
    fullName: string | null;
    email: string;
  };
  onSaveSuccess?: () => void;
}

export function ProfileForm({ initialData, onSaveSuccess }: ProfileFormProps) {
  const [fullName, setFullName] = useState(initialData.fullName || "");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { refreshUser } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    startTransition(async () => {
      try {
        const result = await updateProfileAction({ fullName });

        if (!result.success) {
          throw new Error(result.error || "Failed to update profile");
        }

        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);

        // Refresh user data in navbar
        await refreshUser();

        onSaveSuccess?.();
      } catch (err) {
        console.error("Profile update error:", err);
        setError(
          err instanceof Error ? err.message : "Failed to update profile",
        );
      }
    });
  };

  const hasChanges = fullName !== (initialData.fullName || "");

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {/* Full Name */}
        <div>
          <label
            htmlFor="fullName"
            className="block text-sm font-medium text-foreground mb-2"
          >
            Full Name
          </label>
          <input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter your full name"
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={isPending}
          />
        </div>

        {/* Email (Read-only) */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-foreground mb-2"
          >
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={initialData.email}
            readOnly
            className="w-full px-3 py-2 border border-border rounded-md bg-muted text-muted-foreground cursor-not-allowed"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Email cannot be changed. Managed by Supabase Auth.
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="p-3 rounded-md bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
          <p className="text-sm text-green-800 dark:text-green-200">
            Profile updated successfully!
          </p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isPending || !hasChanges}
        className="w-full md:w-auto px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isPending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Save className="w-4 h-4" />
            Save Changes
          </>
        )}
      </button>
    </form>
  );
}
