/**
 * Keep marketing copy in step with a price change the sync just applied.
 *
 * The sync corrects `pricing.*` fields unattended, but taglines and
 * descriptions quote those same numbers in prose. On 2026-09-13 the bot moved
 * deepseek-v4-flash to $0.30/$1.20 while its description kept saying
 * "$0.44 input / $1.32 output" — the price table and the sentence above it
 * disagreed for ten days. Auto-drafted copy quotes prices too, so every draft
 * would go stale on its first price change.
 *
 * Two rules, deliberately narrow:
 *   - A model's own old prices are rewritten in that model's own copy.
 *   - An old "$in/$out" pair is rewritten in every model's copy — pairs are
 *     how siblings are cited ("GPT-5.6 ($4.00/$20.00)") and specific enough
 *     not to collide.
 * Derived claims ("20% cheaper than…") cannot be rewritten mechanically; those
 * models are reported so a human can re-read them.
 */

const FIELDS = ["tagline", "description"];

/** Every way a price is written in our copy: "$4.00", and "$4" / "$0.5" for short forms. */
function forms(v) {
  const out = new Set([`$${v.toFixed(2)}`]);
  if (Number.isInteger(v)) out.add(`$${v}`);
  else if (Math.round(v * 10) === v * 10) out.add(`$${v.toFixed(1)}`);
  return [...out];
}

/** Two-decimal forms become two-decimal; short forms stay short when the new value allows. */
function render(form, to) {
  const twoDecimals = /\.\d\d$/.test(form);
  return twoDecimals || !Number.isInteger(to) ? `$${to.toFixed(2)}` : `$${to}`;
}

const esc = (s) => s.replace(/[$.]/g, "\\$&");
// Not followed by another digit or by ".digit": "$4" never eats "$4.50", "$4/$20" never eats "$4/$200".
const END = "(?![0-9]|\\.[0-9])";

// A lone price only — never one half of a "$x/$y" pair. Own prices appear as
// "$X input / $Y output" (spaced) or as a pair, which replacePair handles; a
// tight "$x/$y" inside a model's own copy is a citation of some other model,
// and rewriting half of it corrupts the citation ("$4/$200" -> "$3/$200").
const LONE_BEFORE = "(?<!/)";
const LONE_AFTER = "(?!/\\$)";

function replaceMoney(text, from, to) {
  let changed = false;
  for (const f of forms(from)) {
    const next = text.replace(new RegExp(LONE_BEFORE + esc(f) + END + LONE_AFTER, "g"), render(f, to));
    if (next !== text) { changed = true; text = next; }
  }
  return { text, changed };
}

function replacePair(text, before, after) {
  let changed = false;
  for (const fi of forms(before.input)) for (const fo of forms(before.output)) {
    const re = new RegExp(esc(fi) + "/" + esc(fo) + END, "g");
    const next = text.replace(re, `${render(fi, after.input)}/${render(fo, after.output)}`);
    if (next !== text) { changed = true; text = next; }
  }
  return { text, changed };
}

const COMPARATIVE = /\d+%\s*(cheaper|more)|\d+(\.\d+)?x\s|便宜\s*\d+%|的\s*\d+(\.\d+)?\s*倍/;

/**
 * @param changes  [{ model, before: {input,output,cachedInput}, after: {...} }]
 * @param models   the full dataset (mutated in place)
 * @returns { rewritten: string[], review: string[] }
 */
export function rewriteCopy(changes, models) {
  const rewritten = new Set();
  const review = new Set();

  for (const { model, before, after } of changes) {
    // 1) everyone's copy, first: the old in/out pair as a citation
    if (before.input !== after.input || before.output !== after.output) {
      for (const m of models) for (const lang of ["en", "zh"]) for (const f of FIELDS) {
        const r = replacePair(m.i18n[lang][f], before, after);
        if (r.changed) { m.i18n[lang][f] = r.text; rewritten.add(m.id); }
      }
    }
    // 2) the model's own copy, lone prices only: every changed price field
    for (const key of ["input", "output", "cachedInput"]) {
      const a = before[key], b = after[key];
      if (a == null || b == null || a === b) continue;
      for (const lang of ["en", "zh"]) for (const f of FIELDS) {
        const r = replaceMoney(model.i18n[lang][f], a, b);
        if (r.changed) { model.i18n[lang][f] = r.text; rewritten.add(model.id); }
      }
    }
    // 3) anything with a derived comparison needs eyes
    for (const m of models) {
      const cites = m.id === model.id ||
        FIELDS.some((f) => m.i18n.en[f].includes(model.name));
      if (cites && FIELDS.some((f) => COMPARATIVE.test(m.i18n.en[f]) || COMPARATIVE.test(m.i18n.zh[f]))) {
        review.add(m.id);
      }
    }
  }
  return { rewritten: [...rewritten], review: [...review] };
}
