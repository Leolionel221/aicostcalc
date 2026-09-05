#!/usr/bin/env node
/**
 * Regression test for the auto-draft naming/id rules: every model already on
 * the site must be reproduced exactly from its registry key. A rule that
 * mis-names a model we already list would mis-name the next one too.
 */
import fs from "node:fs";
import { deriveId, deriveName } from "./lib/model-draft.mjs";

const models = JSON.parse(fs.readFileSync("data/models.json", "utf8")).models;
const keys = JSON.parse(fs.readFileSync("data/registry-keys.json", "utf8")).keys;
let bad = 0;
for (const m of models) {
  const key = keys[m.id];
  if (!key) { console.log(`❌ ${m.id}: no registry key`); bad++; continue; }
  const id = deriveId(key), name = deriveName(key);
  const okId = id === m.id, okName = name === m.name;
  if (!okId || !okName) {
    bad++;
    console.log(`❌ ${key.padEnd(30)} id ${okId ? "✓" : `✗ got "${id}"`}   name ${okName ? "✓" : `✗ got "${name}" want "${m.name}"`}`);
  }
}
console.log(bad ? `\n${bad} mismatch(es)` : `✅ all ${models.length} existing models reproduced exactly (id + name)`);
process.exit(bad ? 1 : 0);
