import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Orders | Admin",
};

export default function OrdersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
