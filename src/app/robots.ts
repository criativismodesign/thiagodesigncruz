import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = "https://thiagodesigncruz.com.br";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/dashboard/", "/checkout/", "/login/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
