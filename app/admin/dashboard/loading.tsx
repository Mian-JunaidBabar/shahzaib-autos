import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboardLoading() {
  return (
    <main className="space-y-6 p-4 md:p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <Skeleton key={idx} className="h-24 w-full rounded-lg" />
        ))}
      </div>

      <Skeleton className="h-100 w-full mt-6 rounded-lg" />
    </main>
  );
}
