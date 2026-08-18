"use client";

import { useEffect, useState } from "react";

/**
 * Progreso de scroll (0–100) y si ya se superaron los 60px para dar
 * fondo a la navegación. rAF-throttled, un solo listener para toda la app.
 */
export function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let raf = null;

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        const h = document.documentElement.scrollHeight - window.innerHeight;
        const y = window.scrollY || 0;
        setProgress(h > 0 ? Math.min(100, (y / h) * 100) : 0);
        setScrolled(y > 60);
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return { progress, scrolled };
}
