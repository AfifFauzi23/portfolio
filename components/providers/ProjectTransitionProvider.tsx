"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { MOTION } from "@/lib/motion";

interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface ActiveTransition {
  slug: string;
  src: string;
  alt: string;
  from: Rect;
  to: Rect | null;
}

interface ProjectTransitionContextValue {
  startProjectTransition: (params: {
    slug: string;
    src: string;
    alt: string;
    element: HTMLElement | null;
  }) => void;
  registerTargetRect: (slug: string, rect: Rect) => void;
  isTransitioningSlug: (slug: string) => boolean;
}

const ProjectTransitionContext = createContext<ProjectTransitionContextValue>({
  startProjectTransition: () => {},
  registerTargetRect: () => {},
  isTransitioningSlug: () => false,
});

export function ProjectTransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const prefersReduced = useReducedMotion();
  const [transition, setTransition] = useState<ActiveTransition | null>(null);

  const startProjectTransition = useCallback(
    ({
      slug,
      src,
      alt,
      element,
    }: {
      slug: string;
      src: string;
      alt: string;
      element: HTMLElement | null;
    }) => {
      if (prefersReduced || !element) {
        router.push(`/projects/${slug}`);
        return;
      }

      const rect = element.getBoundingClientRect();
      setTransition({
        slug,
        src,
        alt,
        from: {
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        },
        to: null,
      });

      router.push(`/projects/${slug}`);
    },
    [prefersReduced, router]
  );

  const registerTargetRect = useCallback((slug: string, rect: Rect) => {
    setTransition((prev) => {
      if (!prev || prev.slug !== slug || prev.to) return prev;
      return { ...prev, to: rect };
    });
  }, []);

  // Pengaman: bersihkan overlay jika navigasi batal atau melewati batas waktu
  useEffect(() => {
    if (!transition) return;
    const timeout = window.setTimeout(() => {
      setTransition(null);
    }, 1100);
    return () => window.clearTimeout(timeout);
  }, [transition]);

  // Bersihkan jika kembali ke halaman utama
  useEffect(() => {
    if (pathname === "/") {
      setTransition(null);
    }
  }, [pathname]);

  const isTransitioningSlug = useCallback(
    (slug: string) => Boolean(transition && transition.slug === slug),
    [transition]
  );

  return (
    <ProjectTransitionContext.Provider
      value={{ startProjectTransition, registerTargetRect, isTransitioningSlug }}
    >
      {children}

      <AnimatePresence>
        {transition && (
          <motion.div
            key={transition.slug}
            aria-hidden="true"
            className="pointer-events-none fixed z-50 overflow-hidden rounded-xl bg-surface"
            initial={{
              top: transition.from.top,
              left: transition.from.left,
              width: transition.from.width,
              height: transition.from.height,
              opacity: 1,
            }}
            animate={
              transition.to
                ? {
                    top: transition.to.top,
                    left: transition.to.left,
                    width: transition.to.width,
                    height: transition.to.height,
                    opacity: 1,
                  }
                : {
                    top: transition.from.top,
                    left: transition.from.left,
                    width: transition.from.width,
                    height: transition.from.height,
                    opacity: 1,
                  }
            }
            exit={{ opacity: 0, transition: { duration: 0.18 } }}
            transition={MOTION.spring.stage}
            onAnimationComplete={() => {
              if (transition.to) {
                setTransition(null);
              }
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={transition.src}
              alt={transition.alt}
              className="h-full w-full object-cover"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </ProjectTransitionContext.Provider>
  );
}

export function useProjectTransition() {
  return useContext(ProjectTransitionContext);
}
