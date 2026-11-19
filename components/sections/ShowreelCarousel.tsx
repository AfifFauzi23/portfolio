"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type PanInfo,
} from "framer-motion";
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from "lucide-react";
import { showreelData, type ShowreelSlide } from "@/data/content";
import { MOTION, getSafeTransition } from "@/lib/motion";

const AUTOPLAY_MS = 4800;

export function ShowreelCarousel() {
  const slides = showreelData.slides;
  const prefersReduced = useReducedMotion();

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [lightboxSlide, setLightboxSlide] = useState<ShowreelSlide | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  const stageRef = useRef<HTMLDivElement>(null);
  const wasDraggingRef = useRef(false);

  const goTo = useCallback(
    (index: number) => {
      const wrapped = (index + slides.length) % slides.length;
      setActiveIndex(wrapped);
    },
    [slides.length]
  );

  const next = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const prev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

  // Autoplay berhenti saat hover, sentuh, lightbox terbuka, atau reduced-motion aktif
  useEffect(() => {
    if (isPaused || lightboxSlide || prefersReduced) return;
    const timer = window.setInterval(() => {
      setActiveIndex((curr) => (curr + 1) % slides.length);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [isPaused, lightboxSlide, prefersReduced, slides.length]);

  // Navigasi keyboard di lightbox & carousel saat fokus
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (lightboxSlide) {
        if (e.key === "Escape") {
          setLightboxSlide(null);
          setIsZoomed(false);
        } else if (e.key === "ArrowRight") {
          const nextIdx = (activeIndex + 1) % slides.length;
          setActiveIndex(nextIdx);
          setLightboxSlide(slides[nextIdx]);
          setIsZoomed(false);
        } else if (e.key === "ArrowLeft") {
          const prevIdx = (activeIndex - 1 + slides.length) % slides.length;
          setActiveIndex(prevIdx);
          setLightboxSlide(slides[prevIdx]);
          setIsZoomed(false);
        }
        return;
      }

      if (stageRef.current?.contains(document.activeElement)) {
        if (e.key === "ArrowRight") {
          e.preventDefault();
          next();
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          prev();
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, lightboxSlide, next, prev, slides]);

  // Kunci scroll halaman saat lightbox aktif
  useEffect(() => {
    if (!lightboxSlide) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [lightboxSlide]);

  const handleDragStart = () => {
    wasDraggingRef.current = true;
    setIsPaused(true);
  };

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const swipeThreshold = 55;
    const velocityThreshold = 320;

    if (info.offset.x < -swipeThreshold || info.velocity.x < -velocityThreshold) {
      next();
    } else if (
      info.offset.x > swipeThreshold ||
      info.velocity.x > velocityThreshold
    ) {
      prev();
    }

    window.setTimeout(() => {
      wasDraggingRef.current = false;
      setIsPaused(false);
    }, 120);
  };

  const openLightbox = (slide: ShowreelSlide, idx: number) => {
    if (wasDraggingRef.current) return;
    if (idx !== activeIndex) {
      setActiveIndex(idx);
      return;
    }
    setIsZoomed(false);
    setLightboxSlide(slide);
  };

  const activeSlide = slides[activeIndex];

  // Hitung offset melingkar terdekat (-N/2 .. +N/2) agar carousel terasa tak terputus
  const getRelativeOffset = (index: number) => {
    let diff = index - activeIndex;
    const half = slides.length / 2;
    if (diff > half) diff -= slides.length;
    if (diff < -half) diff += slides.length;
    return diff;
  };

  return (
    <div
      ref={stageRef}
      tabIndex={0}
      aria-roledescription="carousel"
      aria-label="Showreel foto interaktif"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
      className="outline-none"
    >
      {/* Panggung utama dengan drag inersia & kedalaman parallax */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.18}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        data-cursor="drag"
        className="relative h-[300px] w-full overflow-hidden rounded-2xl border border-border bg-surface select-none sm:h-[440px] lg:h-[540px]"
      >
        {slides.map((slide, idx) => {
          const offset = getRelativeOffset(idx);
          const isVisible = Math.abs(offset) <= 2;
          if (!isVisible) return null;

          const isActive = offset === 0;
          const xPercent = offset * 84;
          const scale = isActive ? 1 : 0.88;
          const opacity = isActive ? 1 : Math.abs(offset) === 1 ? 0.52 : 0;

          return (
            <motion.div
              key={slide.id}
              initial={false}
              animate={{
                x: `${xPercent}%`,
                scale,
                opacity,
                zIndex: isActive ? 20 : 10 - Math.abs(offset),
              }}
              transition={getSafeTransition(prefersReduced, MOTION.spring.carousel)}
              className="absolute inset-y-4 left-1/2 w-[86%] -translate-x-1/2 sm:inset-y-6 sm:w-[76%] lg:w-[68%]"
            >
              <motion.button
                type="button"
                layoutId={`showreel-slide-${slide.id}`}
                transition={getSafeTransition(prefersReduced, MOTION.spring.stage)}
                onClick={() => openLightbox(slide, idx)}
                data-cursor={isActive ? "zoom" : "pointer"}
                aria-label={
                  isActive
                    ? `Perbesar ${slide.title}`
                    : `Pindah ke slide ${slide.title}`
                }
                className="relative block h-full w-full overflow-hidden rounded-xl border border-border bg-surface-elevated text-left"
              >
                <motion.div
                  className="relative h-full w-full"
                  animate={{ x: prefersReduced ? 0 : offset * -18 }}
                  transition={getSafeTransition(
                    prefersReduced,
                    MOTION.spring.carousel
                  )}
                >
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    sizes="(max-width: 768px) 90vw, 72vw"
                    className="pointer-events-none object-cover"
                    priority={idx === 0}
                  />
                </motion.div>
              </motion.button>
            </motion.div>
          );
        })}

        {/* Panah navigasi */}
        <div className="pointer-events-none absolute inset-x-3 top-1/2 z-30 flex -translate-y-1/2 justify-between sm:inset-x-5">
          <button
            type="button"
            onClick={prev}
            aria-label="Slide sebelumnya"
            className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border border-border bg-bg/85 text-ink backdrop-blur-md transition-colors hover:border-accent hover:text-accent"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={next}
            aria-label="Slide berikutnya"
            className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border border-border bg-bg/85 text-ink backdrop-blur-md transition-colors hover:border-accent hover:text-accent"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </motion.div>

      {/* Caption aktif + indikator titik */}
      <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-h-[3.5rem]">
          <div className="flex items-center gap-3 text-xs text-muted">
            <span>{activeSlide.category}</span>
            <span aria-hidden="true">/</span>
            <span>
              {activeIndex + 1} dari {slides.length}
            </span>
          </div>
          <h3 className="mt-1 font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl">
            {activeSlide.title}
          </h3>
          <p className="mt-1 max-w-[60ch] text-sm text-muted">
            {activeSlide.description}
          </p>
        </div>

        {/* Dot indicator */}
        <div
          className="flex items-center gap-2"
          role="tablist"
          aria-label="Pilih slide showreel"
        >
          {slides.map((slide, idx) => {
            const selected = idx === activeIndex;
            return (
              <button
                key={slide.id}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-label={`Slide ${idx + 1}: ${slide.title}`}
                onClick={() => goTo(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  selected
                    ? "w-7 bg-accent"
                    : "w-2 bg-ink/20 hover:bg-ink/45"
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* Thumbnail strip */}
      <div className="no-scrollbar mt-5 flex gap-2.5 overflow-x-auto pb-1">
        {slides.map((slide, idx) => {
          const selected = idx === activeIndex;
          return (
            <button
              key={`thumb-${slide.id}`}
              type="button"
              onClick={() => goTo(idx)}
              aria-label={`Tampilkan ${slide.title}`}
              className={`relative h-14 w-24 shrink-0 overflow-hidden rounded-lg border transition-all sm:h-16 sm:w-28 ${
                selected
                  ? "border-accent opacity-100 ring-2 ring-accent/25"
                  : "border-border opacity-55 hover:opacity-90"
              }`}
            >
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                sizes="112px"
                className="object-cover"
              />
            </button>
          );
        })}
      </div>

      {/* Lightbox Fullscreen dengan Zoom & Shared-Element Transition */}
      <AnimatePresence>
        {lightboxSlide && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`Tampilan penuh ${lightboxSlide.title}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={() => {
              setLightboxSlide(null);
              setIsZoomed(false);
            }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0D1017]/94 p-4 backdrop-blur-md sm:p-8"
          >
            {/* Bar kontrol atas */}
            <div
              className="fixed inset-x-0 top-0 z-20 flex items-center justify-between px-5 py-4 text-[#F4F6F9] sm:px-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-sm">
                <span className="font-medium">{lightboxSlide.title}</span>
                <span className="ml-3 text-[#98A4B8]">
                  {lightboxSlide.category}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsZoomed((z) => !z)}
                  aria-label={isZoomed ? "Perkecil gambar" : "Perbesar gambar"}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#F4F6F9]/20 bg-[#131720]/80 text-[#F4F6F9] transition-colors hover:bg-[#F4F6F9] hover:text-[#131720]"
                >
                  {isZoomed ? (
                    <ZoomOut className="h-4 w-4" />
                  ) : (
                    <ZoomIn className="h-4 w-4" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setLightboxSlide(null);
                    setIsZoomed(false);
                  }}
                  aria-label="Tutup lightbox"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#F4F6F9]/20 bg-[#131720]/80 text-[#F4F6F9] transition-colors hover:bg-[#F4F6F9] hover:text-[#131720]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Gambar utama dengan shared layoutId */}
            <motion.div
              layoutId={`showreel-slide-${lightboxSlide.id}`}
              transition={getSafeTransition(prefersReduced, MOTION.spring.stage)}
              onClick={(e) => {
                e.stopPropagation();
                setIsZoomed((z) => !z);
              }}
              className="relative aspect-[16/10] w-full max-w-5xl overflow-hidden rounded-xl border border-[#F4F6F9]/15 bg-[#131720]"
            >
              <motion.div
                className="relative h-full w-full"
                animate={{ scale: isZoomed ? 1.75 : 1 }}
                transition={getSafeTransition(
                  prefersReduced,
                  MOTION.spring.stage
                )}
              >
                <Image
                  src={lightboxSlide.image}
                  alt={lightboxSlide.title}
                  fill
                  sizes="92vw"
                  className="object-cover"
                />
              </motion.div>
            </motion.div>

            {/* Navigasi slide di dalam lightbox */}
            <div
              className="mt-5 flex items-center gap-4 text-[#F4F6F9]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => {
                  const prevIdx =
                    (activeIndex - 1 + slides.length) % slides.length;
                  setActiveIndex(prevIdx);
                  setLightboxSlide(slides[prevIdx]);
                  setIsZoomed(false);
                }}
                aria-label="Foto sebelumnya"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#F4F6F9]/20 bg-[#131720]/70 hover:bg-[#F4F6F9] hover:text-[#131720]"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-xs text-[#98A4B8]">
                {activeIndex + 1} / {slides.length}
              </span>
              <button
                type="button"
                onClick={() => {
                  const nextIdx = (activeIndex + 1) % slides.length;
                  setActiveIndex(nextIdx);
                  setLightboxSlide(slides[nextIdx]);
                  setIsZoomed(false);
                }}
                aria-label="Foto berikutnya"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#F4F6F9]/20 bg-[#131720]/70 hover:bg-[#F4F6F9] hover:text-[#131720]"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
