import { products } from "@/data";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const product = products.find((p) => p.slug === params.slug);

  if (!product) {
    return {
      title: "Product Not Found - AM Motors",
    };
  }

  return {
    title: `${product.name} - AM Motors`,
    description: product.description,
  };
}

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
