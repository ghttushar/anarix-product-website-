"use client";

import type { ReactNode } from "react";
import { Screen } from "@/components/layout/Screen";
import { Reveal } from "@/components/motion/Reveal";
import type { ProductPage } from "@/content/products/types";
import x from "./sections.module.css";

/*
  The two information screens every product page carries, each with its own
  hook. They grow taller than one screen when the content needs it. Two
  layouts each, so neighbouring pages never read the same:
  - How it works: "row" (numbered columns), "rail" (heading left, steps down
    the right) or "aside" (steps down the left, a second view of the system
    on the right: a different part of it than the hero shows)
  - What it does: "grid" (ruled cells) or "list" (intro left, two ruled columns)
  "What it works with" sits under What it does, as named groups of names.
*/
const pad = (n: number) => String(n + 1).padStart(2, "0");

export function HowItWorks({ page, variant = "row", aside, hasDock = false }: { page: ProductPage; variant?: "row" | "rail" | "aside"; aside?: ReactNode; /** the aside holds an Aan dock */ hasDock?: boolean }) {
  const { title, steps } = page.how;
  return (
    <Screen id="how" fit="grow" hasDock={hasDock} bodyClassName={`l-container ${x.how} ${x[variant]}`} label={title}>
      <header className={x.head}>
        <h2 className="t-h2">{title}</h2>
      </header>
      <ol className={x.steps} data-count={steps.length}>
        {steps.map((s, i) => (
          <Reveal as="li" key={s.t} order={i + 1} className={x.step}>
            <span className={x.num} aria-hidden="true">
              {pad(i)}
            </span>
            <b>{s.t}</b>
            <span>{s.d}</span>
          </Reveal>
        ))}
      </ol>
      {aside && <div className={x.view}>{aside}</div>}
    </Screen>
  );
}

export function Capabilities({ page, variant = "grid" }: { page: ProductPage; variant?: "grid" | "list" }) {
  const { title, intro, items } = page.does;
  return (
    <Screen id="does" fit="grow" bodyClassName={`l-container ${x.does} ${x[variant]}`} label={title}>
      <header className={x.head}>
        <h2 className="t-h2">{title}</h2>
        <p className={`t-statement ${x.intro}`}>{intro}</p>
      </header>
      <ul className={x.items}>
        {items.map((it, i) => (
          <Reveal as="li" key={it.t} order={(i % 3) + 1} className={x.item}>
            <b>{it.t}</b>
            <span>{it.d}</span>
          </Reveal>
        ))}
      </ul>
      <dl className={x.works}>
        {page.works.map((g) => (
          <div key={g.label} className={x.group}>
            <dt>{g.label}</dt>
            <dd className={x.names}>{g.items.join(", ")}</dd>
          </div>
        ))}
      </dl>
    </Screen>
  );
}
