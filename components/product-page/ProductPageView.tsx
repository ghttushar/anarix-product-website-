import type { ProductPage } from "@/content/products/types";
import { PageHero } from "./PageHero";
import { HowItWorks } from "./HowItWorks";
import { Anatomy } from "./Anatomy";
import { DepthScreen } from "./Depth";
import { Close, Questions } from "./Questions";

/* A product page: its landmark, how it works, its anatomy, one or two depth
   chapters, its questions, then the way in. Every chapter is one screen. */
export function ProductPageView({ page }: { page: ProductPage }) {
  return (
    <>
      <PageHero page={page} />
      <HowItWorks page={page} />
      <Anatomy page={page} />
      {page.depth.map((d, i) => (
        <DepthScreen key={d.title} d={d} index={i} />
      ))}
      <Questions page={page} />
      <Close />
    </>
  );
}
