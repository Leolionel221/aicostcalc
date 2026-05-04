function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
          <div className="col-span-2 md:col-span-1">
            <div className="font-semibold">AI Cost Calc</div>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed max-w-xs">
              Calculate and compare API pricing for 10+ LLM models. Updated monthly,
              transparent sources.
            </p>
          </div>

          <div>
            <div className="font-medium text-xs uppercase tracking-wider text-muted-foreground mb-3">
              Tool
            </div>
            <ul className="space-y-2">
              <li>
                <a href="/" className="hover:text-foreground transition-colors">
                  Calculator
                </a>
              </li>
              <li>
                <a href="/#compare" className="hover:text-foreground transition-colors">
                  Compare models
                </a>
              </li>
              <li>
                <a href="/#forecast" className="hover:text-foreground transition-colors">
                  Monthly forecast
                </a>
              </li>
              <li>
                <a href="/blog" className="hover:text-foreground transition-colors">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          <div>
            <div className="font-medium text-xs uppercase tracking-wider text-muted-foreground mb-3">
              Data sources
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://openai.com/api/pricing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  OpenAI pricing →
                </a>
              </li>
              <li>
                <a
                  href="https://www.anthropic.com/pricing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  Anthropic pricing →
                </a>
              </li>
              <li>
                <a
                  href="https://ai.google.dev/pricing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  Google AI pricing →
                </a>
              </li>
            </ul>
          </div>

          <div>
            <div className="font-medium text-xs uppercase tracking-wider text-muted-foreground mb-3">
              About
            </div>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://github.com/Leolionel221/aicostcalc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors"
                >
                  <GithubIcon className="h-3.5 w-3.5" />
                  GitHub
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-foreground transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-foreground transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="/privacy" className="hover:text-foreground transition-colors">
                  Privacy
                </a>
              </li>
              <li>
                <a href="/terms" className="hover:text-foreground transition-colors">
                  Terms
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border text-xs text-muted-foreground space-y-2">
          <p>
            Pricing data is provided for informational purposes only and may not reflect
            current rates. Always verify with the official provider before making business
            decisions.
          </p>
          <p>
            All provider names and logos are trademarks of their respective owners. We are
            not affiliated with, endorsed by, or sponsored by any AI provider.
          </p>
          <p className="pt-2">© 2026 AI Cost Calc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
