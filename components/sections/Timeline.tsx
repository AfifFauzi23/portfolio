"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { timelineData } from "@/data/content";

gsap.registerPlugin(ScrollTrigger);

export function Timeline() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const progressLineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const line = progressLineRef.current;
    if (!section || !line) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      line.style.transform = "scaleY(1)";
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        line,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
            end: "bottom 75%",
            scrub: 0.4,
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="experience"
      aria-labelledby="experience-heading"
      className="mx-auto max-w-7xl border-t border-border px-5 py-16 sm:px-8 sm:py-24 lg:px-12"
    >
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <h2
            id="experience-heading"
            className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
          >
            Pengalaman & Pendidikan
          </h2>
          <p className="mt-3 max-w-[36ch] text-base text-muted">
            Urutan perjalanan akademik dan peran desain yang membentuk cara kerja saya.
          </p>
        </div>

        {/* Timeline vertikal dengan garis progres scroll-driven */}
        <div ref={sectionRef} className="relative pl-7 sm:pl-10 lg:col-span-8">
          {/* Rel garis dasar */}
          <div
            aria-hidden="true"
            className="absolute top-2 bottom-2 left-1.5 w-px bg-border sm:left-2"
          />
          {/* Garis progres yang tumbuh mengikuti scroll */}
          <div
            ref={progressLineRef}
            aria-hidden="true"
            className="absolute top-2 bottom-2 left-1.5 w-px origin-top bg-accent sm:left-2"
            style={{ transform: "scaleY(0)" }}
          />

          <ol className="space-y-10">
            {timelineData.map((item, idx) => {
              const stepNumber = String(idx + 1).padStart(2, "0");
              return (
                <li key={`${item.period}-${item.title}`} className="relative">
                  {/* Titik penanda kronologis */}
                  <span
                    aria-hidden="true"
                    className="absolute top-2 -left-[25px] h-2.5 w-2.5 rounded-full border-2 border-accent bg-bg sm:-left-[35px]"
                  />

                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 text-xs text-muted">
                    <span className="font-display font-semibold text-accent">
                      {stepNumber}
                    </span>
                    <span>{item.period}</span>
                    <span>{item.type}</span>
                  </div>

                  <h3 className="mt-2 font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl">
                    {item.title}
                  </h3>
                  <p className="mt-0.5 text-sm font-medium text-ink/80">
                    {item.organization}
                  </p>
                  <p className="mt-2.5 max-w-[62ch] text-sm leading-relaxed text-muted sm:text-base">
                    {item.description}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
