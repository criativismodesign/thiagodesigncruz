import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = "https://www.usekin.com.br";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/login-usekin/", "/carrinho/", "/checkout/", "/minha-conta/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
