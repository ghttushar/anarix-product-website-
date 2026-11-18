import { Screen } from "@/components/layout/Screen";
import { Reveal } from "@/components/motion/Reveal";
import { mission } from "@/content/home";
import { Ink } from "./Ink";
import h from "./home.module.css";

/* 2 · The promise, with its proof directly beneath it. The figures are
   stated, not performed: no count-up, they settle in reading order. */
export function MissionScreen() {
  return (
    <Screen id="mission" bodyClassName={`l-container ${h.mission}`} label="Our mission">
      <Reveal as="h2" className={h.missionStatement}>
        <Ink text={mission.statement} />
      </Reveal>
      <ul className={h.proof}>
        {mission.proof.map((p, i) => (
          <Reveal as="li" key={p.figure} order={i + 2}>
            <b>{p.figure}</b>
            <span>{p.text}</span>
          </Reveal>
        ))}
      </ul>
    </Screen>
  );
}
