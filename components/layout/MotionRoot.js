"use client";

import { useReveal } from "@/hooks/useReveal";
import { useParallax } from "@/hooks/useParallax";

/**
 * Motor de motion global: reveal-on-scroll y parallax para toda la página,
 * montado una sola vez. No renderiza nada — opera sobre [data-rv] y
 * [data-par] ya presentes en el DOM que ya vino renderizado del servidor.
 */
export default function MotionRoot() {
  useReveal();
  useParallax();
  return null;
}
