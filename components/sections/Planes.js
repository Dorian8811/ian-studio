"use client";

import { useState } from "react";
import { plans, plansMeta, comparisonRows } from "@/data/plans";
import { site } from "@/data/site";
import styles from "./Planes.module.css";

const recommendedIndex = plans.findIndex((p) => p.recommended);

export default function Planes() {
  const [hovered, setHovered] = useState(-1);
  const [mobileSelected, setMobileSelected] = useState(recommendedIndex);
  const [compareOpen, setCompareOpen] = useState(false);

  const mobilePlan = plans[mobileSelected];

  return (
    <section id="planes" className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.eyebrowRow} data-rv>
          <span>10 — Planes mensuales</span>
          <span>{plansMeta.vigencia}</span>
        </div>

        <div className={styles.headRow} data-rv>
          <h2 className={styles.heading}>Elige el nivel de producción que necesita la marca.</h2>
          <p className={styles.subtext}>
            Fotografía de producto, reels y piezas listas para publicar. Los alcances pueden
            ajustarse según inventario, ubicación y frecuencia.
          </p>
        </div>

        {/* Desktop: tres columnas */}
        <div className={styles.desktopPlans}>
          {plans.map((p, i) => (
            <div
              key={p.id}
              className={`${styles.planCol} ${p.recommended ? styles.recommended : ""} ${
                hovered === i ? styles.hovered : ""
              }`}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(-1)}
              data-rv
            >
              {p.recommended && <div className={styles.recBar} />}
              <div className={styles.planTop}>
                <span className={styles.planName}>{p.name}</span>
                {p.recommended ? (
                  <span className={styles.recTag}>Recomendado</span>
                ) : (
                  <span className={styles.planNum}>{p.num}</span>
                )}
              </div>
              <div className={styles.features}>
                {p.features.map((f) => (
                  <span key={f} className={styles.feature}>
                    {f}
                  </span>
                ))}
              </div>
              <a
                href={site.contact.whatsapp.href}
                className={p.recommended ? styles.ctaButton : styles.ctaLink}
              >
                {p.cta} {p.recommended ? "" : "→"}
              </a>
            </div>
          ))}
        </div>

        {/* Mobile: control segmentado */}
        <div className={styles.mobilePlans}>
          <div className={styles.segmented} role="tablist" aria-label="Elegir plan">
            {plans.map((p, i) => (
              <button
                key={p.id}
                type="button"
                role="tab"
                aria-selected={mobileSelected === i}
                className={styles.segBtn}
                onClick={() => setMobileSelected(i)}
              >
                {p.nameShort || p.name}
              </button>
            ))}
          </div>

          <div key={mobilePlan.id} className={styles.mobileCard}>
            <div className={styles.mobileTop}>
              <span className={styles.planName} style={{ color: "#f6f7fa" }}>
                {mobilePlan.name}
              </span>
              {mobilePlan.recommended && <span className={styles.recTag}>Recomendado</span>}
            </div>
            <div className={styles.features}>
              {mobilePlan.features.map((f) => (
                <span key={f} className={styles.feature}>
                  {f}
                </span>
              ))}
            </div>
            <a href={site.contact.whatsapp.href} className={styles.mobileCta}>
              {mobilePlan.cta}
            </a>
          </div>
        </div>

        <div className={`${styles.compareWrap} ${compareOpen ? styles.open : ""}`}>
          <button
            type="button"
            className={styles.compareToggle}
            onClick={() => setCompareOpen((v) => !v)}
            aria-expanded={compareOpen}
            aria-controls="compare-panel"
          >
            <span>{compareOpen ? "Ocultar comparación de alcance" : "Comparar alcance completo"}</span>
            <span className={styles.comparePlus} aria-hidden="true">
              +
            </span>
          </button>
          <div id="compare-panel" className={styles.comparePanel}>
            <div className={styles.compareScroll}>
              <div className={styles.compareTable}>
                <div className={styles.compareHead}>
                  <span>Alcance</span>
                  <span>Básico</span>
                  <span>Avanzado</span>
                  <span>Profesional</span>
                </div>
                {comparisonRows.map((r) => (
                  <div key={r.k} className={styles.compareRow}>
                    <span>{r.k}</span>
                    <span>{r.a}</span>
                    <span>{r.b}</span>
                    <span>{r.c}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
