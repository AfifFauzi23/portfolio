"use client";

import React, { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { profileData } from "@/data/content";
import { MOTION, getSafeTransition } from "@/lib/motion";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { useSmoothScroll } from "@/components/providers/SmoothScrollProvider";

interface GlyphState {
  wght: number;
  wdth: number;
  y: number;
}

const BASE_WGHT = 520;
const MAX_WGHT = 900;
const BASE_WDTH = 96;
const MAX_WDTH = 148;

export function Hero() {
  const prefersReduced = useReducedMotion();
  const { scrollTo } = useSmoothScroll();

  const stageRef = useRef<HTMLDivElement>(null);
  const glyphRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const glyphStates = useRef<GlyphState[]>([]);
  const pointerRef = useRef<{ x: number; y: number; active: boolean }>({
    x: -9999,
    y: -9999,
    active: false,
  });
  const rafRef = useRef<number | null>(null);

  const lines = profileData.heroHeadlineLines;
  const totalGlyphs = lines.reduce((acc, line) => acc + line.length, 0);

  useEffect(() => {
    glyphStates.current = Array.from({ length: totalGlyphs }, () => ({
      wght: BASE_WGHT,
      wdth: BASE_WDTH,
      y: 0,
    }));
  }, [totalGlyphs]);

  useEffect(() => {
    if (prefersReduced) return;

    const tick = () => {
      const pointer = pointerRef.current;
      const radius = window.innerWidth < 768 ? 150 : 280;
      const maxWdth = window.innerWidth < 640 ? 128 : MAX_WDTH;
      let needsNextFrame = pointer.active;

      glyphRefs.current.forEach((el, idx) => {
        if (!el) return;
        const state = glyphStates.current[idx] ?? {
          wght: BASE_WGHT,
          wdth: BASE_WDTH,
          y: 0,
        };

        let targetWght = BASE_WGHT;
        let targetWdth = BASE_WDTH;
        let targetY = 0;

        if (pointer.active) {
          const rect = el.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const dist = Math.hypot(pointer.x - cx, pointer.y - cy);
          const raw = Math.max(0, 1 - dist / radius);
          const influence = raw * raw * (3 - 2 * raw);

          targetWght = BASE_WGHT + influence * (MAX_WGHT - BASE_WGHT);
          targetWdth = BASE_WDTH + influence * (maxWdth - BASE_WDTH);
          targetY = -influence * 7;
        }

        const lerp = 0.16;
        state.wght += (targetWght - state.wght) * lerp;
        state.wdth += (targetWdth - state.wdth) * lerp;
        state.y += (targetY - state.y) * lerp;
        glyphStates.current[idx] = state;

        el.style.fontVariationSettings = `"wght" ${state.wght.toFixed(1)}, "wdth" ${state.wdth.toFixed(1)}`;
        el.style.transform = `translate3d(0, ${state.y.toFixed(2)}px, 0)`;

        if (
          Math.abs(targetWght - state.wght) > 0.6 ||
          Math.abs(targetWdth - state.wdth) > 0.2 ||
          Math.abs(targetY - state.y) > 0.08
        ) {
          needsNextFrame = true;
        }
      });

      if (needsNextFrame) {
        rafRef.current = window.requestAnimationFrame(tick);
      } else {
        rafRef.current = null;
      }
    };

    const startLoop = () => {
      if (rafRef.current === null) {
        rafRef.current = window.requestAnimationFrame(tick);
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      pointerRef.current = { x: e.clientX, y: e.clientY, active: true };
      startLoop();
    };

    const handlePointerLeave = () => {
      pointerRef.current.active = false;
      startLoop();
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;
      pointerRef.current = { x: touch.clientX, y: touch.clientY, active: true };
      startLoop();
    };

    const handleTouchEnd = () => {
      pointerRef.current.active = false;
      startLoop();
    };

    // Dukungan gyroscope ringan di perangkat mobile (jika tersedia tanpa izin khusus)
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma === null || e.beta === null || !stageRef.current) return;
      const rect = stageRef.current.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;

      const normX = Math.max(-1, Math.min(1, e.gamma / 30));
      const normY = Math.max(-1, Math.min(1, (e.beta - 45) / 30));
      pointerRef.current = {
        x: rect.left + rect.width * (0.5 + normX * 0.45),
        y: rect.top + rect.height * (0.5 + normY * 0.35),
        active: true,
      };
      startLoop();
    };

    const stage = stageRef.current;
    stage?.addEventListener("pointermove", handlePointerMove, { passive: true });
    stage?.addEventListener("pointerleave", handlePointerLeave);
    stage?.addEventListener("touchmove", handleTouchMove, { passive: true });
    stage?.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("deviceorientation", handleOrientation, { passive: true });

    return () => {
      stage?.removeEventListener("pointermove", handlePointerMove);
      stage?.removeEventListener("pointerleave", handlePointerLeave);
      stage?.removeEventListener("touchmove", handleTouchMove);
      stage?.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("deviceorientation", handleOrientation);
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, [prefersReduced]);

  let glyphIndex = 0;

  return (
    <section
      aria-label="Pembuka"
      className="mx-auto max-w-7xl px-5 pt-10 pb-20 sm:px-8 sm:pt-14 sm:pb-28 lg:px-12 lg:pt-20 lg:pb-32"
    >
      <div
        ref={stageRef}
        className="select-none py-6 sm:py-8"
        aria-label={lines.join(" ")}
      >
        <h1 className="font-display text-[clamp(2.75rem,10.5vw,8.75rem)] leading-[1.12] tracking-[-0.03em] text-ink">
          {lines.map((line, lineIdx) => (
            <span key={line} className="block overflow-visible">
              <motion.span
                className="inline-flex flex-wrap"
                initial={prefersReduced ? false : { y: 24, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={getSafeTransition(prefersReduced, {
                  duration: MOTION.duration.slow,
                  delay: lineIdx * 0.08,
                  ease: MOTION.ease.editorial,
                })}
              >
                {line.split("").map((char, charIdx) => {
                  const currentIdx = glyphIndex++;
                  const isSpace = char === " ";
                  return (
                    <span
                      key={`${lineIdx}-${charIdx}`}
                      ref={(el) => {
                        glyphRefs.current[currentIdx] = el;
                      }}
                      className={`inline-block will-change-transform ${
                        isSpace ? "w-[0.28em]" : ""
                      }`}
                      style={{
                        fontVariationSettings: `"wght" ${BASE_WGHT}, "wdth" ${BASE_WDTH}`,
                      }}
                    >
                      {isSpace ? "\u00A0" : char}
                    </span>
                  );
                })}
              </motion.span>
            </span>
          ))}
        </h1>
      </div>

      {/* Baris pengantar rata kiri dan aksi utama */}
      <div className="mt-10 grid grid-cols-1 gap-8 border-t border-border pt-8 md:mt-14 md:grid-cols-12 md:items-end">
        <motion.p
          initial={prefersReduced ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={getSafeTransition(prefersReduced, {
            duration: MOTION.duration.base,
            delay: 0.18,
            ease: MOTION.ease.editorial,
          })}
          className="max-w-[58ch] text-lg leading-relaxed text-ink sm:text-xl md:col-span-7"
        >
          {profileData.heroIntro}
        </motion.p>

        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={getSafeTransition(prefersReduced, {
            duration: MOTION.duration.base,
            delay: 0.24,
            ease: MOTION.ease.editorial,
          })}
          className="flex flex-wrap items-center gap-4 md:col-span-5 md:justify-end"
        >
          <MagneticButton
            onClick={() => scrollTo("#showreel")}
            className="inline-flex h-12 items-center justify-center rounded-full bg-accent px-6 text-sm font-medium text-accent-contrast transition-opacity hover:opacity-90"
          >
            {profileData.heroPrimaryCta}
          </MagneticButton>

          <button
            type="button"
            onClick={() => scrollTo("#projects")}
            className="inline-flex h-12 items-center justify-center rounded-full border border-border px-6 text-sm font-medium text-ink transition-colors hover:border-ink"
          >
            {profileData.heroSecondaryCta}
          </button>
        </motion.div>
      </div>
    </section>
  );
}
