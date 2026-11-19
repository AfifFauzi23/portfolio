import type { Transition } from "framer-motion";

/**
 * Token animasi terpusat untuk menjaga konsistensi fisika gerak di seluruh situs.
 * Hanya menganimasikan properti GPU-friendly (transform, opacity, clip-path).
 */
export const MOTION = {
  ease: {
    /** Kurva studio yang tenang saat mendarat */
    editorial: [0.22, 1, 0.36, 1] as const,
    /** Kurva responsif untuk interaksi UI singkat */
    ui: [0.25, 0.1, 0.25, 1] as const,
    /** Kurva keluar yang cepat namun tetap terkendali */
    exit: [0.4, 0, 1, 1] as const,
  },
  spring: {
    /** Transisi elemen besar (shared-element, theater mode, lightbox) */
    stage: {
      type: "spring" as const,
      stiffness: 260,
      damping: 30,
      mass: 0.9,
    },
    /** Fisika carousel dengan momentum dan inersia halus */
    carousel: {
      type: "spring" as const,
      stiffness: 210,
      damping: 28,
      mass: 0.85,
    },
    /** Reaksi filter layout dan posisi kartu proyek */
    layout: {
      type: "spring" as const,
      stiffness: 320,
      damping: 32,
      mass: 0.75,
    },
    /** Efek magnetik tombol dan kursor kustom */
    tactile: {
      type: "spring" as const,
      stiffness: 380,
      damping: 26,
      mass: 0.5,
    },
  },
  duration: {
    fast: 0.22,
    base: 0.48,
    slow: 0.78,
  },
} as const;

export function getSafeTransition(
  prefersReducedMotion: boolean | null,
  transition: Transition
): Transition {
  if (prefersReducedMotion) {
    return { duration: 0.01 };
  }
  return transition;
}
