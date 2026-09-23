"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Model } from "@/lib/types";
import {
  groupForPicker,
  isNew,
  latestListing,
  searchModels,
} from "@/lib/model-order";

interface ModelPickerProps {
  id?: string;
  models: Model[];
  value: string;
  onChange: (id: string) => void;
}

/**
 * Searchable model picker.
 *
 * Replaces a plain dropdown that had grown to 40 rows in insertion order —
 * newest releases at the very bottom, one provider's models scattered across
 * the list. Opening the picker focuses a search box; typing narrows with the
 * fuzzy matcher in lib/model-order.ts ("gpt6sol", "opus 5.5", "sol" all work).
 * With no query, models are grouped by provider, newest first.
 *
 * Implements the WAI-ARIA combobox pattern directly rather than pulling in a
 * dependency: input with role="combobox" + aria-activedescendant, a listbox,
 * arrow/Home/End/Enter/Escape handling, and click-outside to close.
 */
export function ModelPicker({ id, models, value, onChange }: ModelPickerProps) {
  const autoId = useId();
  const baseId = id ?? autoId;
  const listId = `${baseId}-list`;

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const selected = models.find((m) => m.id === value) ?? models[0];
  const today = useMemo(() => latestListing(models), [models]);

  // Flat list of options in display order; group headers are derived from it.
  const results = useMemo(() => searchModels(models, query), [models, query]);
  const searching = query.trim().length > 0;
  const groups = useMemo(
    () => (searching ? null : groupForPicker(models)),
    [models, searching],
  );

  const optionId = (i: number) => `${baseId}-opt-${i}`;

  function openPicker() {
    setQuery("");
    const i = searchModels(models, "").findIndex((m) => m.id === value);
    setActive(i < 0 ? 0 : i);
    setOpen(true);
  }

  function close(returnFocus = true) {
    setOpen(false);
    if (returnFocus) triggerRef.current?.focus();
  }

  function choose(m: Model) {
    onChange(m.id);
    close();
  }

  // Focus the search box on open.
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Click outside closes without stealing focus back.
  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) close(false);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  // Keep the active option visible while arrowing through the list.
  useEffect(() => {
    if (!open) return;
    listRef.current
      ?.querySelector<HTMLElement>(`#${CSS.escape(optionId(active))}`)
      ?.scrollIntoView({ block: "nearest" });
  }, [active, open]); // eslint-disable-line react-hooks/exhaustive-deps

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    const last = results.length - 1;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActive((a) => (a >= last ? 0 : a + 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActive((a) => (a <= 0 ? last : a - 1));
        break;
      case "Home":
        e.preventDefault();
        setActive(0);
        break;
      case "End":
        e.preventDefault();
        setActive(last);
        break;
      case "Enter":
        e.preventDefault();
        if (results[active]) choose(results[active]);
        break;
      case "Escape":
        e.preventDefault();
        close();
        break;
      case "Tab":
        close(false);
        break;
    }
  }

  function renderOption(m: Model, i: number, showProvider: boolean) {
    const isActive = i === active;
    const isSelected = m.id === value;
    return (
      <li
        key={m.id}
        id={optionId(i)}
        role="option"
        aria-selected={isSelected}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => choose(m)}
        onMouseMove={() => setActive(i)}
        className={cn(
          "flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm",
          isActive && "bg-muted",
        )}
      >
        <Check
          className={cn("h-3.5 w-3.5 shrink-0", isSelected ? "opacity-100" : "opacity-0")}
          aria-hidden
        />
        <span className={cn("truncate", m.status === "deprecated" && "text-muted-foreground")}>
          {m.name}
        </span>
        {showProvider && (
          <span className="text-muted-foreground truncate">· {m.provider}</span>
        )}
        {isNew(m, today) && (
          <span className="rounded bg-primary/10 px-1.5 py-px text-[10px] font-semibold uppercase tracking-wide text-primary">
            New
          </span>
        )}
        {m.status === "deprecated" && (
          <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
            Retired
          </span>
        )}
        <span className="ml-auto shrink-0 font-mono text-xs tabular-nums text-muted-foreground">
          ${m.pricing.input.toFixed(2)} / ${m.pricing.output.toFixed(2)}
        </span>
      </li>
    );
  }

  let index = -1;

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        id={baseId}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => (open ? close() : openPicker())}
        onKeyDown={(e) => {
          if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
            e.preventDefault();
            openPicker();
          }
        }}
        className="flex h-9 w-full items-center justify-between rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <span className="truncate">
          {selected?.name}{" "}
          <span className="text-muted-foreground">· {selected?.provider}</span>
        </span>
        <ChevronDown className="h-4 w-4 opacity-50" aria-hidden />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-md border border-border bg-background text-foreground shadow-md">
          <div className="flex items-center gap-2 border-b border-border px-3">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
            <input
              ref={inputRef}
              role="combobox"
              aria-expanded
              aria-controls={listId}
              aria-autocomplete="list"
              aria-activedescendant={results[active] ? optionId(active) : undefined}
              aria-label="Search models"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActive(0);
              }}
              onKeyDown={onKeyDown}
              placeholder="Search models — e.g. gpt 6, opus, flash…"
              className="h-9 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              autoComplete="off"
              spellCheck={false}
            />
          </div>

          <ul
            ref={listRef}
            id={listId}
            role="listbox"
            aria-label="Models"
            className="max-h-80 overflow-y-auto p-1"
          >
            {results.length === 0 && (
              <li className="px-2 py-6 text-center text-sm text-muted-foreground">
                No model matches “{query}”
              </li>
            )}

            {searching
              ? results.map((m) => renderOption(m, ++index, true))
              : groups?.map((g) => (
                  <li key={g.providerId} role="presentation">
                    <div
                      className="px-2 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
                      aria-hidden
                    >
                      {g.provider}
                    </div>
                    <ul role="group" aria-label={g.provider}>
                      {g.models.map((m) => renderOption(m, ++index, false))}
                    </ul>
                  </li>
                ))}
          </ul>
        </div>
      )}
    </div>
  );
}
