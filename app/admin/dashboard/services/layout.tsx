import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services | Admin",
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
