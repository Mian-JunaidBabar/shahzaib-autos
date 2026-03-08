"use client";

import { AlertTriangle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: Props) {
  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-xl rounded-xl border bg-card p-8 text-center shadow-sm">
        <AlertTriangle className="mx-auto h-12 w-12 text-red-600" />
        <h1 className="mt-4 text-2xl font-bold tracking-tight">
          Something went wrong!
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {error.message || "An unexpected error occurred."}
        </p>
        <Button className="mt-6" onClick={() => reset()}>
          <RefreshCcw className="mr-2 h-4 w-4" />
          Try again
        </Button>
      </div>
    </main>
  );
}
