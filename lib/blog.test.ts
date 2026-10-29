import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { describe, expect, it } from "vitest";
import { resolveBlogTokens } from "./blog-tokens";

const dir = path.join(process.cwd(), "content", "blog");
const posts = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));

describe("blog posts", () => {
  it.each(posts)("%s resolves every live-data token", (file) => {
    const { content, data } = matter(fs.readFileSync(path.join(dir, file), "utf8"));
    expect(() => resolveBlogTokens(content)).not.toThrow();
    expect(resolveBlogTokens(content)).not.toMatch(/\{\{/);
    for (const k of ["title", "description", "date"]) expect(data[k], k).toBeTruthy();
    if (data.lastUpdated) expect(String(data.lastUpdated) >= String(data.date)).toBe(true);
  });
});
