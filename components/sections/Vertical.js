"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import ReelVideo from "@/components/ui/ReelVideo";
import Icon from "@/components/ui/Icon";
import { verticalSlides, verticalNote } from "@/data/content";
import { useReveal } from "@/hooks/useReveal";
import styles from "./Vertical.module.css";

const SLIDE_W = 300 + 24; // ancho + gap del track desktop

const pad = (n) => String(n).padStart(2, "0");

export default function Vertical() {
  const [active, setActive] = useState(0);
  const count = verticalSlides.length;

  const go = (i) => setActive((i + count) % count);

  // Flechas del teclado dentro del carrusel desktop.
  const onKeyDown = (e) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(active + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(active - 1);
    }
  };

  const sectionRef = useRef(null);
  useReveal(sectionRef);

  return (
    <section id="vertical" className={styles.section} ref={sectionRef}>
      <div className={styles.inner}>
        <div className={styles.eyebrowRow} data-rv>
          <span>05 — Contenido vertical</span>
          <span>9:16 · reels &amp; historias</span>
        </div>

        <div className={styles.headRow} data-rv>
          <h2 className={styles.heading}>
            Pensado
            <br />
            <span className={styles.headingItalic}>para vertical</span>
          </h2>
          <div className={styles.controls}>
            <button type="button" className={styles.arrowBtn} onClick={() => go(active - 1)} aria-label="Reel anterior">
              <Icon name="chevron-left" size={18} />
            </button>
            <button type="button" className={styles.arrowBtn} onClick={() => go(active + 1)} aria-label="Reel siguiente">
              <Icon name="chevron-right" size={18} />
            </button>
            <span className={styles.slideLabel} aria-live="polite">
              {pad(active + 1)} / {pad(count)}
            </span>
          </div>
        </div>
      </div>

      {/* Desktop: carrusel centrado controlado */}
      <div
        className={styles.desktopTrackWrap}
        role="region"
        aria-roledescription="carrusel"
        aria-label="Reels verticales"
        onKeyDown={onKeyDown}
      >
        <div
          className={styles.desktopTrack}
          style={{ transform: `translateX(calc(50vw - 150px - ${active * SLIDE_W}px))` }}
        >
          {verticalSlides.map((s, i) => {
            const isActive = active === i;
            return (
              <div
                key={s.id}
                className={`${styles.slide} ${isActive ? styles.active : ""}`}
                aria-roledescription="diapositiva"
                aria-label={`Reel ${pad(i + 1)} de ${pad(count)}: ${s.categoria}`}
              >
                <div className={styles.slideFrame}>
                  {s.type === "video" ? (
                    <ReelVideo sources={s.sources} poster={s.poster} alt={s.alt} active={isActive} priority={i === 0} />
                  ) : (
                    <Image src={s.src} alt={s.alt} fill sizes="300px" quality={90} style={{ objectPosition: s.objectPosition }} />
                  )}
                  <span className={styles.slideTag}>Reel {pad(i + 1)}</span>
                  {/* Las piezas laterales se centran con un clic. */}
                  {!isActive && (
                    <button
                      type="button"
                      className={styles.slideFocus}
                      onClick={() => go(i)}
                      aria-label={`Ver reel ${pad(i + 1)}: ${s.categoria}`}
                    />
                  )}
                </div>
                <div className={styles.slideMeta}>
                  <span>{s.categoria}</span>
                  <span>{s.duracion}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className={styles.dotsRow}>
        <div className={styles.dots}>
          {verticalSlides.map((s, i) => (
            <button
              key={s.id}
              type="button"
              className={`${styles.dot} ${active === i ? styles.active : ""}`}
              onClick={() => go(i)}
              aria-label={`Ir al reel ${i + 1}`}
              aria-current={active === i}
            />
          ))}
        </div>
        <p className={styles.note}>{verticalNote}</p>
      </div>

      {/* Mobile / tablet: scroll-snap nativo, sin estado de JS */}
      <div className={styles.mobileScroller}>
        {verticalSlides.map((s, i) => (
          <div key={s.id} className={styles.mobileSlide}>
            <div className={styles.mobileFrame}>
              {s.type === "video" ? (
                <ReelVideo sources={s.sources} poster={s.poster} alt={s.alt} />
              ) : (
                <Image src={s.src} alt={s.alt} fill sizes="62vw" quality={90} style={{ objectPosition: s.objectPosition }} />
              )}
              <span className={styles.slideTag}>Reel {pad(i + 1)}</span>
            </div>
            <div className={styles.slideMeta}>
              <span>{s.categoria}</span>
              <span>{s.duracion}</span>
            </div>
          </div>
        ))}
      </div>
      <p className={styles.mobileNote}>{verticalNote}</p>
    </section>
  );
}
