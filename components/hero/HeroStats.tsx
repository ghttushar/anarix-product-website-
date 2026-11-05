"use client";

import { Live } from "@/lib/live";

// Same stats and count-up treatment as the Anarix website hero.
const STATS = [
  { label: "GMV driven", value: 1.2, prefix: "$", suffix: "B", decimals: 1 },
  { label: "Brands managed", value: 500, prefix: "", suffix: "+", decimals: 0 },
  { label: "Avg TACoS", value: 12.8, prefix: "", suffix: "%", decimals: 1 },
];

export function HeroStats() {
  return (
    <div className="hero__stats">
      <dl className="hero__stat-grid">
        {STATS.map((s) => (
          <div key={s.label}>
            <dt>{s.label}</dt>
            <dd>
              <Live powered bad={0} good={s.value} jitter={0} prefix={s.prefix} suffix={s.suffix} decimals={s.decimals} />
            </dd>
          </div>
        ))}
      </dl>
      <p className="hero__trust">Trusted by 500+ brands on Amazon and Walmart</p>
    </div>
  );
}
