"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

type Props = {
  from: string;
  to: string;
};

export default function ExportButton({ from, to }: Props) {
  const handleClick = () => {
    const url = `/api/admin/export/dashboard?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`;
    // trigger file download by navigating to the API route
    window.location.href = url;
  };

  return (
    <Button
      size="sm"
      onClick={handleClick}
      className="bg-blue-600 hover:bg-blue-700 text-white gap-2 h-10 rounded-lg px-4 shadow-[0_4px_14px_0_rgba(37,99,235,0.39)]"
    >
      <Download className="w-4 h-4" />
      <span className="font-semibold">Export</span>
    </Button>
  );
}
