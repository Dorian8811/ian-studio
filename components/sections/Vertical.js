"use client";

import { useState } from "react";
import Image from "next/image";
import { verticalSlides, verticalNote } from "@/data/content";
import styles from "./Vertical.module.css";

const SLIDE_W = 300 + 24; // ancho + gap del track desktop

export default function Vertical() {
  const [active, setActive] = useState(0);
  const count = verticalSlides.length;

  const go = (i) => setActive((i + count) % count);

  return (
    <section id="vertical" className={styles.section}>
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
              ‹
            </button>
            <button type="button" className={styles.arrowBtn} onClick={() => go(active + 1)} aria-label="Reel siguiente">
              ›
            </button>
            <span className={styles.slideLabel}>
              {String(active + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>

      {/* Desktop: carrusel centrado controlado */}
      <div className={styles.desktopTrackWrap}>
        <div
          className={styles.desktopTrack}
          style={{ transform: `translateX(calc(50vw - 150px - ${active * SLIDE_W}px))` }}
        >
          {verticalSlides.map((s, i) => (
            <div key={s.id} className={`${styles.slide} ${active === i ? styles.active : ""}`}>
              <div className={styles.slideFrame}>
                <Image src={s.src} alt={s.alt} fill sizes="300px" style={{ objectPosition: s.objectPosition }} />
                <span className={styles.slideTag}>{s.label}</span>
              </div>
              <div className={styles.slideMeta}>
                <span>{s.categoria}</span>
                <span>{s.duracion}</span>
              </div>
            </div>
          ))}
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
        {verticalSlides.map((s) => (
          <div key={s.id} className={styles.mobileSlide}>
            <div className={styles.mobileFrame}>
              <Image src={s.src} alt={s.alt} fill sizes="62vw" style={{ objectPosition: s.objectPosition }} />
              <span className={styles.slideTag}>{s.label}</span>
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
