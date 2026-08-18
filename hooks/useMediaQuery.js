"use client";

import { useEffect, useState } from "react";

/**
 * Devuelve si un media query coincide. Empieza en `false` en el servidor
 * y se corrige tras el primer efecto — evita mismatches de hidratación
 * porque el layout inicial (mobile-first) es válido en ambos casos.
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const update = () => setMatches(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [query]);

  return matches;
}

export function usePrefersReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
