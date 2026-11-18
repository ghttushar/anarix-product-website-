import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductPageView } from "@/components/product-page/ProductPageView";
import { PAGES, PAGE_IDS } from "@/content/products/pages";
import type { ProductId } from "@/content/products/types";

// The five dedicated product pages, one template: /platform/aan, /signals,
// /profitability, /rules and /mcp. Anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return PAGE_IDS.map((product) => ({ product }));
}

type Props = { params: Promise<{ product: string }> };

const pageFor = (id: string) => (PAGE_IDS.includes(id as ProductId) ? PAGES[id as ProductId] : null);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = pageFor((await params).product);
  if (!page) return {};
  return {
    title: `${page.meta.title} · Anarix Platform`,
    description: page.meta.description,
    alternates: { canonical: `/platform/${page.id}` },
    openGraph: { title: page.meta.title, description: page.meta.description, siteName: "Anarix", url: `/platform/${page.id}` },
  };
}

export default async function ProductRoute({ params }: Props) {
  const page = pageFor((await params).product);
  if (!page) notFound();

  // the questions on the page, for search results
  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
      <ProductPageView page={page} />
    </>
  );
}
