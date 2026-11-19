"use client";

import { Typewriter } from "@/components/motion/Typewriter";
import u from "./ui.module.css";
import s from "./mcp-terminal.module.css";

/*
  Claude using Anarix MCP, illustrative. Its one moment: the AI calls an
  Anarix tool and answers with the same numbers as the dashboard.
*/
export function McpTerminal({ handled }: { handled: boolean }) {
  return (
    <article className={`${u.card} ${s.term}`} data-ui data-state={handled ? "handled" : "open"} aria-hidden="true">
      <header className={s.bar} data-part="1">
        <i />
        <i />
        <i />
        <span>Claude · using anarix</span>
      </header>
      <div className={s.body}>
        <p className={s.you} data-part="2">› What did I spend on Walmart ads this month?</p>
        <p className={`${s.tool} ${u.later}`} data-part="3">→ Anarix · ad spend · Walmart · this month</p>
        <span data-part="4" style={{ display: "block" }}>
          <Typewriter className={s.out} play={handled} delay={350} text="$3,412 across 18 campaigns. Top spender: Spring Sale ($890, ROAS 3.6)." />
        </span>
        <p className={`${s.you} ${u.later}`} style={{ transitionDelay: "1500ms" }} data-optional>
          › Which of those lost money?
        </p>
        <p className={`${s.tool} ${u.later}`} style={{ transitionDelay: "1900ms" }} data-optional>
          → Anarix · profit by campaign · Walmart
        </p>
        <span data-optional>
          <Typewriter className={s.out} play={handled} delay={2200} text="Two: Clearance Knives (−$140) and Brand Defense (−$62)." />
        </span>
      </div>
    </article>
  );
}
