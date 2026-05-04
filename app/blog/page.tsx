import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getAllPostsMeta } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog — AI API Pricing & Optimization",
  description:
    "Deep dives on AI API pricing, cost optimization tactics, and model comparisons. From OpenAI to DeepSeek.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndexPage() {
  const posts = getAllPostsMeta();

  return (
    <main>
      <section className="border-b border-border">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-16 md:py-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary mb-3">
              <span className="h-1 w-4 rounded-full bg-primary" />
              Blog
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              AI API pricing, decoded
            </h1>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              In-depth guides on what AI APIs really cost, how to cut your bill,
              and which model wins for your workload.
            </p>
          </div>

          {posts.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">
              No posts yet — check back soon.
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group block rounded-xl border border-border bg-background p-6 hover:border-primary/50 hover:shadow-sm transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                        <time dateTime={post.date}>{formatDate(post.date)}</time>
                        {post.readingTime && (
                          <>
                            <span>·</span>
                            <span>{post.readingTime}</span>
                          </>
                        )}
                      </div>
                      <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </h2>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {post.description}
                      </p>
                      {post.tags && post.tags.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {post.tags.map((t) => (
                            <span
                              key={t}
                              className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0 mt-1 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
