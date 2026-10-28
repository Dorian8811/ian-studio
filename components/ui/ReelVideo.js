"use client";

import { useEffect, useRef, useState } from "react";
import Icon from "@/components/ui/Icon";
import styles from "./ReelVideo.module.css";

/**
 * Video de reel: silencioso y en loop mientras está a la vista, con
 * controles para pausar y activar el sonido. `active`, si se pasa, exige
 * además esa condición para reproducir (el carrusel desktop solo reproduce
 * la pieza centrada); si se omite, basta con estar en el viewport (rieles
 * móviles con scroll-snap nativo, sin estado de carrusel).
 *
 * `sources` va en orden de preferencia (AV1 → H.264): el navegador elige la
 * primera que puede decodificar.
 *
 * Con prefers-reduced-motion no arranca solo: queda el poster y el botón de
 * reproducir. La pausa manual se respeta hasta que el visitante la quite.
 */
export default function ReelVideo({ sources, poster, alt, active, priority = false }) {
  const videoRef = useRef(null);
  const [muted, setMuted] = useState(true);
  const [inView, setInView] = useState(false);
  // Cerca del viewport (600px). Hasta entonces preload="none": Chrome trata
  // "metadata" como permiso para bufferizar varios MB, y con cinco reels
  // (más la copia oculta del riel móvil) la home bajaba ~26 MB de video sin
  // que nadie hubiera llegado a la sección.
  const [near, setNear] = useState(false);
  // Estado real del <video>, sincronizado con sus eventos play/pause.
  const [paused, setPaused] = useState(true);
  // null = automático (autoplay salvo reduced-motion); "play" | "pause" =
  // lo que pidió el visitante con el botón.
  const [intent, setIntent] = useState(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.6,
    });
    const nearIo = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setNear(true);
        nearIo.disconnect();
      },
      { rootMargin: "600px" }
    );
    io.observe(el);
    nearIo.observe(el);
    return () => {
      io.disconnect();
      nearIo.disconnect();
    };
  }, []);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const wantsPlay = intent === "play" || (intent === null && !reduce);
    if (inView && active !== false && wantsPlay) el.play().catch(() => {});
    else el.pause();
  }, [inView, active, intent]);

  const togglePlay = (e) => {
    e.stopPropagation();
    setIntent(paused ? "play" : "pause");
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    setMuted((m) => !m);
  };

  return (
    <>
      <video
        ref={videoRef}
        className={styles.video}
        poster={poster}
        muted={muted}
        loop
        playsInline
        preload={near ? (priority ? "auto" : "metadata") : "none"}
        aria-label={alt}
        onPlay={() => setPaused(false)}
        onPause={() => setPaused(true)}
      >
        {sources.map((s) => (
          <source key={s.src} src={s.src} type={s.type} />
        ))}
      </video>

      <div className={styles.controls}>
        <button
          type="button"
          className={styles.ctrlBtn}
          onClick={togglePlay}
          aria-label={paused ? "Reproducir reel" : "Pausar reel"}
        >
          <Icon name={paused ? "play" : "pause"} size={15} />
        </button>
        <button
          type="button"
          className={styles.ctrlBtn}
          onClick={toggleMute}
          aria-label={muted ? "Activar sonido" : "Silenciar"}
          aria-pressed={!muted}
        >
          <Icon name={muted ? "sound-off" : "sound-on"} size={15} />
        </button>
      </div>
    </>
  );
}
