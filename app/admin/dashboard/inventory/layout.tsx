import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inventory | Admin",
};

export default function InventoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
