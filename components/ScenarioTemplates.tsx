"use client";

import {
  MessageCircle,
  Code,
  FileText,
  Database,
  Filter,
  Languages,
  type LucideIcon,
} from "lucide-react";
import scenariosData from "@/data/scenarios.json";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, LucideIcon> = {
  MessageCircle,
  Code,
  FileText,
  Database,
  Filter,
  Languages,
};

export interface Scenario {
  id: string;
  icon: string;
  i18n: { en: { name: string; hint: string }; zh: { name: string; hint: string } };
  inputTokens: number;
  outputTokens: number;
  callsPerDay: number;
  recommendedModelIds: string[];
}

export const SCENARIOS = scenariosData.scenarios as Scenario[];

interface ScenarioTemplatesProps {
  onSelect: (scenario: Scenario) => void;
  activeId?: string | null;
  className?: string;
}

export function ScenarioTemplates({
  onSelect,
  activeId,
  className,
}: ScenarioTemplatesProps) {
  return (
    <div className={className}>
      <div className="text-xs text-muted-foreground mb-2">Quick start with a use case</div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {SCENARIOS.map((s) => {
          const Icon = ICON_MAP[s.icon] ?? MessageCircle;
          const active = activeId === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onSelect(s)}
              className={cn(
                "flex flex-col items-start gap-1 p-3 rounded-lg border text-left transition-colors hover:border-primary/50",
                active
                  ? "border-primary bg-primary/5"
                  : "border-border bg-background"
              )}
            >
              <div className="flex items-center gap-2 w-full">
                <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-sm font-medium truncate">{s.i18n.en.name}</span>
              </div>
              <div className="text-[10px] text-muted-foreground font-mono">
                {s.inputTokens} in · {s.outputTokens} out · {s.callsPerDay}/day
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
