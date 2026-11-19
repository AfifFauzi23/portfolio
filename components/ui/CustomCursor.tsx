"use client";

import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { MOTION } from "@/lib/motion";

type CursorVariant = "default" | "pointer" | "view" | "play" | "drag" | "zoom";

const CURSOR_LABELS: Partial<Record<CursorVariant, string>> = {
  view: "Lihat",
  play: "Putar",
  drag: "Geser",
  zoom: "Perbesar",
};

export function CustomCursor() {
  const prefersReduced = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [variant, setVariant] = useState<CursorVariant>("default");

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springX = useSpring(mouseX, MOTION.spring.tactile);
  const springY = useSpring(mouseY, MOTION.spring.tactile);

  useEffect(() => {
    if (prefersReduced) return;
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (!isFinePointer) return;

    setEnabled(true);
    document.body.classList.add("has-custom-cursor");

    const onMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!visible) setVisible(true);

      const target = e.target as HTMLElement | null;
      const cursorEl = target?.closest<HTMLElement>("[data-cursor]");
      if (cursorEl) {
        const type = cursorEl.dataset.cursor as CursorVariant;
        setVariant(type || "pointer");
        return;
      }

      const interactive = target?.closest("a, button, input, textarea, [role='button']");
      setVariant(interactive ? "pointer" : "default");
    };

    const onMouseLeave = () => setVisible(false);
    const onMouseEnter = () => setVisible(true);

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    return () => {
      document.body.classList.remove("has-custom-cursor");
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
    };
  }, [mouseX, mouseY, prefersReduced, visible]);

  if (!enabled || prefersReduced) return null;

  const label = CURSOR_LABELS[variant];
  const isPill = Boolean(label);
  const isPointer = variant === "pointer";

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[100] hidden md:flex items-center justify-center"
      style={{
        x: springX,
        y: springY,
        translateX: "-50%",
        translateY: "-50%",
      }}
      animate={{
        opacity: visible ? 1 : 0,
      }}
      transition={{ duration: 0.16 }}
    >
      <motion.div
        className="flex items-center justify-center rounded-full font-sans text-xs font-medium tracking-tight"
        animate={{
          width: isPill ? 76 : isPointer ? 34 : 11,
          height: isPill ? 32 : isPointer ? 34 : 11,
          backgroundColor: isPill
            ? "var(--accent)"
            : isPointer
              ? "transparent"
              : "var(--ink)",
          borderWidth: isPointer ? 1.5 : 0,
          borderColor: isPointer ? "var(--accent)" : "transparent",
          color: "var(--accent-contrast)",
        }}
        transition={MOTION.spring.tactile}
      >
        {isPill && <span>{label}</span>}
      </motion.div>
    </motion.div>
  );
}
