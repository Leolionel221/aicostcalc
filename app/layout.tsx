import type { Metadata } from "next";
import { Inter, Noto_Sans_SC } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { GA_MEASUREMENT_ID } from "@/lib/analytics";
import { Providers } from "./providers";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const notoSansSC = Noto_Sans_SC({
  variable: "--font-noto-sans-sc",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "AI API Cost Calculator — Compare LLM Pricing in 2026",
    template: "%s | AI Cost Calc",
  },
  description:
    "Free tool to calculate and compare API costs across OpenAI, Anthropic, Google, DeepSeek and 30+ LLM models. Includes prompt caching and Batch API pricing. Prices verified daily.",
  metadataBase: new URL("https://aicostcalc.net"),
  alternates: {
    canonical: "/",
  },
  keywords: [
    "ai api cost calculator",
    "llm pricing calculator",
    "openai api cost",
    "claude api pricing",
    "gpt cost calculator",
    "gemini api pricing",
    "ai api pricing comparison",
    "llm cost comparison",
  ],
  authors: [{ name: "AI Cost Calc" }],
  openGraph: {
    type: "website",
    siteName: "AI API Cost Calculator",
    locale: "en_US",
    url: "https://aicostcalc.net",
    title: "AI API Cost Calculator — Compare LLM Pricing in 2026",
    description:
      "Calculate exact API costs for 30+ LLM models including caching and batch discounts. Free, prices verified daily.",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI API Cost Calculator",
    description: "Compare AI model pricing across 10+ LLMs.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${notoSansSC.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground">
        <Providers>
          <Nav />
          <div className="flex-1">{children}</div>
          <Footer />
        </Providers>
        <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />
      </body>
    </html>
  );
}
