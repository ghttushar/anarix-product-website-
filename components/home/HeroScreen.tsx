import Link from "next/link";
import { Screen } from "@/components/layout/Screen";
import { Street } from "@/components/illustrations/sets/nocturne/Street";
import { hero } from "@/content/home";
import { Ink } from "./Ink";
import h from "./home.module.css";

/* 1 · The street that never closes. Thesis: one AI watching every store, always. */
export function HeroScreen() {
  return (
    <Screen id="top" hasDock bodyClassName={h.heroBody} label="Anarix platform">
      <div className={`l-container ${h.heroCopy}`}>
        <h1 className="t-display">
          <span>{hero.title[0]}</span> <span>{hero.title[1]}</span> <span className="t-accent">{hero.title[2]}</span>
        </h1>
        <p className="t-statement">
          <Ink text={hero.lede} />
        </p>
        <div className="c-actions">
          <a className="c-cta" href={hero.primary.href}>
            {hero.primary.label}
          </a>
          <Link className="c-link" href={hero.secondary.href}>
            {hero.secondary.label}
          </Link>
        </div>
      </div>
      <div className={h.heroStreet} data-bleed>
        <Street stop="top" bubble={hero.bubble} />
      </div>
    </Screen>
  );
}
