"use client";

import { useEffect, useState } from "react";

/**
 * Progreso de scroll y si ya se superaron los 60px para dar fondo a la
 * navegación. rAF-throttled, un solo listener para toda la app.
 *
 * El progreso NO pasa por estado de React: se escribe directo en
 * `barRef` como `scaleX()` (solo composición, sin layout ni re-render por
 * frame). Lo único que re-renderiza es el cambio de `scrolled`, que ocurre
 * una vez al cruzar los 60px.
 */
export function useScrollProgress(barRef) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let raf = null;

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        const h = document.documentElement.scrollHeight - window.innerHeight;
        const y = window.scrollY || 0;
        const p = h > 0 ? Math.min(1, y / h) : 0;
        const bar = barRef.current;
        if (bar) {
          bar.style.transform = `scaleX(${p.toFixed(4)})`;
          bar.setAttribute("aria-valuenow", String(Math.round(p * 100)));
        }
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
  }, [barRef]);

  return { scrolled };
}
