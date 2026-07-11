import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/portal/", "/api/", "/login", "/verificando", "/gracias"],
      },
    ],
    sitemap: "https://claude.mayckolco.com/sitemap.xml",
  };
}
