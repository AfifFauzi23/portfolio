"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Maximize2, Minimize2, Pause, Play, Volume2, VolumeX, X } from "lucide-react";
import { showreelData } from "@/data/content";
import { MOTION, getSafeTransition } from "@/lib/motion";

export function ShowreelVideo() {
  const prefersReduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const inlineVideoRef = useRef<HTMLVideoElement>(null);
  const theaterVideoRef = useRef<HTMLVideoElement>(null);

  const [videoAvailable, setVideoAvailable] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [theaterOpen, setTheaterOpen] = useState(false);

  // Autoplay muted saat masuk viewport
  useEffect(() => {
    const el = containerRef.current;
    const video = inlineVideoRef.current;
    if (!el || !video || !videoAvailable || prefersReduced) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting && !theaterOpen) {
          video
            .play()
            .then(() => setIsPlaying(true))
            .catch(() => setIsPlaying(false));
        } else if (!entry.isIntersecting) {
          video.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.45 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [videoAvailable, theaterOpen, prefersReduced]);

  // Sinkronkan posisi waktu saat masuk/keluar mode teater
  useEffect(() => {
    const inlineVid = inlineVideoRef.current;
    const theaterVid = theaterVideoRef.current;
    if (theaterOpen && theaterVid && inlineVid && videoAvailable) {
      theaterVid.currentTime = inlineVid.currentTime;
      theaterVid.muted = isMuted;
      inlineVid.pause();
      theaterVid
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  }, [theaterOpen, isMuted, videoAvailable]);

  // Tutup mode teater dengan Escape
  useEffect(() => {
    if (!theaterOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeTheater();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theaterOpen]);

  const activeVideo = () =>
    theaterOpen ? theaterVideoRef.current : inlineVideoRef.current;

  const togglePlay = () => {
    const vid = activeVideo();
    if (!vid || !videoAvailable) return;
    if (vid.paused) {
      vid
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    } else {
      vid.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    if (inlineVideoRef.current) inlineVideoRef.current.muted = next;
    if (theaterVideoRef.current) theaterVideoRef.current.muted = next;
  };

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const vid = e.currentTarget;
    if (!vid.duration) return;
    setDuration(vid.duration);
    setProgress((vid.currentTime / vid.duration) * 100);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vid = activeVideo();
    if (!vid || !vid.duration) return;
    const pct = Number(e.target.value);
    vid.currentTime = (pct / 100) * vid.duration;
    setProgress(pct);
  };

  const closeTheater = () => {
    const inlineVid = inlineVideoRef.current;
    const theaterVid = theaterVideoRef.current;
    if (inlineVid && theaterVid && videoAvailable) {
      inlineVid.currentTime = theaterVid.currentTime;
    }
    setTheaterOpen(false);
  };

  const renderControls = (inTheater: boolean) => (
    <div
      className="absolute inset-x-0 bottom-0 flex flex-col gap-3 bg-gradient-to-t from-[#131720]/85 via-[#131720]/40 to-transparent p-4 text-[#F4F6F9] sm:p-6"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={togglePlay}
          disabled={!videoAvailable}
          aria-label={isPlaying ? "Jeda video" : "Putar video"}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F4F6F9]/15 backdrop-blur-sm transition-colors hover:bg-[#F4F6F9]/25 disabled:opacity-40"
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </button>

        <button
          type="button"
          onClick={toggleMute}
          disabled={!videoAvailable}
          aria-label={isMuted ? "Aktifkan suara" : "Bisukan suara"}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F4F6F9]/15 backdrop-blur-sm transition-colors hover:bg-[#F4F6F9]/25 disabled:opacity-40"
        >
          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>

        <div className="flex flex-1 items-center gap-3">
          <input
            type="range"
            min={0}
            max={100}
            step={0.1}
            value={progress}
            onChange={handleSeek}
            disabled={!videoAvailable || duration === 0}
            aria-label="Progres pemutaran video"
            className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-[#F4F6F9]/30 accent-[#6E8BFF] disabled:cursor-not-allowed"
          />
        </div>

        <button
          type="button"
          onClick={() => (inTheater ? closeTheater() : setTheaterOpen(true))}
          aria-label={inTheater ? "Keluar dari mode teater" : "Buka mode teater"}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F4F6F9]/15 backdrop-blur-sm transition-colors hover:bg-[#F4F6F9]/25"
        >
          {inTheater ? (
            <Minimize2 className="h-4 w-4" />
          ) : (
            <Maximize2 className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );

  const renderPosterFallback = () => (
    <div className="relative h-full w-full">
      <Image
        src={showreelData.video.poster}
        alt={showreelData.video.title}
        fill
        sizes="(max-width: 1280px) 100vw, 1280px"
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 flex flex-col items-start justify-center bg-[#131720]/35 p-6 text-[#F4F6F9] sm:p-12">
        <span className="inline-flex items-center rounded-full border border-[#F4F6F9]/25 bg-[#131720]/60 px-3.5 py-1.5 text-xs font-medium backdrop-blur-sm">
          {showreelData.video.emptyLabel}
        </span>
        <p className="mt-4 max-w-md font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          {showreelData.video.title}
        </p>
        <p className="mt-2 max-w-lg text-sm text-[#F4F6F9]/80">
          {showreelData.video.emptyHint}
        </p>
      </div>
    </div>
  );

  return (
    <div ref={containerRef} className="relative w-full">
      <motion.div
        layoutId="showreel-video-stage"
        transition={getSafeTransition(prefersReduced, MOTION.spring.stage)}
        onClick={() => setTheaterOpen(true)}
        data-cursor="play"
        role="button"
        tabIndex={0}
        aria-label="Buka showreel dalam mode teater"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setTheaterOpen(true);
          }
        }}
        className="group relative aspect-video w-full overflow-hidden rounded-2xl border border-border bg-[#131720]"
      >
        {videoAvailable ? (
          <video
            ref={inlineVideoRef}
            src={showreelData.video.src}
            poster={showreelData.video.poster}
            muted={isMuted}
            loop
            playsInline
            preload="metadata"
            onTimeUpdate={handleTimeUpdate}
            onError={() => setVideoAvailable(false)}
            className="h-full w-full object-cover"
          />
        ) : (
          renderPosterFallback()
        )}

        {renderControls(false)}
      </motion.div>

      {/* Mode Teater (Shared-Element Transition) */}
      <AnimatePresence>
        {theaterOpen && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Mode teater showreel"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.24 }}
            onClick={closeTheater}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#0D1017]/92 p-4 backdrop-blur-md sm:p-8 lg:p-12"
          >
            <button
              type="button"
              onClick={closeTheater}
              aria-label="Tutup mode teater"
              className="fixed top-5 right-5 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-[#F4F6F9]/20 bg-[#131720]/80 text-[#F4F6F9] transition-colors hover:bg-[#F4F6F9] hover:text-[#131720]"
            >
              <X className="h-5 w-5" />
            </button>

            <motion.div
              layoutId="showreel-video-stage"
              transition={getSafeTransition(prefersReduced, MOTION.spring.stage)}
              onClick={(e) => e.stopPropagation()}
              className="relative aspect-video w-full max-w-6xl overflow-hidden rounded-2xl border border-[#F4F6F9]/15 bg-[#131720]"
            >
              {videoAvailable ? (
                <video
                  ref={theaterVideoRef}
                  src={showreelData.video.src}
                  poster={showreelData.video.poster}
                  muted={isMuted}
                  loop
                  playsInline
                  onTimeUpdate={handleTimeUpdate}
                  className="h-full w-full object-cover"
                />
              ) : (
                renderPosterFallback()
              )}
              {renderControls(true)}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
