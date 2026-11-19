"use client";

import React, { createContext, useContext, useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname } from "next/navigation";

gsap.registerPlugin(ScrollTrigger);

interface SmoothScrollContextValue {
  scrollTo: (target: string | number | HTMLElement) => void;
  stop: () => void;
  start: () => void;
}

const SmoothScrollContext = createContext<SmoothScrollContextValue>({
  scrollTo: () => {},
  stop: () => {},
  start: () => {},
});

export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);

    const tickerFn = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerFn);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tickerFn);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Reset posisi scroll & segarkan ScrollTrigger saat pindah rute
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
    const timer = window.setTimeout(() => {
      ScrollTrigger.refresh();
    }, 120);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  const scrollTo = (target: string | number | HTMLElement) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, { offset: -72 });
      return;
    }
    if (typeof target === "number") {
      window.scrollTo({ top: target, behavior: "auto" });
    } else if (typeof target === "string") {
      const el = document.querySelector(target);
      el?.scrollIntoView({ behavior: "auto" });
    } else {
      target.scrollIntoView({ behavior: "auto" });
    }
  };

  const stop = () => {
    lenisRef.current?.stop();
  };

  const start = () => {
    lenisRef.current?.start();
  };

  return (
    <SmoothScrollContext.Provider value={{ scrollTo, stop, start }}>
      {children}
    </SmoothScrollContext.Provider>
  );
}

export function useSmoothScroll() {
  return useContext(SmoothScrollContext);
}
