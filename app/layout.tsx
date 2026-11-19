import type { Metadata } from "next";
import { Anybody, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/data/content";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { ProjectTransitionProvider } from "@/components/providers/ProjectTransitionProvider";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const anybody = Anybody({
  subsets: ["latin"],
  weight: "variable",
  axes: ["wdth"],
  variable: "--font-anybody",
  display: "swap",
});

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-plex-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: siteConfig.seo.title,
  description: siteConfig.seo.description,
  metadataBase: new URL(siteConfig.seo.url),
  openGraph: {
    title: siteConfig.seo.title,
    description: siteConfig.seo.description,
    url: siteConfig.seo.url,
    siteName: "Afif Fauzi Portfolio",
    images: [
      {
        url: siteConfig.seo.ogImage,
        width: 1600,
        height: 900,
        alt: siteConfig.seo.title,
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.seo.title,
    description: siteConfig.seo.description,
    images: [siteConfig.seo.ogImage],
  },
};

const themeInitScript = `
(function() {
  try {
    var stored = localStorage.getItem('afif-theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var dark = stored ? stored === 'dark' : prefersDark;
    document.documentElement.classList.toggle('dark', dark);
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={`${anybody.variable} ${ibmPlexSans.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-screen bg-bg font-sans text-ink antialiased">
        <ThemeProvider>
          <SmoothScrollProvider>
            <ProjectTransitionProvider>
              <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-accent-contrast"
              >
                Lewati ke konten utama
              </a>
              <CustomCursor />
              <Navbar />
              <main id="main-content">{children}</main>
              <Footer />
            </ProjectTransitionProvider>
          </SmoothScrollProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
