"use client";

import { MediaSlot, usePowered } from "./shared";

const LEFT = [
  { name: "Amazon", x: 110 },
  { name: "Walmart", x: 250 },
  { name: "Shopify", x: 390 },
];
const RIGHT = [
  { name: "Claude", x: 610 },
  { name: "ChatGPT", x: 750 },
  { name: "Gemini", x: 890 },
];

const root = (x: number) => `M500,318 C500,400 ${x},380 ${x},470`;

function McpDiagram() {
  const [ref] = usePowered<HTMLDivElement>();
  return (
    <div ref={ref} className="mcp-diagram">
      <svg viewBox="0 0 1000 560" className="mcp-svg" role="img" aria-label="The lazy Susan spins on the Anarix MCP spindle, whose roots connect Amazon, Walmart and Shopify to Claude, ChatGPT and Gemini">
        {/* the plate, seen from below the hero */}
        <ellipse cx="500" cy="92" rx="190" ry="50" className="mcp-plate-edge" />
        <ellipse cx="500" cy="80" rx="190" ry="50" className="mcp-plate" />
        <ellipse cx="500" cy="80" rx="54" ry="14" className="mcp-line mcp-line--soft" />
        {[0, 1, 2, 3].map((k) => {
          const a = (k * Math.PI) / 2 + Math.PI / 4;
          return (
            <line
              key={k}
              x1={Math.round(500 + 54 * Math.cos(a))}
              y1={Math.round(80 + 14 * Math.sin(a))}
              x2={Math.round(500 + 190 * Math.cos(a))}
              y2={Math.round(80 + 50 * Math.sin(a))}
              className="mcp-line mcp-line--soft"
            />
          );
        })}
        <text x="500" y="122" textAnchor="middle" className="mcp-small">
          AAN · SIGNALS · PROFITABILITY · RULES
        </text>

        {/* spindle */}
        <path d="M490,104 V232 M510,104 V232" className="mcp-line" />
        <path d="M500,104 V232" className="mcp-pulse mcp-pulse--up" />

        {/* hub: Aan drops into the socket on top and powers every root */}
        <path d="M380,262 L420,230 H640 L600,262 Z" className="mcp-face" />
        <path d="M600,262 L640,230 V286 L600,318 Z" className="mcp-face mcp-face--side" />
        <rect x="380" y="262" width="220" height="56" rx="4" className="mcp-hub" />
        <ellipse cx="510" cy="246" rx="34" ry="9" className="mcp-socket" />
        <ellipse cx="510" cy="246" rx="20" ry="5" className="mcp-socket mcp-socket--in" />
        <text x="490" y="296" textAnchor="middle" className="mcp-hub-label">
          ANARIX MCP
        </text>

        {/* roots */}
        {[...LEFT, ...RIGHT].map((n, i) => (
          <g key={n.name}>
            <path d={root(n.x)} className="mcp-line" />
            <path
              d={root(n.x)}
              className={`mcp-pulse ${i < 3 ? "mcp-pulse--in" : "mcp-pulse--out"}`}
              style={{ animationDelay: `${i * 0.25}s` }}
            />
            <rect x={n.x - 56} y="470" width="112" height="40" rx="20" className="mcp-node" />
            <text x={n.x} y="495" textAnchor="middle" className="mcp-node-label">
              {n.name}
            </text>
          </g>
        ))}
        <text x="250" y="545" textAnchor="middle" className="mcp-small">
          YOUR MARKETPLACES
        </text>
        <text x="750" y="545" textAnchor="middle" className="mcp-small">
          ANY AI CLIENT
        </text>
      </svg>
      {/* Aan's dock: the hub of the plate */}
      <div
        className="mcp-dock"
        style={{ left: "51%", top: `${(218 / 560) * 100}%` }}
        data-dock
        data-size="62"
        data-size-sm="40"
        data-state="cube"
        data-bubble="Connected to 3 AIs."
        aria-hidden="true"
      />
    </div>
  );
}

export function McpSection() {
  return (
    <section id="mcp" data-stop="mcp" className="mcp">
      <div className="container">
        <div className="mcp__head">
          <p className="eyebrow">MCP · The spindle under everything</p>
          <h2 className="display h2">Your data. Any AI.</h2>
          <p className="lede">Plug Anarix into Claude, ChatGPT or Gemini. The same numbers, wherever you work.</p>
        </div>
        <McpDiagram />
        <div className="mcp__grid">
          <div className="term" aria-label="Example: Claude using Anarix MCP">
            <div className="term__bar">
              <i />
              <i />
              <i />
              <span>Claude · using anarix</span>
            </div>
            <div className="term__body">
              <p className="term__you">› What did I spend on Walmart ads yesterday?</p>
              <p className="term__tool">⚙ anarix.get_ad_spend(marketplace: &quot;walmart&quot;, date: &quot;yesterday&quot;)</p>
              <p className="term__out">
                $3,412 across 18 campaigns. Top spender: Spring Sale ($890, ROAS 3.6).
              </p>
              <p className="term__you">› Which of those lost money?</p>
              <p className="term__tool">⚙ anarix.get_profit(level: &quot;campaign&quot;, marketplace: &quot;walmart&quot;)</p>
              <p className="term__out">
                Two: Clearance Knives (−$140) and Brand Defense (−$62).<span className="caret" />
              </p>
            </div>
            <p className="term__note">Illustrative example</p>
          </div>
          <MediaSlot kind="video" label="MCP setup in 60 seconds" ratio="16 / 10" />
        </div>
      </div>
    </section>
  );
}
