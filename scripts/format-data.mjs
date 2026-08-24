#!/usr/bin/env node
/**
 * Normalise data/models.json to exactly the shape scripts/sync-prices.mjs writes.
 *
 * Node's JSON.stringify emits `1` where Python's json.dump emits `1.0`. Both are
 * the same number, but the mismatch meant the first automated commit showed 96
 * insertions and 96 deletions for a single corrected price — and a diff nobody
 * can skim is a diff nobody will check.
 *
 * Run this after hand-editing the dataset with anything other than Node.
 */
import fs from "node:fs";
import path from "node:path";

const file = path.join(process.cwd(), "data", "models.json");
const before = fs.readFileSync(file, "utf8");
const after = `${JSON.stringify(JSON.parse(before), null, 2)}\n`;

if (before === after) {
  console.log("data/models.json already normalised.");
  process.exit(0);
}
fs.writeFileSync(file, after);
const delta = after.split("\n").length - before.split("\n").length;
console.log(`Normalised data/models.json (${delta >= 0 ? "+" : ""}${delta} lines).`);
