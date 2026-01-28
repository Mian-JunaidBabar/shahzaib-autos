import {
  getStorefrontProducts,
  getAllCategories,
  getPriceRange,
  type SortOption,
} from "@/lib/services/storefront.service";
import {
  ProductCard,
  ProductFilters,
  ActiveFilters,
  SearchBar,
  SortSelect,
  Pagination,
} from "@/components/store";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";
import { Suspense } from "react";
import Link from "next/link";

// Mark this page as dynamic to prevent static generation during build
export const dynamic = "force-dynamic";

type SearchParams = Promise<{
  query?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: SortOption;
  page?: string;
}>;

export const metadata = {
  title: "Products | Shahzaib Autos",
  description:
    "Browse our premium car accessories including interior comfort, exterior styling, and vehicle protection products.",
};

// Loading skeleton for products grid
function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex flex-col space-y-3">
          <Skeleton className="aspect-square rounded-lg" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  );
}

// Products grid component
async function ProductsGrid({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;

  const { products, pagination } = await getStorefrontProducts({
    query: params.query,
    category: params.category,
    minPrice: params.minPrice ? parseInt(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? parseInt(params.maxPrice) : undefined,
    sort: params.sort,
    page: params.page ? parseInt(params.page) : 1,
    limit: 12,
  });

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No products found</h3>
        <p className="text-muted-foreground">
          Try adjusting your search or filter criteria.
        </p>
        <Link
          href="/products"
          className="inline-block mt-4 text-primary hover:underline"
        >
          Clear all filters
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <Pagination
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        total={pagination.total}
      />
    </>
  );
}

// Component to fetch filter data
async function FilterDataWrapper({
  children,
}: {
  children: (data: {
    categories: string[];
    priceRange: { min: number; max: number };
  }) => React.ReactNode;
}) {
  const [categories, priceRange] = await Promise.all([
    getAllCategories(),
    getPriceRange(),
  ]);

  return children({ categories, priceRange });
}

export default function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <>
      {/* Header Section */}
      <section className="border-b bg-muted/30 pt-8 pb-8">
        <div className="container px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center text-sm text-muted-foreground mb-4">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-foreground font-medium">Products</span>
          </nav>

          {/* Title */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                Car Accessories
              </h1>
              <p className="text-muted-foreground mt-2 max-w-2xl">
                Premium upgrades for interior comfort, exterior styling, and
                vehicle protection. Professional installation available.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Filters & Products */}
      <section className="container px-4 md:px-8 lg:px-16 max-w-7xl mx-auto py-8">
        {/* Top Controls - Search & Sort */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start mb-6">
          <Suspense fallback={<Skeleton className="h-10 flex-1 md:w-64" />}>
            <SearchBar />
          </Suspense>

          <Suspense fallback={<Skeleton className="h-10 w-45" />}>
            <SortSelect />
          </Suspense>
        </div>

        {/* Active Filters */}
        <div className="mb-6">
          <Suspense fallback={null}>
            <ActiveFilters />
          </Suspense>
        </div>

        {/* Layout with Sidebar Filters & Products */}
        <div className="flex gap-8">
          {/* Sidebar Filters (handles mobile via Sheet, desktop sidebar) */}
          <Suspense
            fallback={<Skeleton className="hidden lg:block w-64 h-96" />}
          >
            <FilterDataWrapper>
              {({ categories, priceRange }) => (
                <ProductFilters
                  categories={categories}
                  priceRange={priceRange}
                />
              )}
            </FilterDataWrapper>
          </Suspense>

          {/* Products Grid */}
          <div className="flex-1">
            <Suspense fallback={<ProductGridSkeleton />}>
              <ProductsGrid searchParams={searchParams} />
            </Suspense>
          </div>
        </div>
      </section>
    </>
  );
}
