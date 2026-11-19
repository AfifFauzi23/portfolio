"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import type { ProjectItem } from "@/data/content";
import { MOTION, getSafeTransition } from "@/lib/motion";
import { useProjectTransition } from "@/components/providers/ProjectTransitionProvider";

export function ProjectDetailClient({
  project,
  nextProject,
}: {
  project: ProjectItem;
  nextProject: ProjectItem;
}) {
  const heroMediaRef = useRef<HTMLDivElement>(null);
  const nextMediaRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();
  const { registerTargetRect, isTransitioningSlug, startProjectTransition } =
    useProjectTransition();

  useEffect(() => {
    const el = heroMediaRef.current;
    if (!el) return;
    const raf = window.requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect();
      registerTargetRect(project.slug, {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      });
    });
    return () => window.cancelAnimationFrame(raf);
  }, [project.slug, registerTargetRect]);

  const hideWhileFlying = isTransitioningSlug(project.slug);

  return (
    <article className="mx-auto max-w-7xl px-5 pt-8 pb-24 sm:px-8 sm:pt-12 lg:px-12">
      {/* Navigasi kembali */}
      <Link
        href="/#projects"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-ink"
      >
        <ChevronLeft className="h-4 w-4" />
        <span>Kembali ke karya</span>
      </Link>

      {/* Kepala proyek */}
      <header className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-8">
          <p className="text-sm text-muted">
            {project.category}, {project.year}
          </p>
          <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl lg:text-6xl">
            {project.title}
          </h1>
        </div>

        <p className="max-w-[46ch] text-base leading-relaxed text-muted lg:col-span-4">
          {project.description}
        </p>
      </header>

      {/* Visual utama — target pendaratan shared-element transition */}
      <div
        ref={heroMediaRef}
        className="relative mt-10 aspect-[16/10] w-full overflow-hidden rounded-2xl border border-border bg-surface"
        style={{ opacity: hideWhileFlying ? 0 : 1 }}
      >
        <Image
          src={project.image}
          alt={project.title}
          fill
          sizes="(max-width: 1280px) 100vw, 1280px"
          className="object-cover"
          priority
        />
      </div>

      {/* Ringkasan, peran, dan perangkat */}
      <motion.section
        initial={prefersReduced ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={getSafeTransition(prefersReduced, {
          duration: MOTION.duration.base,
          delay: 0.12,
          ease: MOTION.ease.editorial,
        })}
        className="mt-14 grid grid-cols-1 gap-10 border-t border-border pt-10 lg:grid-cols-12"
      >
        <div className="lg:col-span-7">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">
            Ringkasan proyek
          </h2>
          <p className="mt-4 max-w-[66ch] text-base leading-relaxed text-muted sm:text-lg">
            {project.overview}
          </p>
        </div>

        <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
          <div>
            <dt className="text-xs font-medium text-muted">Peran</dt>
            <dd className="mt-1 text-base font-medium text-ink">
              {project.role}
            </dd>
          </div>

          <div>
            <dt className="text-xs font-medium text-muted">Perangkat</dt>
            <dd className="mt-2 flex flex-wrap gap-2">
              {project.tools.map((tool) => (
                <span
                  key={tool}
                  className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-ink"
                >
                  {tool}
                </span>
              ))}
            </dd>
          </div>

          {project.link && (
            <div>
              <dt className="text-xs font-medium text-muted">Tautan</dt>
              <dd className="mt-1">
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-sm font-medium text-accent underline-offset-4 hover:underline"
                >
                  Buka pratinjau proyek
                </a>
              </dd>
            </div>
          )}
        </dl>
      </motion.section>

      {/* Galeri gambar detail */}
      <section aria-label="Galeri proyek" className="mt-16 space-y-12">
        {project.gallery.map((item, idx) => (
          <figure key={`${project.slug}-gallery-${idx}`}>
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-border bg-surface">
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 1280px) 100vw, 1280px"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-3 max-w-[65ch] text-sm text-muted">
              {item.caption}
            </figcaption>
          </figure>
        ))}
      </section>

      {/* Proyek berikutnya */}
      <section className="mt-20 border-t border-border pt-12">
        <p className="text-sm text-muted">Karya berikutnya</p>
        <a
          href={`/projects/${nextProject.slug}`}
          onClick={(e) => {
            e.preventDefault();
            startProjectTransition({
              slug: nextProject.slug,
              src: nextProject.image,
              alt: nextProject.title,
              element: nextMediaRef.current,
            });
          }}
          data-cursor="view"
          className="group mt-4 grid grid-cols-1 items-center gap-6 md:grid-cols-12"
        >
          <div className="md:col-span-7">
            <h2 className="font-display text-3xl font-semibold tracking-tight text-ink transition-colors group-hover:text-accent sm:text-4xl">
              {nextProject.title}
            </h2>
            <p className="mt-2 max-w-[52ch] text-sm text-muted">
              {nextProject.description}
            </p>
          </div>
          <div
            ref={nextMediaRef}
            className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-border bg-surface md:col-span-5"
          >
            <Image
              src={nextProject.image}
              alt={nextProject.title}
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          </div>
        </a>
      </section>
    </article>
  );
}
