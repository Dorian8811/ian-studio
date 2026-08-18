"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./ReelVideo.module.css";

/**
 * Video de reel: silencioso y en loop mientras está a la vista, con un
 * botón para activar el sonido. `active`, si se pasa, exige además esa
 * condición para reproducir (el carrusel desktop solo reproduce la pieza
 * centrada); si se omite, basta con estar en el viewport (rieles móviles
 * con scroll-snap nativo, sin estado de carrusel).
 */
export default function ReelVideo({ src, poster, alt, active, priority = false }) {
  const videoRef = useRef(null);
  const [muted, setMuted] = useState(true);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.6,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const shouldPlay = inView && active !== false;
    if (shouldPlay) el.play().catch(() => {});
    else el.pause();
  }, [inView, active]);

  return (
    <>
      <video
        ref={videoRef}
        className={styles.video}
        src={src}
        poster={poster}
        muted={muted}
        loop
        playsInline
        preload={priority ? "auto" : "metadata"}
        aria-label={alt}
      />
      <button
        type="button"
        className={styles.muteBtn}
        onClick={(e) => {
          e.stopPropagation();
          setMuted((m) => !m);
        }}
        aria-label={muted ? "Activar sonido" : "Silenciar"}
        aria-pressed={!muted}
      >
        {muted ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M4 9v6h4l5 5V4L8 9H4Z" />
            <path d="M16 9.5 20.5 14M20.5 9.5 16 14" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M4 9v6h4l5 5V4L8 9H4Z" />
            <path d="M17 8.5a5 5 0 0 1 0 7" />
            <path d="M19.5 6a8.5 8.5 0 0 1 0 12" />
          </svg>
        )}
      </button>
    </>
  );
}
