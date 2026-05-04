import Link from "next/link";
import { LogoMark } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

export function Nav() {
  return (
    <nav className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <LogoMark size={28} />
          <span className="font-semibold tracking-tight">AI Cost Calc</span>
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
            Calculator
          </Link>
          <Link href="/blog" className="text-muted-foreground hover:text-foreground transition-colors">
            Blog
          </Link>
          <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
            About
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
