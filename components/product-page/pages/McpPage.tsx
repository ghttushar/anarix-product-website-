"use client";

import { useState, type KeyboardEvent } from "react";
import { Screen } from "@/components/layout/Screen";
import { ToolPanel, WiringMap } from "@/components/illustrations/sets/nocturne/places";
import { Typewriter } from "@/components/motion/Typewriter";
import type { ProductPage } from "@/content/products/types";
import { CLIENTS, MCP_ANSWER, MCP_ASK, MCP_TOOL, type Client } from "@/content/products/samples";
import { NameHero } from "../NameHero";
import { Figure } from "../shared";
import { Close } from "../Close";
import m from "./mcp.module.css";

/*
  MCP: the wiring, from above. Technical, diagram-first. Pick any AI: the same
  question gets the same number, and it matches the dashboard.
*/
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
          <p className={m.tileSub}>Walmart ad spend, yesterday</p>
          <p className={m.tileFig}>
            <Figure text={MCP_ANSWER.figure} />
          </p>
          <p className={m.tileSub}>18 campaigns</p>
        </div>
      </div>
      <p className={m.note}>{page.moment.note}</p>
    </>
  );
}

function WhatItIs({ page }: { page: ProductPage }) {
  return (
    <>
      <div className={m.toolsArt}>
        <ToolPanel bubble="Four tools, one source." />
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
      <NameHero page={page} layout="hub" art={<WiringMap bubble={page.bubble} />} />
      <Screen id="pick-your-ai" bodyClassName={`l-container ${m.moment}`} label={page.moment.title}>
        <PickYourAi page={page} />
      </Screen>
      <Screen id="what-mcp-is" hasDock bodyClassName={`l-container ${m.proof}`} label={page.proof.title}>
        <WhatItIs page={page} />
      </Screen>
      <Close page={page} />
    </>
  );
}
