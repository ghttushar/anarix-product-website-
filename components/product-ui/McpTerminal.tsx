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
      <header className={s.bar}>
        <i />
        <i />
        <i />
        <span>Claude · using anarix</span>
      </header>
      <div className={s.body}>
        <p className={s.you}>› What did I spend on Walmart ads yesterday?</p>
        <p className={`${s.tool} ${u.later}`}>anarix.get_ad_spend(marketplace: &quot;walmart&quot;, date: &quot;yesterday&quot;)</p>
        <Typewriter className={s.out} play={handled} delay={350} text="$3,412 across 18 campaigns. Top spender: Spring Sale ($890, ROAS 3.6)." />
        <p className={`${s.you} ${u.later}`} style={{ transitionDelay: "1500ms" }} data-optional>
          › Which of those lost money?
        </p>
        <p className={`${s.tool} ${u.later}`} style={{ transitionDelay: "1900ms" }} data-optional>
          anarix.get_profit(level: &quot;campaign&quot;, marketplace: &quot;walmart&quot;)
        </p>
        <span data-optional>
          <Typewriter className={s.out} play={handled} delay={2200} text="Two: Clearance Knives (−$140) and Brand Defense (−$62)." />
        </span>
      </div>
    </article>
  );
}
