"use client";

import { useEffect, useState, useTransition } from "react";
import { Trash2, Key } from "lucide-react";
import { ColorPicker } from "@/components/ui/color-picker";
import {
  createBadgeAction,
  deleteBadgeAction,
  getBadgesAction,
  updateBadgeAction,
} from "@/app/actions/badgeActions";
import { getCurrentProfileAction } from "@/app/actions/profileActions";
import { ProfileAvatarUpload } from "@/components/admin/profile-avatar-upload";
import { ProfileForm } from "@/components/admin/profile-form";
import { ChangePasswordModal } from "@/components/admin/change-password-modal";

interface SettingsSection {
  id: string;
  title: string;
  description: string;
  icon: string;
}

const settingsSections: SettingsSection[] = [
  {
    id: "profile",
    title: "Admin Profile",
    description: "Manage your profile, avatar, and password",
    icon: "person",
  },
  {
    id: "business",
    title: "Business Information",
    description: "Manage company details, contact information, and branding",
    icon: "business",
  },
  {
    id: "services",
    title: "Services & Pricing",
    description:
      "Configure available services, pricing, and service categories",
    icon: "handyman",
  },
  {
    id: "notifications",
    title: "Notifications",
    description: "Email, SMS, and push notification preferences",
    icon: "notifications",
  },
  {
    id: "payments",
    title: "Payment Settings",
    description: "Payment gateways, currencies, and transaction settings",
    icon: "payment",
  },
  {
    id: "booking",
    title: "Booking Configuration",
    description: "Appointment slots, booking rules, and availability settings",
    icon: "event_available",
  },
  {
    id: "inventory",
    title: "Inventory Settings",
    description: "Stock management, low stock alerts, and supplier settings",
    icon: "inventory",
  },
  {
    id: "badges",
    title: "Product Badges",
    description: "Create and manage product badges and colors",
    icon: "label",
  },
];

type BadgeType = {
  id: string;
  name: string;
  color: string;
  isActive: boolean;
  sortOrder: number;
};

type ProfileType = {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
};

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("profile");
  const [badges, setBadges] = useState<BadgeType[]>([]);
  const [selectedBadge, setSelectedBadge] = useState<string | null>(null);
  const [editColor, setEditColor] = useState("#3B82F6");
  const [newBadgeName, setNewBadgeName] = useState("");
  const [newBadgeColor, setNewBadgeColor] = useState("#3B82F6");
  const [isPending, startTransition] = useTransition();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [profile, setProfile] = useState<ProfileType | null>(null);

  const loadBadges = async () => {
    const result = await getBadgesAction();
    if (result.success && result.data) {
      setBadges(result.data);
    }
  };

  const loadProfile = async () => {
    const result = await getCurrentProfileAction();
    if (result.success && result.data) {
      setProfile(result.data);
    }
  };

  useEffect(() => {
    loadBadges();
    loadProfile();
  }, []);

  const handleSelectBadge = (badgeId: string) => {
    const badge = badges.find((b) => b.id === badgeId);
    if (badge) {
      setSelectedBadge(badgeId);
      setEditColor(badge.color);
    }
  };

  const handleCreateBadge = () => {
    if (!newBadgeName.trim()) return;
    startTransition(async () => {
      const result = await createBadgeAction({
        name: newBadgeName.trim().toUpperCase().replace(/\s+/g, "_"),
        color: newBadgeColor,
      });
      if (result.success) {
        await loadBadges();
        setNewBadgeName("");
        setNewBadgeColor("#3B82F6");
      }
    });
  };

  const handleSaveBadgeColor = () => {
    if (!selectedBadge) return;
    startTransition(async () => {
      const result = await updateBadgeAction(selectedBadge, {
        color: editColor,
      });
      if (result.success) {
        await loadBadges();
        setSelectedBadge(null);
      }
    });
  };

  const handleDeleteBadge = (id: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this badge? It will be removed from all products.",
      )
    ) {
      return;
    }
    startTransition(async () => {
      const result = await deleteBadgeAction(id);
      if (result.success) {
        await loadBadges();
        if (selectedBadge === id) {
          setSelectedBadge(null);
        }
      }
    });
  };

  const renderProfileSettings = () => {
    if (!profile) {
      return (
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <p className="text-muted-foreground">Loading profile...</p>
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
  };

  const renderBusinessSettings = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-6">
          Business Information
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Business Name
          </label>
          <input
            type="text"
            defaultValue="Shahzaib Autos"
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Business Type
          </label>
          <select className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
            <option>Auto Repair Shop</option>
            <option>Car Dealership</option>
            <option>Service Center</option>
            <option>Auto Parts Store</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            defaultValue="+1 (555) 123-4567"
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Email Address
          </label>
          <input
            type="email"
            defaultValue="info@shahzaibautos.com"
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Business Address
        </label>
        <textarea
          rows={3}
          defaultValue="123 Auto Service Street, Car City, CC 12345"
          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Business Hours
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ].map((day) => (
            <div key={day} className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                {day}
              </label>
              <div className="flex gap-2">
                <input
                  type="time"
                  defaultValue={day === "Sunday" ? "" : "09:00"}
                  className="flex-1 px-2 py-1 text-sm border border-border rounded bg-background text-foreground"
                />
                <input
                  type="time"
                  defaultValue={day === "Sunday" ? "" : "18:00"}
                  className="flex-1 px-2 py-1 text-sm border border-border rounded bg-background text-foreground"
                />
              </div>
              <label className="flex items-center text-xs text-muted-foreground">
                <input
                  type="checkbox"
                  className="mr-1"
                  checked={day === "Sunday"}
                />
                Closed
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderServicesSettings = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-6">
          Services & Pricing
        </h2>
      </div>

      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-foreground">
            Available Services
          </h3>
          <button className="bg-primary text-primary-foreground px-3 py-1 rounded text-sm">
            Add Service
          </button>
        </div>

        <div className="space-y-4">
          {[
            { name: "Oil Change", price: 45.99, duration: "30 min" },
            { name: "Brake Service", price: 129.99, duration: "2 hours" },
            { name: "Tire Rotation", price: 29.99, duration: "45 min" },
            { name: "Engine Diagnostics", price: 89.99, duration: "1 hour" },
          ].map((service, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-4 border border-border rounded-lg"
            >
              <div className="flex-1">
                <h4 className="font-medium text-foreground">{service.name}</h4>
                <p className="text-sm text-muted-foreground">
                  Duration: {service.duration}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium text-foreground">${service.price}</p>
              </div>
              <div className="flex gap-2">
                <button className="text-muted-foreground hover:text-primary">
                  <span className="material-symbols-outlined">edit</span>
                </button>
                <button className="text-muted-foreground hover:text-red-500">
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-medium text-foreground mb-4">
          Pricing Settings
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Tax Rate (%)
            </label>
            <input
              type="number"
              defaultValue="8.5"
              step="0.1"
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Currency
            </label>
            <select className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
              <option>USD ($)</option>
              <option>EUR (€)</option>
              <option>GBP (£)</option>
              <option>CAD ($)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-6">
          Notification Settings
        </h2>
      </div>

      <div className="space-y-6">
        {[
          {
            title: "Email Notifications",
            description: "Receive notifications via email",
            options: [
              "New orders",
              "Order status updates",
              "Low stock alerts",
              "Customer inquiries",
            ],
          },
          {
            title: "SMS Notifications",
            description: "Receive notifications via SMS",
            options: [
              "Urgent orders",
              "Booking confirmations",
              "Payment confirmations",
            ],
          },
          {
            title: "Push Notifications",
            description: "Browser push notifications",
            options: [
              "Real-time order updates",
              "Customer messages",
              "System alerts",
            ],
          },
        ].map((section, index) => (
          <div
            key={index}
            className="bg-card rounded-lg border border-border p-6"
          >
            <div className="mb-4">
              <h3 className="text-lg font-medium text-foreground">
                {section.title}
              </h3>
              <p className="text-muted-foreground">{section.description}</p>
            </div>
            <div className="space-y-3">
              {section.options.map((option, optIndex) => (
                <label key={optIndex} className="flex items-center">
                  <input type="checkbox" className="mr-3" defaultChecked />
                  <span className="text-foreground">{option}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPaymentSettings = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-6">
          Payment Settings
        </h2>
      </div>

      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-medium text-foreground mb-4">
          Payment Methods
        </h3>
        <div className="space-y-4">
          {[
            { name: "Credit/Debit Cards", provider: "Stripe", enabled: true },
            { name: "PayPal", provider: "PayPal", enabled: true },
            { name: "Cash", provider: "In-person", enabled: true },
            {
              name: "Bank Transfer",
              provider: "Wire Transfer",
              enabled: false,
            },
          ].map((method, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 border border-border rounded-lg"
            >
              <div>
                <h4 className="font-medium text-foreground">{method.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {method.provider}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked={method.enabled}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderBookingSettings = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-6">
          Booking Configuration
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="text-lg font-medium text-foreground mb-4">
            Time Slots
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Slot Duration (minutes)
              </label>
              <select className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground">
                <option value="30">30 minutes</option>
                <option value="60" selected>
                  60 minutes
                </option>
                <option value="90">90 minutes</option>
                <option value="120">120 minutes</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Advance Booking (days)
              </label>
              <input
                type="number"
                defaultValue="30"
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
              />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="text-lg font-medium text-foreground mb-4">
            Booking Rules
          </h3>
          <div className="space-y-3">
            <label className="flex items-center">
              <input type="checkbox" className="mr-3" defaultChecked />
              <span className="text-foreground">Require phone number</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-3" defaultChecked />
              <span className="text-foreground">Send confirmation email</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-3" />
              <span className="text-foreground">Require deposit</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-3" defaultChecked />
              <span className="text-foreground">Allow cancellation</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderInventorySettings = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-6">
          Inventory Settings
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="text-lg font-medium text-foreground mb-4">
            Stock Alerts
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Low Stock Threshold
              </label>
              <input
                type="number"
                defaultValue="10"
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Alert when stock falls below this number
              </p>
            </div>
            <div className="space-y-3">
              <label className="flex items-center">
                <input type="checkbox" className="mr-3" defaultChecked />
                <span className="text-foreground">
                  Email alerts for low stock
                </span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-3" defaultChecked />
                <span className="text-foreground">Dashboard notifications</span>
              </label>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="text-lg font-medium text-foreground mb-4">
            Auto-Reorder
          </h3>
          <div className="space-y-4">
            <label className="flex items-center">
              <input type="checkbox" className="mr-3" />
              <span className="text-foreground">
                Enable automatic reordering
              </span>
            </label>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Reorder Point
              </label>
              <input
                type="number"
                defaultValue="5"
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Reorder Quantity
              </label>
              <input
                type="number"
                defaultValue="50"
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBadgeSettings = () => {
    const selectedBadgeData = badges.find((b) => b.id === selectedBadge);

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-6">
            Product Badges
          </h2>
        </div>

        {/* Create Badge */}
        <div className="bg-card rounded-lg border border-border p-6 space-y-4">
          <h3 className="text-lg font-medium text-foreground">
            Create New Badge
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Badge Name
              </label>
              <input
                type="text"
                value={newBadgeName}
                onChange={(e) => setNewBadgeName(e.target.value)}
                placeholder="e.g., BESTSELLER"
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
              />
            </div>
            <div className="space-y-2">
              <ColorPicker
                value={newBadgeColor}
                onChange={setNewBadgeColor}
                label="Badge Color"
              />
            </div>
          </div>
          <button
            onClick={handleCreateBadge}
            disabled={isPending || !newBadgeName.trim()}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            Create Badge
          </button>
        </div>

        {/* Badges Table */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="p-6 border-b border-border">
            <h3 className="text-lg font-medium text-foreground">
              Existing Badges ({badges.length})
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                    Name
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                    Color
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                    Status
                  </th>
                  <th className="text-right p-4 text-sm font-medium text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {badges.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="p-8 text-center text-sm text-muted-foreground"
                    >
                      No badges created yet
                    </td>
                  </tr>
                ) : (
                  badges.map((badge) => (
                    <tr
                      key={badge.id}
                      onClick={() => handleSelectBadge(badge.id)}
                      className="hover:bg-muted/30 cursor-pointer transition-colors"
                    >
                      <td className="p-4">
                        <span className="font-medium text-foreground">
                          {badge.name}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-8 h-8 rounded border border-border shadow-sm"
                            style={{ backgroundColor: badge.color }}
                          />
                          <span className="text-sm font-mono text-muted-foreground">
                            {badge.color}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            badge.isActive
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                          }`}
                        >
                          {badge.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteBadge(badge.id);
                          }}
                          disabled={isPending}
                          className="text-destructive hover:text-destructive/80 disabled:opacity-50"
                          title="Delete badge"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Edit Modal */}
        {selectedBadge && selectedBadgeData && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setSelectedBadge(null)}
          >
            <div
              className="bg-card rounded-lg border border-border p-6 max-w-md w-full mx-4 space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-foreground">
                  Edit Badge: {selectedBadgeData.name}
                </h3>
                <button
                  onClick={() => setSelectedBadge(null)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <ColorPicker
                value={editColor}
                onChange={setEditColor}
                label="Badge Color"
              />

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setSelectedBadge(null)}
                  className="flex-1 px-4 py-2 border border-border rounded-md hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveBadgeColor}
                  disabled={isPending}
                  className="flex-1 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderSectionContent = () => {
    switch (activeSection) {
      case "profile":
        return renderProfileSettings();
      case "business":
        return renderBusinessSettings();
      case "services":
        return renderServicesSettings();
      case "notifications":
        return renderNotificationSettings();
      case "payments":
        return renderPaymentSettings();
      case "booking":
        return renderBookingSettings();
      case "inventory":
        return renderInventorySettings();
      case "badges":
        return renderBadgeSettings();
      default:
        return renderProfileSettings();
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">
            Configure your business settings and preferences
          </p>
        </div>
        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-lg border border-border p-4">
            <nav className="space-y-2">
              {settingsSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    activeSection === section.id
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-sm">
                      {section.icon}
                    </span>
                    <div>
                      <p className="font-medium">{section.title}</p>
                      <p className="text-xs opacity-75">
                        {section.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <div className="bg-card rounded-lg border border-border p-6">
            {renderSectionContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
