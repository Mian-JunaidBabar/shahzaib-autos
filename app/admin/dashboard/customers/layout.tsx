import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Customers | Admin",
};

export default function CustomersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
