"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { profileData } from "@/data/content";

gsap.registerPlugin(ScrollTrigger);

export function About() {
  const imageWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = imageWrapRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { clipPath: "inset(14% 0% 0% 0%)", opacity: 0.2 },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 82%",
            once: true,
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="mx-auto max-w-7xl border-t border-border px-5 py-16 sm:px-8 sm:py-24 lg:px-12"
    >
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        {/* Foto profil (4 kolom, rasio 3:4) */}
        <div className="lg:col-span-4">
          <div
            ref={imageWrapRef}
            className="relative aspect-[3/4] w-full max-w-sm overflow-hidden rounded-2xl border border-border bg-surface lg:max-w-none"
          >
            <Image
              src={profileData.avatar}
              alt={profileData.avatarAlt}
              fill
              sizes="(max-width: 1024px) 90vw, 32vw"
              className="object-cover"
            />
          </div>
          <p className="mt-3 text-xs text-muted">{profileData.location}</p>
        </div>

        {/* Bio dan keahlian (8 kolom, rata kiri) */}
        <div className="flex flex-col justify-between lg:col-span-8">
          <div>
            <h2
              id="about-heading"
              className="font-display text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl"
            >
              {profileData.aboutHeadline}
            </h2>

            <div className="mt-6 space-y-4">
              {profileData.aboutParagraphs.map((paragraph, idx) => (
                <p
                  key={idx}
                  className="max-w-[66ch] text-base leading-relaxed text-muted sm:text-lg"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Daftar skill terstruktur */}
          <div className="mt-12 grid grid-cols-1 gap-8 border-t border-border pt-8 sm:grid-cols-2">
            {profileData.skills.map((group) => (
              <div key={group.name}>
                <h3 className="font-display text-base font-semibold text-ink">
                  {group.name}
                </h3>
                <ul className="mt-3 space-y-1.5 text-sm text-muted">
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
