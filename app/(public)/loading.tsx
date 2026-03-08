import { Skeleton } from "@/components/ui/skeleton";

export default function PublicLoading() {
  return (
    <main className="container px-4 md:px-8 lg:px-16 max-w-7xl mx-auto py-12">
      <div className="mb-8 space-y-3">
        <Skeleton className="h-10 w-56 rounded-lg" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, idx) => (
          <div key={idx} className="rounded-xl border bg-card p-4">
            <Skeleton className="aspect-square rounded-xl" />
            <Skeleton className="h-4 w-2/3 mt-4" />
            <Skeleton className="h-4 w-1/4 mt-2" />
          </div>
        ))}
      </div>
    </main>
  );
}
