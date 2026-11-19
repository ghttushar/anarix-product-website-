"use client";

import { Screen } from "@/components/layout/Screen";
import { Reveal } from "@/components/motion/Reveal";
import { works } from "@/content/home";
import w from "./works.module.css";

/*
  Where Anarix plugs in, before Meet Aan: the marketplaces it reads, the team
  apps it reports to and the AI it answers through. Names as type, never logos.
*/
export function WorksWithScreen() {
  return (
    <Screen id="works-with" fit="grow" bodyClassName={`l-container ${w.body}`} label={works.title}>
      <header className={w.head}>
        <h2 className="t-h2">{works.title}</h2>
        <p className="t-statement">{works.line}</p>
      </header>
      <div className={w.groups}>
        {works.groups.map((g, i) => (
          <Reveal key={g.label} order={i + 1} className={w.group}>
            <h3>{g.label}</h3>
            <ul>
              {g.items.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </Screen>
  );
}
