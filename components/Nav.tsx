import Link from "next/link";
import { Calculator as CalcIcon } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export function Nav() {
  return (
    <nav className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <CalcIcon className="h-4 w-4" />
          </div>
          <span className="font-semibold tracking-tight">AI Cost Calc</span>
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm">
          <a href="#calculator" className="text-muted-foreground hover:text-foreground transition-colors">
            Calculator
          </a>
          <a href="#compare" className="text-muted-foreground hover:text-foreground transition-colors">
            Compare
          </a>
          <a href="#forecast" className="text-muted-foreground hover:text-foreground transition-colors">
            Forecast
          </a>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
