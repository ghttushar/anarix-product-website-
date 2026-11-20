"use client";

import { useState, type KeyboardEvent } from "react";
import { Screen } from "@/components/layout/Screen";
import { useRef } from "react";
import { AanDock } from "@/components/aan/v2/AanDock";
import { LightTrails } from "@/components/visual/LightTrails";
import { ProductFrame } from "@/components/visual/ProductFrame";
import { McpTerminal } from "@/components/product-ui/McpTerminal";
import { ProductVideo } from "@/components/media/ProductVideo";
import { Typewriter } from "@/components/motion/Typewriter";
import type { ProductPage } from "@/content/products/types";
import { CLIENTS, MCP_ANSWER, MCP_ASK, MCP_SERVER, MCP_SETUP, MCP_TOOL, type Client } from "@/content/products/samples";
import { NameHero } from "../NameHero";
import { Figure, useHandled } from "../shared";
import { Close } from "../Close";
import { Capabilities, HowItWorks } from "../Sections";
import m from "./mcp.module.css";

/*
  MCP: the light of every AI runs into Anarix (the hero), then what it is, in
  the AI you already use. Pick any AI: the same question gets the same
  number, and it matches the dashboard.
*/

/* the hero: each AI client on the edges, its light running in to Aan over the name */
function McpHub({ bubble }: { bubble: string }) {
  const hub = useRef<HTMLSpanElement>(null);
  const left = CLIENTS.slice(0, 2);
  const right = CLIENTS.slice(2);
  return (
    <div className={m.hub}>
      <LightTrails aim={hub} from="left" count={7} spread={[0.2, 0.8]} bend={1.3} glow={false} className={m.hubTrails} />
      <LightTrails aim={hub} from="right" count={7} spread={[0.2, 0.8]} bend={1.3} glow={false} className={m.hubTrails} />
      <ul className={m.hubSide} data-side="left">
        {left.map((c) => (
          <li key={c}>{c}</li>
        ))}
      </ul>
      <ul className={m.hubSide} data-side="right">
        {right.map((c) => (
          <li key={c}>{c}</li>
        ))}
      </ul>
      <span ref={hub} className={m.hubSpot}>
        <AanDock stop="mcp" size={30} sizeSm={20} bubble={bubble || undefined} side="right" act="look" style={{ left: "50%", bottom: 0 }} />
      </span>
    </div>
  );
}

/* what MCP is: your AI asking Anarix, with Aan beside the answer */
function ToolCard() {
  const handled = useHandled(500);
  const spot = useRef<HTMLSpanElement>(null);
  return (
    <>
      <LightTrails aim={spot} from="left" count={8} bend={1.4} className={m.toolsTrails} />
      <ProductFrame title="Claude / Anarix MCP" note="Illustrative" lean="right">
        <McpTerminal handled={handled} bare />
      </ProductFrame>
      <span ref={spot} className={m.toolsSpot}>
        <AanDock stop="tools" size={26} sizeSm={18} act="look" style={{ left: "50%", bottom: 0 }} />
      </span>
    </>
  );
}
/* the self-serve way in: this AI's setup path and the server address to copy */
function Connect({ client }: { client: Client }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(MCP_SERVER).then(
      () => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
      },
      () => {},
    );
  };
  return (
    <div className={m.connect}>
      <p className={m.connectTitle}>Connect {client === "Your agent" ? "your agent" : client}</p>
      <ol className={m.connectSteps}>
        {MCP_SETUP[client].map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ol>
      <div className={m.server}>
        <code>{MCP_SERVER}</code>
        <button type="button" onClick={copy} aria-live="polite">
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}

function PickYourAi({ page }: { page: ProductPage }) {
  const [pick, setPick] = useState(0);
  const client: Client = CLIENTS[pick];
  const agent = client === "Your agent";

  // arrow keys move between tabs, as a tab list should
  const onKey = (e: KeyboardEvent) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next = (pick + (e.key === "ArrowRight" ? 1 : CLIENTS.length - 1)) % CLIENTS.length;
    setPick(next);
    document.getElementById(`ai-tab-${next}`)?.focus();
  };

  return (
    <>
      <header className={m.head}>
        <h2 className={m.title}>{page.moment.title}</h2>
        <p className={m.hint}>{page.moment.hint}</p>
      </header>
      <div className={m.tabs} role="tablist" aria-label="AI clients" onKeyDown={onKey}>
        {CLIENTS.map((c, i) => (
          <button
            key={c}
            id={`ai-tab-${i}`}
            type="button"
            role="tab"
            aria-selected={pick === i}
            aria-controls="ai-panel"
            tabIndex={pick === i ? 0 : -1}
            className={m.tab}
            onClick={() => setPick(i)}
          >
            {c}
          </button>
        ))}
      </div>
      <div id="ai-panel" role="tabpanel" aria-labelledby={`ai-tab-${pick}`} className={m.panel}>
        <div className={`${m.window} ${agent ? m.terminal : ""}`} key={client}>
          <p className={m.bar}>
            <i />
            <i />
            <i />
            <span>{agent ? "your-agent · using anarix" : `${client} · using anarix`}</span>
          </p>
          <div className={m.body}>
            <p className={m.ask}>
              {agent ? "› " : ""}
              {MCP_ASK}
            </p>
            <p className={m.tool}>→ {MCP_TOOL}</p>
            <p className={m.answer} aria-live="polite">
              <b>{MCP_ANSWER.figure}</b> <Typewriter text={MCP_ANSWER.rest} play delay={350} />
            </p>
          </div>
        </div>
        <span className={m.equals} aria-hidden="true">
          <i />
          <i />
        </span>
        <div className={m.tile}>
          <p className={m.tileK}>Anarix dashboard</p>
          <p className={m.tileSub}>Walmart ad spend, this month</p>
          <p className={m.tileFig}>
            <Figure text={MCP_ANSWER.figure} />
          </p>
          <p className={m.tileSub}>18 campaigns</p>
        </div>
        <Connect client={client} />
      </div>
      <p className={m.note}>{page.moment.note}</p>
    </>
  );
}

function WhatItIs({ page }: { page: ProductPage }) {
  return (
    <>
      <div className={m.toolsArt}>
        <ToolCard />
      </div>
      <div className={m.toolsCopy}>
        <h2 className={m.title}>{page.proof.title}</h2>
        <p className={m.hint}>{page.proof.line}</p>
        <p className={m.note}>{page.proof.note}</p>
      </div>
    </>
  );
}

export function McpPage({ page }: { page: ProductPage }) {
  return (
    <>
      <NameHero page={page} layout="hub" art={<McpHub bubble={page.bubble} />} />
      {/* what MCP is comes first: most sellers have never heard of it */}
      <Screen id="what-mcp-is" hasDock bodyClassName={`l-container ${m.proof}`} label={page.proof.title}>
        <WhatItIs page={page} />
      </Screen>
      {/* the hero keeps its wiring map; the setup video sits with the steps */}
      <HowItWorks page={page} variant="aside" aside={<ProductVideo video={page.video} title="MCP setup video" fitRatio={1.6} fallback={<McpTerminal handled />} />} />
      <Screen id="pick-your-ai" fit="grow" bodyClassName={`l-container ${m.moment}`} label={page.moment.title}>
        <PickYourAi page={page} />
      </Screen>
      <Capabilities page={page} variant="list" />
      <Close page={page} />
    </>
  );
}
