import type { ReactNode } from "react";

export function LegalPage({
  title,
  lastUpdated,
  children,
}: {
  title: string;
  lastUpdated?: string;
  children: ReactNode;
}) {
  return (
    <main className="mx-auto max-w-3xl px-4 sm:px-6 py-12 md:py-20">
      <header className="mb-10 pb-8 border-b border-border">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{title}</h1>
        {lastUpdated && (
          <p className="mt-3 text-sm text-muted-foreground">
            Last updated: {lastUpdated}
          </p>
        )}
      </header>
      <div className="prose-content space-y-6 text-base leading-relaxed">
        {children}
      </div>
    </main>
  );
}
