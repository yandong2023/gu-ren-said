import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/admin/"]
      }
    ],
    sitemap: "https://gurensaid.com/sitemap.xml"
  };
}
