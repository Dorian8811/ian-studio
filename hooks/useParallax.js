"use client";

import { useEffect } from "react";

/**
 * Parallax global y moderado para [data-par="factor"]. Un único listener
 * de scroll (rAF-throttled) mueve todos los elementos marcados; factor
 * típico 0.06–0.09 mantiene el desplazamiento muy por debajo de 40px.
 * Se desactiva por completo con prefers-reduced-motion.
 */
export function useParallax() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    const els = Array.from(document.querySelectorAll("[data-par]"));
    if (els.length === 0) return undefined;

    let raf = null;

    const update = () => {
      raf = null;
      const vh = window.innerHeight;
      els.forEach((el) => {
        const f = parseFloat(el.getAttribute("data-par")) || 0;
        const r = el.getBoundingClientRect();
        const d = (r.top + r.height / 2 - vh / 2) / vh;
        el.style.transform = `translate3d(0,${(d * f * 120).toFixed(1)}px,0)`;
      });
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };

    els.forEach((el) => {
      el.style.willChange = "transform";
    });

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
}
