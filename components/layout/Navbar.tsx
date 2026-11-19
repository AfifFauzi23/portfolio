"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Moon, Sun, Menu, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useSmoothScroll } from "@/components/providers/SmoothScrollProvider";
import { profileData } from "@/data/content";
import { MOTION, getSafeTransition } from "@/lib/motion";

const NAV_LINKS = [
  { label: "Showreel", href: "#showreel" },
  { label: "Karya", href: "#projects" },
  { label: "Tentang", href: "#about" },
  { label: "Kontak", href: "#contact" },
];

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { scrollTo } = useSmoothScroll();
  const pathname = usePathname();
  const prefersReduced = useReducedMotion();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (pathname === "/" && href.startsWith("#")) {
      e.preventDefault();
      setMenuOpen(false);
      scrollTo(href);
    }
  };

  return (
    <header
      className={`sticky top-0 z-40 transition-colors duration-300 ${
        scrolled
          ? "border-b border-border bg-bg/85 backdrop-blur-md"
          : "border-b border-transparent bg-bg/0"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
        <Link
          href="/"
          className="font-display text-base font-semibold tracking-tight text-ink transition-colors hover:text-accent"
        >
          {profileData.name}
        </Link>

        {/* Navigasi desktop */}
        <nav
          aria-label="Navigasi utama"
          className="hidden items-center gap-8 md:flex"
        >
          {NAV_LINKS.map((item) => (
            <Link
              key={item.href}
              href={pathname === "/" ? item.href : `/${item.href}`}
              onClick={(e) => handleNavClick(e, item.href)}
              className="text-sm font-medium text-muted transition-colors hover:text-ink"
            >
              {item.label}
            </Link>
          ))}

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={
              theme === "dark" ? "Ubah ke mode terang" : "Ubah ke mode gelap"
            }
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-ink transition-colors hover:border-accent hover:text-accent"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </nav>

        {/* Kontrol mobile */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={
              theme === "dark" ? "Ubah ke mode terang" : "Ubah ke mode gelap"
            }
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-ink"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-ink"
          >
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Drawer mobile */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            id="mobile-nav"
            aria-label="Navigasi seluler"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={getSafeTransition(prefersReduced, {
              duration: MOTION.duration.fast,
              ease: MOTION.ease.editorial,
            })}
            className="overflow-hidden border-b border-border bg-bg md:hidden"
          >
            <div className="flex flex-col gap-1 px-5 py-4">
              {NAV_LINKS.map((item) => (
                <Link
                  key={item.href}
                  href={pathname === "/" ? item.href : `/${item.href}`}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="rounded-lg px-3 py-2.5 text-base font-medium text-ink transition-colors hover:bg-surface"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
