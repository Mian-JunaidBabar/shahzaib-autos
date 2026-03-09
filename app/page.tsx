import HomePageClient from "@/components/home/HomePageClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Direct Importer of Car Electronics in Lahore",
  description:
    "Shahzaib Electronics is the leading direct importer and wholesale distributor of premium car accessories, Android panels, and audio systems in Lahore, Pakistan.",
};

export default function HomePage() {
  return <HomePageClient />;
}
