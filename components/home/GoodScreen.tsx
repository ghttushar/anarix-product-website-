import { Screen } from "@/components/layout/Screen";
import { Reveal } from "@/components/motion/Reveal";
import { Guardrails } from "@/components/illustrations/sets/iso/Guardrails";
import { good } from "@/content/home";
import h from "./home.module.css";

/* 4 · AI for good: why you can trust Aan with the night it just watched. */
export function GoodScreen() {
  return (
    <Screen id="ai-for-good" hasDock fit="grow" bodyClassName={`l-container l-grid ${h.split}`} label="AI for good">
      <div className={h.copy}>
        <h2 className="t-h2">
          {good.title}
          <br />
          <span className={h.goodLine}>{good.line}</span>
        </h2>
        <ul className={h.commitments}>
          {good.commitments.map((c, i) => (
            <Reveal as="li" key={c.title} order={i + 1}>
              <b>{c.title}</b>
              <span>{c.text}</span>
            </Reveal>
          ))}
        </ul>
      </div>
      <div className={`${h.visual} ${h.goodArt}`}>
        <Guardrails bubble={good.bubble} />
      </div>
    </Screen>
  );
}
