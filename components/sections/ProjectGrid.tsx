"use client";

import React, { useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import {
  projectsData,
  type ProjectCategory,
  type ProjectItem,
} from "@/data/content";
import { MOTION, getSafeTransition } from "@/lib/motion";
import { useProjectTransition } from "@/components/providers/ProjectTransitionProvider";

const CATEGORIES: ("Semua" | ProjectCategory)[] = [
  "Semua",
  "UI/UX",
  "Grafis",
  "Motion",
  "Web",
];

function ProjectCard({
  project,
  spanClass,
}: {
  project: ProjectItem;
  spanClass: string;
}) {
  const prefersReduced = useReducedMotion();
  const { startProjectTransition } = useProjectTransition();
  const mediaRef = useRef<HTMLDivElement>(null);

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const imgX = useMotionValue(0);
  const imgY = useMotionValue(0);

  const springRotateX = useSpring(rotateX, MOTION.spring.tactile);
  const springRotateY = useSpring(rotateY, MOTION.spring.tactile);
  const springImgX = useSpring(imgX, MOTION.spring.tactile);
  const springImgY = useSpring(imgY, MOTION.spring.tactile);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (prefersReduced || e.pointerType !== "mouse") return;
    const rect = mediaRef.current?.getBoundingClientRect();
    if (!rect) return;

    const normX = (e.clientX - rect.left) / rect.width - 0.5;
    const normY = (e.clientY - rect.top) / rect.height - 0.5;

    rotateY.set(normX * 7);
    rotateX.set(-normY * 7);
    imgX.set(-normX * 14);
    imgY.set(-normY * 14);
  };

  const handlePointerLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    imgX.set(0);
    imgY.set(0);
  };

  const handleOpen = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    startProjectTransition({
      slug: project.slug,
      src: project.image,
      alt: project.title,
      element: mediaRef.current,
    });
  };

  return (
    <motion.article
      layout
      initial={prefersReduced ? false : { opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
      transition={getSafeTransition(prefersReduced, MOTION.spring.layout)}
      className={`${spanClass} group flex flex-col`}
    >
      <a
        href={`/projects/${project.slug}`}
        onClick={handleOpen}
        data-cursor="view"
        className="block rounded-xl text-left focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-bg focus-visible:outline-none"
      >
        <div
          style={{ perspective: 900 }}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
        >
          <motion.div
            ref={mediaRef}
            style={
              prefersReduced
                ? undefined
                : {
                    rotateX: springRotateX,
                    rotateY: springRotateY,
                    transformStyle: "preserve-3d",
                  }
            }
            className={`relative w-full overflow-hidden rounded-xl border border-border bg-surface ${
              project.aspect === "landscape"
                ? "aspect-[16/10]"
                : "aspect-[4/5] sm:aspect-[5/5]"
            }`}
          >
            <motion.div
              className="relative h-[108%] w-[108%] -top-[4%] -left-[4%]"
              style={
                prefersReduced
                  ? undefined
                  : { x: springImgX, y: springImgY }
              }
            >
              <Image
                src={project.image}
                alt={project.title}
                fill
                sizes={
                  project.featured
                    ? "(max-width: 768px) 100vw, 58vw"
                    : "(max-width: 768px) 100vw, 40vw"
                }
                className="object-cover"
              />
            </motion.div>
          </motion.div>
        </div>

        <div className="mt-4 flex items-baseline justify-between gap-4">
          <h3 className="font-display text-xl font-semibold tracking-tight text-ink transition-colors group-hover:text-accent sm:text-2xl">
            {project.title}
          </h3>
          <span className="shrink-0 text-xs text-muted">
            {project.category}, {project.year}
          </span>
        </div>

        <p className="mt-1.5 max-w-[56ch] text-sm leading-relaxed text-muted">
          {project.description}
        </p>
      </a>
    </motion.article>
  );
}

export function ProjectGrid() {
  const [selectedCategory, setSelectedCategory] = useState<
    "Semua" | ProjectCategory
  >("Semua");
  const prefersReduced = useReducedMotion();

  const filteredProjects = useMemo(() => {
    if (selectedCategory === "Semua") return projectsData;
    return projectsData.filter((p) => p.category === selectedCategory);
  }, [selectedCategory]);

  // Pola grid asimetris 7:5 lalu 5:7 agar hierarki visual terasa editorial
  const getSpanClass = (project: ProjectItem, index: number) => {
    if (selectedCategory !== "Semua") {
      return index === 0 ? "md:col-span-7" : "md:col-span-5";
    }
    return project.featured ? "md:col-span-7" : "md:col-span-5";
  };

  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24 lg:px-12"
    >
      <div className="mb-10 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between">
        <div>
          <h2
            id="projects-heading"
            className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
          >
            Karya pilihan
          </h2>
          <p className="mt-2 max-w-[54ch] text-base text-muted">
            Studi kasus antarmuka, identitas grafis, gerak, dan implementasi web.
          </p>
        </div>

        {/* Filter kategori */}
        <div
          role="tablist"
          aria-label="Saring karya berdasarkan kategori"
          className="flex flex-wrap items-center gap-1.5"
        >
          {CATEGORIES.map((category) => {
            const active = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setSelectedCategory(category)}
                className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "text-accent-contrast"
                    : "text-muted hover:text-ink"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="project-filter-pill"
                    transition={getSafeTransition(
                      prefersReduced,
                      MOTION.spring.layout
                    )}
                    className="absolute inset-0 rounded-full bg-accent"
                  />
                )}
                <span className="relative z-10">{category}</span>
              </button>
            );
          })}
        </div>
      </div>

      <motion.div
        layout
        className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-12 md:gap-y-16"
      >
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project, idx) => (
            <ProjectCard
              key={project.slug}
              project={project}
              spanClass={getSpanClass(project, idx)}
            />
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
