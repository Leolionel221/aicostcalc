#!/usr/bin/env node
/**
 * Parse every inline `actions/github-script` block the way the action itself does.
 *
 * The guard-trip escalation shipped with `].join('\n');` inside an object
 * literal. YAML parsed fine, the workflow ran, and the step died with
 * "SyntaxError: Unexpected token ';'" — so for six days a tripped guard failed
 * the run without ever filing the issue that was supposed to explain why.
 * The code that reports failures is exactly the code least likely to be
 * exercised in testing, so it gets checked mechanically instead.
 */
import fs from "node:fs";
import path from "node:path";
import YAML from "js-yaml";

const dir = ".github/workflows";
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
let failures = 0;
let checked = 0;

for (const file of fs.readdirSync(dir).filter((f) => /\.ya?ml$/.test(f))) {
  const doc = YAML.load(fs.readFileSync(path.join(dir, file), "utf8"));
  for (const job of Object.values(doc.jobs ?? {})) {
    for (const step of job.steps ?? []) {
      const src = step?.with?.script;
      if (!src || !String(step.uses ?? "").includes("github-script")) continue;
      checked += 1;
      try {
        new AsyncFunction("github", "context", "core", "require", src);
        console.log(`✅ ${file} › ${step.name ?? step.uses}`);
      } catch (err) {
        failures += 1;
        console.error(`❌ ${file} › ${step.name ?? step.uses}: ${err.message}`);
      }
    }
  }
}

console.log(`\n${checked} inline script(s) checked, ${failures} failing.`);
process.exit(failures ? 1 : 0);
