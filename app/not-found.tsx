import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-xl text-center">
        <p className="text-7xl font-black tracking-tighter">404</p>
        <p className="mt-4 text-lg text-muted-foreground">
          Page not found. The gear you are looking for doesn&apos;t exist.
        </p>
        <Button className="mt-6" asChild>
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    </main>
  );
}
