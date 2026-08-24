import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";
import { resolveBlogTokens } from "./blog-tokens";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export interface BlogPostFrontmatter {
  title: string;
  description: string;
  date: string;
  author?: string;
  tags?: string[];
  readingTime?: string;
  featured?: boolean;
}

export interface BlogPostMeta extends BlogPostFrontmatter {
  slug: string;
}

export interface BlogPost extends BlogPostMeta {
  contentHtml: string;
}

function ensureBlogDir(): boolean {
  return fs.existsSync(BLOG_DIR);
}

export function getAllPostSlugs(): string[] {
  if (!ensureBlogDir()) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

export function getAllPostsMeta(): BlogPostMeta[] {
  return getAllPostSlugs()
    .map((slug) => {
      const filePath = path.join(BLOG_DIR, `${slug}.md`);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const { data } = matter(fileContent);
      const fm = data as BlogPostFrontmatter;
      return { slug, ...fm };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const filePath = path.join(BLOG_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);

  const processed = await remark()
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: false })
    .process(resolveBlogTokens(content));

  const fm = data as BlogPostFrontmatter;
  return {
    slug,
    ...fm,
    contentHtml: processed.toString(),
  };
}
