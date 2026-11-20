import type { ProductPage } from "@/content/products/types";
import x from "./sections.module.css";

/*
  How it works, folded into the hands-on moment: the page's steps as a small
  numbered rail over it, the current one lit as the visitor goes. The moment
  is the explanation; the rail names its stages.
*/
export function MomentSteps({ page, at }: { page: ProductPage; at: number }) {
  return (
    <ol className={x.rail} aria-label={`How ${page.name} works`}>
      {page.how.steps.map((s, i) => (
        <li key={s.t} data-state={i < at ? "done" : i === at ? "now" : "next"} aria-current={i === at ? "step" : undefined}>
          <span className={x.railNum} aria-hidden="true">
            {String(i + 1).padStart(2, "0")}
          </span>
          <b>{s.t}</b>
        </li>
      ))}
    </ol>
  );
}
