import type { Metadata } from "next";
import { Inter, Noto_Sans_SC } from "next/font/google";
import { Providers } from "./providers";
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
    template: "%s | AI API Cost Calculator",
  },
  description:
    "Free tool to calculate and compare API costs across OpenAI, Anthropic, Google, DeepSeek and 20+ LLM models. Updated monthly.",
  metadataBase: new URL("https://aicostcalc.net"),
  openGraph: {
    type: "website",
    siteName: "AI API Cost Calculator",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
