"use client";

import { useEffect } from "react";

/**
 * Revela los elementos [data-rv] dentro de `root` cuando cruzan el 88% del
 * viewport, una sola vez cada uno. Replica el comportamiento de la maqueta
 * original: sin JS o si algo falla, un timeout de seguridad los muestra.
 * Con prefers-reduced-motion, el CSS ya los deja visibles de inmediato.
 */
export function useReveal(root) {
  useEffect(() => {
    const scope = root && root.current ? root.current : document;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Un atributo, no una clase: React controla `className` en cada re-render
    // de la sección dueña del elemento (cualquier toggle de estado — abrir un
    // acordeón, cambiar de categoría, hover en un plan) y reescribe `class`
    // por completo, borrando cualquier clase añadida a mano. `data-revealed`
    // nunca es una prop de React en estos nodos, así que sobrevive intacto.
    const show = (el) => el.setAttribute("data-revealed", "true");
    const isRevealed = (el) => el.getAttribute("data-revealed") === "true";

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

    // Cualquier elemento ya pintado dentro del viewport se muestra de
    // inmediato; el resto se observa para revelarlo al hacer scroll.
    // Comparar contra innerHeight completo (no un factor <1) evita un hueco
    // entre este chequeo y el rootMargin del IntersectionObserver — un
    // elemento que cayera en ese hueco nunca se revelaría sin scroll.
    const track = (el) => {
      if (isRevealed(el)) return;
      if (reduce) {
        show(el);
        return;
      }
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight) show(el);
      else io.observe(el);
    };

    Array.from(scope.querySelectorAll("[data-rv]")).forEach(track);

    // Secciones que se ocultan condicionalmente (p. ej. Metal en movimiento
    // al filtrar por Gastronomía) se desmontan y vuelven a montar — React
    // crea nodos nuevos que este observer nunca vio. Sin este observer, esos
    // nodos se quedan en opacity:0 para siempre: el espacio sigue
    // reservado mientras el contenido es invisible, un hueco negro fantasma.
    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes.forEach((node) => {
          if (node.nodeType !== 1) return;
          if (node.matches?.("[data-rv]")) track(node);
          node.querySelectorAll?.("[data-rv]").forEach(track);
        });
      }
    });
    mo.observe(scope === document ? document.body : scope, { childList: true, subtree: true });

    const safety = setTimeout(() => {
      scope.querySelectorAll("[data-rv]").forEach((el) => {
        if (!isRevealed(el)) show(el);
      });
    }, 4000);

    return () => {
      io.disconnect();
      mo.disconnect();
      clearTimeout(safety);
    };
  }, [root]);
}
