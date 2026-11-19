import Link from "next/link";
import { Screen } from "@/components/layout/Screen";
import { PlatformStack } from "@/components/illustrations/sets/iso/PlatformStack";
import { hero } from "@/content/home";
import { Ink } from "./Ink";
import h from "./home.module.css";

/* 1 · One AI over every marketplace: the words, and the platform as a stack
   (your stores, one data layer, the tools with Aan on top). */
export function HeroScreen() {
  return (
    <Screen id="top" hasDock bodyClassName={`l-container ${h.heroBody}`} label="Anarix platform">
      <div className={h.heroCopy}>
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
      <div className={h.heroArt}>
        <PlatformStack stop="top" bubble={hero.bubble} />
      </div>
    </Screen>
  );
}
