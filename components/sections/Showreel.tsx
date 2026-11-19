"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { siteConfig, showreelData, type ShowreelMode } from "@/data/content";
import { MOTION, getSafeTransition } from "@/lib/motion";
import { ShowreelVideo } from "@/components/sections/ShowreelVideo";
import { ShowreelCarousel } from "@/components/sections/ShowreelCarousel";

const MODES: { value: ShowreelMode; label: string }[] = [
  { value: "carousel", label: "Carousel foto" },
  { value: "video", label: "Video" },
];

export function Showreel() {
  const [mode, setMode] = useState<ShowreelMode>(siteConfig.showreelMode);
  const prefersReduced = useReducedMotion();

  return (
    <section
      id="showreel"
      aria-labelledby="showreel-heading"
      className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24 lg:px-12"
    >
      <div className="mb-8 flex flex-col gap-5 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2
            id="showreel-heading"
            className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
          >
            {showreelData.heading}
          </h2>
          <p className="mt-2 max-w-[54ch] text-base text-muted">
            {showreelData.summary}
          </p>
        </div>

        {/* Switch mode Video / Carousel */}
        <div
          role="group"
          aria-label="Pilih mode tampilan showreel"
          className="inline-flex w-fit items-center rounded-full border border-border bg-surface p-1"
        >
          {MODES.map((item) => {
            const active = mode === item.value;
            return (
              <button
                key={item.value}
                type="button"
                aria-pressed={active}
                onClick={() => setMode(item.value)}
                className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  active ? "text-accent-contrast" : "text-muted hover:text-ink"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="showreel-mode-pill"
                    transition={getSafeTransition(
                      prefersReduced,
                      MOTION.spring.layout
                    )}
                    className="absolute inset-0 rounded-full bg-accent"
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {mode === "video" ? <ShowreelVideo /> : <ShowreelCarousel />}
    </section>
  );
}
