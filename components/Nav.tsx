import Link from "next/link";
import { LogoMark } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/", label: "Calculator", desktopOnly: true },
  { href: "/changes", label: "Changes" },
  { href: "/api", label: "API" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About", desktopOnly: true },
];

export function Nav() {
  return (
    <nav className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <LogoMark size={28} />
          <span className="font-semibold tracking-tight whitespace-nowrap">AI Cost Calc</span>
        </Link>

        {/* Phones keep the three links people come for; the logo is the calculator
            and About lives in the footer. All five were hidden below md, with no menu. */}
        <div className="flex items-center gap-4 md:gap-6 text-sm">
          {LINKS.map(({ href, label, desktopOnly }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "text-muted-foreground hover:text-foreground transition-colors",
                desktopOnly && "hidden md:inline",
              )}
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
