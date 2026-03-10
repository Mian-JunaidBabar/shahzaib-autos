import type { MetadataRoute } from "next";


export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://www.shahzaibelectronics.pk";

  const normalizedBaseUrl = baseUrl.replace(/\/$/, "");

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api", "/auth", "/checkout", "/cart"],
      },
    ],
    sitemap: `${normalizedBaseUrl}/sitemap.xml`,
    host: normalizedBaseUrl,
  };
}
