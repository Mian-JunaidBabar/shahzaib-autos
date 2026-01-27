"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const DEFAULT_COLORS = [
  "#EF4444", // red
  "#F97316", // orange
  "#EAB308", // yellow
  "#22C55E", // green
  "#3B82F6", // blue
  "#6366F1", // indigo
  "#A855F7", // purple
  "#EC4899", // pink
  "#6B7280", // gray
  "#64748B", // slate
  "#06B6D4", // cyan
  "#14B8A6", // teal
];

interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  allowCustom?: boolean;
  allowRemove?: boolean;
}

export function ColorPicker({
  value,
  onChange,
  label = "Badge Color",
  allowCustom = true,
  allowRemove = true,
}: ColorPickerProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const [customColors, setCustomColors] = React.useState<string[]>([]);
  const [removedColors, setRemovedColors] = React.useState<string[]>([]);
  const [showCustomInput, setShowCustomInput] = React.useState(false);
  const [customInput, setCustomInput] = React.useState("");

  // Load persisted colors from localStorage on mount
  React.useEffect(() => {
    const savedCustomColors = localStorage.getItem("colorPickerCustomColors");
    const savedRemovedColors = localStorage.getItem("colorPickerRemovedColors");

    if (savedCustomColors) {
      try {
        setCustomColors(JSON.parse(savedCustomColors));
      } catch (e) {
        console.error("Failed to load custom colors", e);
      }
    }

    if (savedRemovedColors) {
      try {
        setRemovedColors(JSON.parse(savedRemovedColors));
      } catch (e) {
        console.error("Failed to load removed colors", e);
      }
    }
  }, []);

  // Filter out removed default colors and combine with custom colors
  const availableDefaultColors = DEFAULT_COLORS.filter(
    (color) => !removedColors.includes(color),
  );
  const allColors = [...availableDefaultColors, ...customColors];

  const handleDragStart = (e: React.DragEvent<HTMLButtonElement>) => {
    setIsDragging(true);
    e.dataTransfer.effectAllowed = "copy";
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleDrop = (e: React.DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const color = e.dataTransfer.getData("text/plain");
    if (color) {
      onChange(color);
    }
  };

  const handleAddCustomColor = () => {
    // Validate hex color format
    const hexPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (customInput && hexPattern.test(customInput)) {
      const normalizedColor = customInput.toUpperCase();
      if (
        !customColors.includes(normalizedColor) &&
        !DEFAULT_COLORS.includes(normalizedColor)
      ) {
        const updatedCustomColors = [...customColors, normalizedColor];
        setCustomColors(updatedCustomColors);
        localStorage.setItem(
          "colorPickerCustomColors",
          JSON.stringify(updatedCustomColors),
        );
      }
      onChange(normalizedColor);
      setCustomInput("");
      setShowCustomInput(false);
    }
  };

  const handleRemoveColor = (color: string) => {
    // Check if it's a custom color
    if (customColors.includes(color)) {
      const updatedCustomColors = customColors.filter((c) => c !== color);
      setCustomColors(updatedCustomColors);
      localStorage.setItem(
        "colorPickerCustomColors",
        JSON.stringify(updatedCustomColors),
      );
    } else if (DEFAULT_COLORS.includes(color)) {
      // If it's a default color, add to removed list
      const updatedRemovedColors = [...removedColors, color];
      setRemovedColors(updatedRemovedColors);
      localStorage.setItem(
        "colorPickerRemovedColors",
        JSON.stringify(updatedRemovedColors),
      );
    }

    // Clear selection if the removed color was selected
    if (value === color) {
      onChange("");
    }
  };

  const handleRestoreDefaultColors = () => {
    setRemovedColors([]);
    localStorage.removeItem("colorPickerRemovedColors");
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">{label}</label>

      {/* Color Grid */}
      <div className="grid grid-cols-6 gap-2">
        {allColors.map((color) => (
          <div key={color} className="relative group">
            <button
              type="button"
              draggable
              onDragStart={(e) => {
                handleDragStart(e);
                e.dataTransfer.setData("text/plain", color);
              }}
              onClick={() => onChange(color)}
              onDragEnd={handleDragEnd}
              style={{ backgroundColor: color }}
              className={cn(
                "relative w-10 h-10 rounded-lg transition-all border-2 cursor-move hover:scale-110 active:scale-95",
                value === color
                  ? "border-foreground ring-2 ring-offset-2 ring-foreground scale-110"
                  : "border-transparent hover:border-foreground/50",
              )}
              title={color}
            >
              {value === color && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="w-2.5 h-2.5 bg-white rounded-full shadow-lg"></span>
                </span>
              )}
            </button>

            {/* Remove button - show for all colors when allowRemove is true */}
            {allowRemove && (
              <button
                type="button"
                onClick={() => handleRemoveColor(color)}
                className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:scale-110"
                title={`Remove ${color}`}
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        ))}

        {/* Add custom color button */}
        {allowCustom && (
          <button
            type="button"
            onClick={() => setShowCustomInput(!showCustomInput)}
            className="w-10 h-10 rounded-lg border-2 border-dashed border-foreground/30 hover:border-foreground/60 flex items-center justify-center text-lg font-bold text-foreground/50 hover:text-foreground transition-colors"
            title="Add custom color"
          >
            +
          </button>
        )}
      </div>

      {/* Selected color preview */}
      {value && (
        <div className="flex items-center gap-2 p-2 rounded-lg bg-muted">
          <div
            className="w-8 h-8 rounded-md shadow-sm"
            style={{ backgroundColor: value }}
          ></div>
          <span className="text-xs font-mono text-muted-foreground">
            {value}
          </span>
        </div>
      )}

      {/* Custom color input */}
      {showCustomInput && allowCustom && (
        <div className="flex flex-col gap-2 p-3 rounded-lg border border-dashed border-foreground/20">
          <div className="flex gap-2">
            <input
              type="color"
              value={customInput || "#000000"}
              onChange={(e) => setCustomInput(e.target.value.toUpperCase())}
              className="w-12 h-10 rounded border border-input bg-background cursor-pointer"
            />
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="#000000"
              className="flex-1 text-sm px-3 py-2 rounded border border-input bg-background"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddCustomColor();
                } else if (e.key === "Escape") {
                  setShowCustomInput(false);
                }
              }}
            />
            <button
              type="button"
              onClick={handleAddCustomColor}
              className="text-sm px-4 py-2 rounded bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Add
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            Use the color picker or enter a hex code (e.g., #FF5733)
          </p>
        </div>
      )}

      {/* Restore default colors button */}
      {removedColors.length > 0 && (
        <button
          type="button"
          onClick={handleRestoreDefaultColors}
          className="text-xs text-primary hover:text-primary/80 underline underline-offset-2"
        >
          Restore {removedColors.length} removed default color
          {removedColors.length > 1 ? "s" : ""}
        </button>
      )}

      <p className="text-xs text-muted-foreground">
        {allowRemove
          ? "Drag colors to select, click to choose, or hover and click X to remove"
          : "Drag colors to select, or click to choose"}
      </p>
    </div>
  );
}
