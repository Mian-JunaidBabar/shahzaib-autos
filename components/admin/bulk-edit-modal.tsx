"use client";

/**
 * BulkEditModal
 *
 * Delta-based bulk editor:
 *  - Category assign/clear/no-change
 *  - Tags add/remove (CreatableMultiSelect)
 *  - Badges add/remove (explicit m2m IDs)
 */

import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { CreatableMultiSelect } from "@/components/ui/creatable-multi-select";
import { getAllTagsAction } from "@/app/actions/tagActions";
import { bulkUpdateProductsAction } from "@/app/actions/productActions";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface BulkEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProductIds: string[];
  categories: { id: string; name: string }[];
  badges: { id: string; name: string; color?: string }[];
  onSuccess?: () => void;
}

type BulkEditFormValues = {
  categoryId: string;
  tagsToAdd: string[];
  tagsToRemove: string[];
  badgesToAdd: string[];
  badgesToRemove: string[];
};

export function BulkEditModal({
  isOpen,
  onClose,
  selectedProductIds,
  categories,
  badges,
  onSuccess,
}: BulkEditModalProps) {
  const [isPending, startTransition] = useTransition();
  const [tags, setTags] = useState<{ id: string; name: string }[]>([]);

  const { control, reset, watch, setValue, getValues } =
    useForm<BulkEditFormValues>({
      defaultValues: {
        categoryId: "__no_change__",
        tagsToAdd: [],
        tagsToRemove: [],
        badgesToAdd: [],
        badgesToRemove: [],
      },
    });

  // eslint-disable-next-line react-hooks/incompatible-library
  const badgesToAdd = watch("badgesToAdd");
  const badgesToRemove = watch("badgesToRemove");

  // Load tag options when opened
  useEffect(() => {
    if (!isOpen) return;

    getAllTagsAction().then((tagResult) => {
      if (tagResult.success && tagResult.data) {
        setTags(
          tagResult.data.map((t: { id: string; name: string }) => ({
            id: t.id,
            name: t.name,
          })),
        );
      }
    });
  }, [isOpen, setTags]);

  const toggleBadgeSelection = (
    field: "badgesToAdd" | "badgesToRemove",
    badgeId: string,
    checked: boolean,
  ) => {
    const source = new Set(getValues(field));
    const oppositeField =
      field === "badgesToAdd" ? "badgesToRemove" : "badgesToAdd";
    const opposite = new Set(getValues(oppositeField));

    if (checked) {
      source.add(badgeId);
      opposite.delete(badgeId);
    } else {
      source.delete(badgeId);
    }

    setValue(field, Array.from(source), { shouldDirty: true });
    setValue(oppositeField, Array.from(opposite), { shouldDirty: true });
  };

  const handleDialogOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      onClose();
      return;
    }

    reset({
      categoryId: "__no_change__",
      tagsToAdd: [],
      tagsToRemove: [],
      badgesToAdd: [],
      badgesToRemove: [],
    });
  };

  const handleApply = () => {
    startTransition(async () => {
      const form = getValues();
      const updates: Parameters<typeof bulkUpdateProductsAction>[1] = {};
      const clean = (items: string[]) =>
        items
          .map((item) => item.trim())
          .filter(Boolean)
          .filter((item, index, array) => array.indexOf(item) === index);

      let hasChanges = false;

      if (form.categoryId !== "__no_change__") {
        updates.categoryId =
          form.categoryId === "__clear__" ? null : form.categoryId;
        hasChanges = true;
      }

      const tagsToAdd = clean(form.tagsToAdd);
      const tagsToRemove = clean(form.tagsToRemove).filter(
        (name) => !tagsToAdd.includes(name),
      );

      if (tagsToAdd.length > 0) {
        updates.tagsToAdd = tagsToAdd;
        hasChanges = true;
      }
      if (tagsToRemove.length > 0) {
        updates.tagsToRemove = tagsToRemove;
        hasChanges = true;
      }

      const badgesToAddClean = clean(form.badgesToAdd);
      const badgesToRemoveClean = clean(form.badgesToRemove).filter(
        (id) => !badgesToAddClean.includes(id),
      );

      if (badgesToAddClean.length > 0) {
        updates.badgesToAdd = badgesToAddClean;
        hasChanges = true;
      }
      if (badgesToRemoveClean.length > 0) {
        updates.badgesToRemove = badgesToRemoveClean;
        hasChanges = true;
      }

      if (!hasChanges) {
        toast.info("No changes to apply");
        return;
      }

      const result = await bulkUpdateProductsAction(
        selectedProductIds,
        updates,
      );

      if (result.success) {
        toast.success(
          `Updated ${result.data?.updatedCount ?? selectedProductIds.length} products`,
        );
        onClose();
        onSuccess?.();
      } else {
        toast.error(result.error || "Failed to update products");
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Bulk Edit</DialogTitle>
          <DialogDescription>
            Apply changes to {selectedProductIds.length} selected product
            {selectedProductIds.length > 1 ? "s" : ""}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Category */}
          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              value={watch("categoryId")}
              onValueChange={(value) => setValue("categoryId", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="— No change —" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__no_change__">— No change —</SelectItem>
                <SelectItem value="__clear__">Clear category</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tags Add */}
          <div className="space-y-2">
            <CreatableMultiSelect
              control={control}
              name="tagsToAdd"
              label="Tags to Add"
              placeholder="Search or create tags..."
              description="These tags will be attached to all selected products"
              availableTags={tags}
            />
          </div>

          {/* Tags Remove */}
          <div className="space-y-2">
            <CreatableMultiSelect
              control={control}
              name="tagsToRemove"
              label="Tags to Remove"
              placeholder="Search or create tags..."
              description="Matching existing tags will be removed from selected products"
              availableTags={tags}
            />
          </div>

          {/* Badges Add/Remove */}
          <div className="space-y-2">
            <Label>Badges</Label>
            <div className="grid grid-cols-1 gap-2 rounded-md border p-3 max-h-56 overflow-y-auto">
              {badges.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No badges available
                </p>
              ) : (
                badges.map((badge) => (
                  <div
                    key={badge.id}
                    className="grid grid-cols-[1fr_auto_auto] items-center gap-3 rounded-sm px-2 py-1"
                  >
                    <div className="text-sm font-medium">{badge.name}</div>
                    <label className="flex items-center gap-2 text-xs text-green-700">
                      <Checkbox
                        checked={badgesToAdd.includes(badge.id)}
                        onCheckedChange={(checked) =>
                          toggleBadgeSelection(
                            "badgesToAdd",
                            badge.id,
                            checked === true,
                          )
                        }
                      />
                      Add
                    </label>
                    <label className="flex items-center gap-2 text-xs text-amber-700">
                      <Checkbox
                        checked={badgesToRemove.includes(badge.id)}
                        onCheckedChange={(checked) =>
                          toggleBadgeSelection(
                            "badgesToRemove",
                            badge.id,
                            checked === true,
                          )
                        }
                      />
                      Remove
                    </label>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button onClick={handleApply} disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Applying...
              </>
            ) : (
              `Apply to ${selectedProductIds.length} product${selectedProductIds.length > 1 ? "s" : ""}`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
