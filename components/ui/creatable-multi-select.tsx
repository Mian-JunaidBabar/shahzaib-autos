"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useLayoutEffect,
} from "react";
import { useController, type FieldValues, type Path } from "react-hook-form";
import { Control } from "react-hook-form";
import { ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface Tag {
  id: string;
  name: string;
}

interface CreatableMultiSelectProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends Path<TFieldValues> = Path<TFieldValues>,
> {
  label?: string;
  placeholder?: string;
  description?: string;
  control: Control<TFieldValues, Record<string, unknown>>;
  name: TName;
  availableTags: Tag[];
  onTagsChange?: (tags: string[]) => void;
  disabled?: boolean;
}

/**
 * Creatable Multi-Select Component
 *
 * A sophisticated multi-select dropdown that:
 * - Shows existing tags filtered by search
 * - Allows creating new tags on-the-fly
 * - Displays selected tags as dismissible badges
 * - Integrates with react-hook-form via Controller
 *
 * @example
 * ```tsx
 * <CreatableMultiSelect
 *   control={control}
 *   name="tags"
 *   label="Product Tags"
 *   placeholder="Search or create tags..."
 *   availableTags={tags}
 * />
 * ```
 */
export function CreatableMultiSelect<
  TFieldValues extends FieldValues = FieldValues,
  TName extends Path<TFieldValues> = Path<TFieldValues>,
>({
  label,
  placeholder = "Search or create tags...",
  description,
  control,
  name,
  availableTags,
  onTagsChange,
  disabled = false,
}: CreatableMultiSelectProps<TFieldValues, TName>) {
  const { field } = useController({
    control,
    name,
  });

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const selectedTags = (field.value as string[]) || [];

  // Focus search input when popover opens
  useLayoutEffect(() => {
    if (open) {
      setTimeout(() => searchInputRef.current?.focus(), 0);
    }
  }, [open]);

  // Filter tags based on search
  const filteredTags = availableTags.filter(
    (tag) =>
      !selectedTags.includes(tag.name) &&
      tag.name.toLowerCase().includes(search.toLowerCase()),
  );

  // Check if search text could be a new tag
  const trimmedSearch = search.trim();
  const canCreateNewTag =
    trimmedSearch.length > 0 &&
    !availableTags.some(
      (tag) => tag.name.toLowerCase() === trimmedSearch.toLowerCase(),
    ) &&
    !selectedTags.includes(trimmedSearch);

  const handleSelectTag = (tagName: string, e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    const newTags = [...selectedTags, tagName];
    field.onChange(newTags);
    field.onChange(newTags);
    onTagsChange?.(newTags);
    setSearch("");
    // Keep popover open for multiple selections
    setTimeout(() => searchInputRef.current?.focus(), 10);
  };

  const handleRemoveTag = (tagName: string, e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    const newTags = selectedTags.filter((t) => t !== tagName);
    field.onChange(newTags);
    field.onChange(newTags);
    onTagsChange?.(newTags);
  };

  const handleCreateAndSelect = () => {
    if (canCreateNewTag) {
      handleSelectTag(trimmedSearch);
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && canCreateNewTag) {
      e.preventDefault();
      handleCreateAndSelect();
    }
  };

  return (
    <div className="w-full space-y-2">
      {label && <Label htmlFor={`creatableselect-${name}`}>{label}</Label>}

      <Popover
        open={open}
        onOpenChange={(newOpen) => {
          setOpen(newOpen);
          if (!newOpen) setSearch("");
        }}
      >
        <PopoverTrigger asChild>
          <Button
            ref={triggerRef}
            id={`creatableselect-${name}`}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between",
              disabled && "cursor-not-allowed opacity-50",
            )}
            disabled={disabled}
          >
            <div className="flex flex-wrap gap-1 items-center flex-1 text-left">
              {selectedTags.length > 0 ? (
                selectedTags.map((tagName) => (
                  <Badge
                    key={tagName}
                    variant="secondary"
                    className="gap-1 cursor-pointer"
                    onClick={(e) => handleRemoveTag(tagName, e)}
                  >
                    {tagName}
                    <X className="h-3 w-3 hover:opacity-70" />
                  </Badge>
                ))
              ) : (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
            </div>
            <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="w-(--radix-popover-trigger-width) p-2"
          align="start"
        >
          <div className="space-y-2">
            {/* Search Input */}
            <Input
              ref={searchInputRef}
              placeholder="Search or create..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              className="h-8"
            />

            {/* Tag List */}
            <div className="flex flex-col max-h-50 overflow-y-auto gap-1">
              {filteredTags.length > 0 ? (
                filteredTags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={(e) => handleSelectTag(tag.name, e)}
                    className={cn(
                      "px-2 py-1.5 text-sm text-left rounded-md hover:bg-accent transition-colors",
                      selectedTags.includes(tag.name) &&
                        "bg-accent font-semibold",
                    )}
                  >
                    {tag.name}
                  </button>
                ))
              ) : (
                <div className="px-2 py-2 text-sm text-muted-foreground">
                  {search ? "No tags found" : "No available tags"}
                </div>
              )}

              {/* Create New Tag Option */}
              {canCreateNewTag && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleCreateAndSelect();
                  }}
                  className="px-2 py-1.5 text-sm text-left rounded-md bg-green-50 hover:bg-green-100 text-green-700 transition-colors border border-green-200 font-medium"
                >
                  + Create &quot;{trimmedSearch}&quot;
                </button>
              )}
            </div>

            {/* Selected Tags Summary (not strictly needed but helpful) */}
            {selectedTags.length > 0 && (
              <div className="border-t pt-2 text-xs text-muted-foreground">
                {selectedTags.length} tag{selectedTags.length !== 1 ? "s" : ""}{" "}
                selected
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>

      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
