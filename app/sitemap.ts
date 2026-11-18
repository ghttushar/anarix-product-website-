import type { MetadataRoute } from "next";
import { PAGE_IDS } from "@/content/products/pages";

// Served at /platform/sitemap.xml. The domain's robots.txt belongs to the
// services site (www.anarix.ai), so it should list this sitemap; a robots.txt
// under /platform would never be read.
const SITE = "https://www.anarix.ai/platform";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE, changeFrequency: "monthly", priority: 1 },
    ...PAGE_IDS.map((id) => ({ url: `${SITE}/${id}`, changeFrequency: "monthly" as const, priority: 0.8 })),
  ];
}
