"use client";

import React from "react";
import { profileData } from "@/data/content";
import { useSmoothScroll } from "@/components/providers/SmoothScrollProvider";

export function Footer() {
  const { scrollTo } = useSmoothScroll();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 px-5 py-8 text-sm text-muted sm:flex-row sm:items-center sm:px-8 lg:px-12">
        <p>
          © {year} {profileData.name}. {profileData.location}.
        </p>

        <button
          type="button"
          onClick={() => scrollTo(0)}
          className="font-medium text-ink transition-colors hover:text-accent"
        >
          Kembali ke atas
        </button>
      </div>
    </footer>
  );
}
