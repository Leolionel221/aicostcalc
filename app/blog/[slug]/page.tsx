import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getAllPostSlugs, getPostBySlug } from "@/lib/blog";
import { SITE } from "@/lib/seo";

export const dynamicParams = false;

export async function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  const url = `${SITE.url}/blog/${slug}`;

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url,
      publishedTime: post.date,
      authors: post.author ? [post.author] : undefined,
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: { "@type": "Organization", name: post.author ?? SITE.name },
    publisher: { "@type": "Organization", name: SITE.name },
    url: `${SITE.url}/blog/${slug}`,
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <article className="mx-auto max-w-3xl px-4 sm:px-6 py-12 md:py-16">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to blog
        </Link>

        <header className="mb-10 pb-8 border-b border-border">
          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            {post.readingTime && (
              <>
                <span>·</span>
                <span>{post.readingTime}</span>
              </>
            )}
            {post.author && (
              <>
                <span>·</span>
                <span>{post.author}</span>
              </>
            )}
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-[1.1]">
            {post.title}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            {post.description}
          </p>
          {post.tags && post.tags.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {post.tags.map((t) => (
                <span
                  key={t}
                  className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </header>

        <div
          className="prose-content"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />

        <footer className="mt-16 pt-8 border-t border-border">
          <div className="rounded-xl border border-border bg-muted/30 p-6 text-center">
            <h3 className="font-semibold text-lg mb-2">Try the calculator</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Plug in your workload and see exactly what the numbers in this article
              mean for your bill.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Open calculator
              <ArrowLeft className="h-3.5 w-3.5 rotate-180" />
            </Link>
          </div>
        </footer>
      </article>
    </main>
  );
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
