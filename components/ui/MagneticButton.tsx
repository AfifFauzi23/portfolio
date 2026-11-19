"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { MOTION } from "@/lib/motion";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  ariaLabel?: string;
  dataCursor?: string;
}

export function MagneticButton({
  children,
  className = "",
  strength = 0.22,
  onClick,
  type = "button",
  disabled = false,
  ariaLabel,
  dataCursor = "pointer",
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const prefersReduced = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, MOTION.spring.tactile);
  const springY = useSpring(y, MOTION.spring.tactile);

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (prefersReduced || disabled || e.pointerType !== "mouse") return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const offsetX = e.clientX - (rect.left + rect.width / 2);
    const offsetY = e.clientY - (rect.top + rect.height / 2);
    x.set(offsetX * strength);
    y.set(offsetY * strength);
  };

  const handlePointerLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      type={type}
      disabled={disabled}
      aria-label={ariaLabel}
      data-cursor={dataCursor}
      onClick={onClick}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={prefersReduced ? undefined : { x: springX, y: springY }}
      whileTap={prefersReduced ? undefined : { scale: 0.97 }}
      className={className}
    >
      {children}
    </motion.button>
  );
}
