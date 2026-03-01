import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bookings | Admin",
};

export default function BookingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
