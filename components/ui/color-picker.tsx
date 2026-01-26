"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const DEFAULT_COLORS = [
  "bg-red-500",
  "bg-orange-500",
  "bg-yellow-500",
  "bg-green-500",
  "bg-blue-500",
  "bg-indigo-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-gray-500",
  "bg-slate-500",
  "bg-cyan-500",
  "bg-teal-500",
];

interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  allowCustom?: boolean;
}

export function ColorPicker({
  value,
  onChange,
  label = "Badge Color",
  allowCustom = true,
}: ColorPickerProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const [customColors, setCustomColors] = React.useState<string[]>([]);
  const [showCustomInput, setShowCustomInput] = React.useState(false);
  const [customInput, setCustomInput] = React.useState("");

  const allColors = [...DEFAULT_COLORS, ...customColors];

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
    if (customInput && customInput.startsWith("bg-")) {
      if (!customColors.includes(customInput)) {
        setCustomColors([...customColors, customInput]);
      }
      onChange(customInput);
      setCustomInput("");
      setShowCustomInput(false);
    }
  };

  const handleRemoveCustomColor = (color: string) => {
    setCustomColors(customColors.filter((c) => c !== color));
    if (value === color) {
      onChange("");
    }
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
              className={cn(
                "relative w-10 h-10 rounded-lg transition-all border-2 cursor-move hover:scale-110 active:scale-95",
                color,
                value === color
                  ? "border-foreground ring-2 ring-offset-2 ring-foreground scale-110"
                  : "border-transparent hover:border-foreground/50"
              )}
              title={color}
            >
              {value === color && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="w-2.5 h-2.5 bg-white rounded-full shadow-lg"></span>
                </span>
              )}
            </button>

            {/* Remove button for custom colors */}
            {customColors.includes(color) && (
              <button
                type="button"
                onClick={() => handleRemoveCustomColor(color)}
                className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
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
          <div className={cn("w-8 h-8 rounded-md shadow-sm", value)}></div>
          <span className="text-xs font-mono text-muted-foreground">
            {value}
          </span>
        </div>
      )}

      {/* Custom color input */}
      {showCustomInput && allowCustom && (
        <div className="flex gap-2 p-2 rounded-lg border border-dashed border-foreground/20">
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="e.g., bg-emerald-500"
            className="text-xs px-2 py-1 rounded border border-input bg-background"
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
            className="text-xs px-2 py-1 rounded bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Add
          </button>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        Drag colors to select, or click to choose
      </p>
    </div>
  );
}
