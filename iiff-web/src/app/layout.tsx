import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { playfair, inter, notoSansKR } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "IIFF — Incheon International Film Festival",
  description:
    "Incheon International Film Festival NextWave 2026. Where cinema, culture, and technology converge.",
  openGraph: {
    title: "IIFF — Incheon International Film Festival",
    description:
      "NextWave 2026. Where cinema, culture, and technology converge.",
    locale: "ko_KR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      suppressHydrationWarning
      className={`${playfair.variable} ${inter.variable} ${notoSansKR.variable}`}
    >
      <body>
        <a href="#main-content" className="skip-link">Skip to content</a>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
