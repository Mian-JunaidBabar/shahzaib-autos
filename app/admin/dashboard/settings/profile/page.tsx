"use client";

import { useEffect, useState } from "react";
import { Key } from "lucide-react";
import { getCurrentProfileAction } from "@/app/actions/profileActions";
import { ProfileAvatarUpload } from "@/components/admin/profile-avatar-upload";
import { ProfileForm } from "@/components/admin/profile-form";
import { ChangePasswordModal } from "@/components/admin/change-password-modal";

type ProfileType = {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const result = await getCurrentProfileAction();
      if (result.success && result.data) {
        setProfile({
          id: result.data.id,
          email: result.data.email,
          fullName: result.data.fullName,
          avatarUrl: result.data.avatarUrl,
        });
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-muted-foreground">Profile not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-6">
          Admin Profile
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Avatar Section */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="text-lg font-medium text-foreground mb-4">
              Profile Picture
            </h3>
            <ProfileAvatarUpload
              currentAvatarUrl={profile.avatarUrl}
              onUploadSuccess={(url) => {
                setProfile({ ...profile, avatarUrl: url });
              }}
            />
          </div>
        </div>

        {/* Profile Info Section */}
        <div className="lg:col-span-2">
          <div className="bg-card rounded-lg border border-border p-6 space-y-6">
            <div>
              <h3 className="text-lg font-medium text-foreground mb-4">
                Profile Information
              </h3>
              <ProfileForm
                initialData={{
                  fullName: profile.fullName,
                  email: profile.email,
                }}
                onSaveSuccess={loadProfile}
              />
            </div>

            {/* Change Password */}
            <div className="pt-6 border-t border-border">
              <h3 className="text-lg font-medium text-foreground mb-2">
                Password
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Update your password to keep your account secure.
              </p>
              <button
                type="button"
                onClick={() => setIsPasswordModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 border border-border rounded-md hover:bg-muted transition-colors"
              >
                <Key className="w-4 h-4" />
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </div>
  );
}
