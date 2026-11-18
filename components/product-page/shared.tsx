"use client";

import { useEffect, useState, type ComponentType } from "react";
import { useScreen } from "@/components/layout/Screen";
import { AanCutaway, McpCutaway, ProfitCutaway, RulesCutaway, SignalsCutaway } from "@/components/illustrations/sets/nocturne/cutaways";
import { SignalCard } from "@/components/product-ui/SignalCard";
import { ProfitDayCard } from "@/components/product-ui/ProfitDayCard";
import { RulesTable } from "@/components/product-ui/RulesTable";
import { AanChat } from "@/components/product-ui/AanChat";
import { McpTerminal } from "@/components/product-ui/McpTerminal";
import type { ProductId } from "@/content/products/types";

/** each product's landmark on the street, drawn open, and the product UI it is about */
export const LANDMARK: Record<ProductId, ComponentType<{ stop?: string; bubble?: string }>> = {
  aan: AanCutaway,
  signals: SignalsCutaway,
  profitability: ProfitCutaway,
  rules: RulesCutaway,
  mcp: McpCutaway,
};

export const PRODUCT_UI: Record<ProductId, ComponentType<{ handled: boolean }>> = {
  aan: AanChat,
  signals: SignalCard,
  profitability: ProfitDayCard,
  rules: RulesTable,
  mcp: McpTerminal,
};

/** a card settles a beat after its screen's moment begins */
export function useHandled(delay = 350) {
  const { arrived } = useScreen();
  const [handled, setHandled] = useState(false);
  useEffect(() => {
    if (!arrived) return;
    const t = window.setTimeout(() => setHandled(true), delay);
    return () => window.clearTimeout(t);
  }, [arrived, delay]);
  return handled;
}

export const talkToAan = () => window.dispatchEvent(new Event("aan:open-chat"));
