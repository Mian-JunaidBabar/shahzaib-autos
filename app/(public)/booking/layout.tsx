import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book an Appointment",
};

export default function BookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
