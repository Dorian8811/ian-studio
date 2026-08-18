"use client";

import { useEffect } from "react";

/**
 * Revela una sola vez los elementos [data-rv] dentro de `root` cuando
 * cruzan el 88% del viewport. Replica el comportamiento de la maqueta
 * original: sin JS o si algo falla, un timeout de seguridad los muestra.
 * Con prefers-reduced-motion, el CSS ya los deja visibles de inmediato.
 */
export function useReveal(root) {
  useEffect(() => {
    const scope = root && root.current ? root.current : document;
    const els = Array.from(scope.querySelectorAll("[data-rv]"));
    if (els.length === 0) return undefined;

    const show = (el) => el.classList.add("is-visible");

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      els.forEach(show);
      return undefined;
    }

    // Cualquier elemento ya pintado dentro del viewport inicial se muestra
    // de inmediato. Usar un factor <1 aquí (como 0.92) deja un hueco entre
    // este chequeo y el rootMargin del IntersectionObserver de abajo: los
    // elementos que caen en ese hueco nunca se revelan si el usuario no
    // hace scroll. Comparar contra innerHeight completo lo cierra.
    els.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight) show(el);
    });

    const pending = els.filter((el) => !el.classList.contains("is-visible"));
    if (pending.length === 0) return undefined;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => show(entry.target), i * 70);
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 }
    );
    pending.forEach((el) => io.observe(el));

    const safety = setTimeout(() => pending.forEach(show), 4000);

    return () => {
      io.disconnect();
      clearTimeout(safety);
    };
  }, [root]);
}
