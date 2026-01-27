"use client";

import { useEffect, useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { ColorPicker } from "@/components/ui/color-picker";
import {
  createBadgeAction,
  deleteBadgeAction,
  getBadgesAction,
  updateBadgeAction,
} from "@/app/actions/badgeActions";

type BadgeType = {
  id: string;
  name: string;
  color: string;
  isActive: boolean;
  sortOrder: number;
};

export default function BadgesPage() {
  const [badges, setBadges] = useState<BadgeType[]>([]);
  const [selectedBadge, setSelectedBadge] = useState<string | null>(null);
  const [deleteConfirmBadge, setDeleteConfirmBadge] = useState<string | null>(
    null,
  );
  const [editColor, setEditColor] = useState("#3B82F6");
  const [newBadgeName, setNewBadgeName] = useState("");
  const [newBadgeColor, setNewBadgeColor] = useState("#3B82F6");
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBadges();
  }, []);

  const loadBadges = async () => {
    try {
      setIsLoading(true);
      const result = await getBadgesAction();
      if (result.success && result.data) {
        setBadges(result.data);
      }
    } catch (error) {
      console.error("Error loading badges:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateBadge = () => {
    if (!newBadgeName.trim()) return;

    startTransition(async () => {
      const result = await createBadgeAction({
        name: newBadgeName,
        color: newBadgeColor,
      });

      if (result.success) {
        setNewBadgeName("");
        setNewBadgeColor("#3B82F6");
        loadBadges();
      } else {
        alert(result.error || "Failed to create badge");
      }
    });
  };

  const handleSelectBadge = (badgeId: string) => {
    const badge = badges.find((b) => b.id === badgeId);
    if (badge) {
      setSelectedBadge(badgeId);
      setEditColor(badge.color);
    }
  };

  const handleSaveBadgeColor = () => {
    if (!selectedBadge) return;

    startTransition(async () => {
      const result = await updateBadgeAction(selectedBadge, {
        color: editColor,
      });

      if (result.success) {
        setSelectedBadge(null);
        loadBadges();
      } else {
        alert(result.error || "Failed to update badge");
      }
    });
  };

  const handleDeleteClick = (badgeId: string) => {
    setDeleteConfirmBadge(badgeId);
  };

  const confirmDelete = () => {
    if (!deleteConfirmBadge) return;

    startTransition(async () => {
      const result = await deleteBadgeAction(deleteConfirmBadge);

      if (result.success) {
        setDeleteConfirmBadge(null);
        loadBadges();
      } else {
        alert(result.error || "Failed to delete badge");
      }
    });
  };

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
                          handleDeleteClick(badge.id);
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

      {/* Delete Confirmation Modal */}
      {deleteConfirmBadge && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setDeleteConfirmBadge(null)}
        >
          <div
            className="bg-card rounded-lg border border-border p-6 max-w-md w-full mx-4 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-destructive" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-foreground">
                  Delete Badge
                </h3>
                <p className="text-sm text-muted-foreground">
                  This action cannot be undone
                </p>
              </div>
            </div>

            <p className="text-sm text-foreground">
              Are you sure you want to delete this badge? It will be removed
              from all products using it.
            </p>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setDeleteConfirmBadge(null)}
                className="flex-1 px-4 py-2 border border-border rounded-md hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isPending}
                className="flex-1 bg-destructive text-destructive-foreground px-4 py-2 rounded-md hover:bg-destructive/90 transition-colors disabled:opacity-50"
              >
                Delete Badge
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
