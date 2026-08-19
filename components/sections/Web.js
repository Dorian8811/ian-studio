"use client";

import { useReveal } from "@/hooks/useReveal";
import styles from "./Web.module.css";

export default function Web() {
  useReveal();
  return (
    <section id="web" className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.eyebrowRow} data-rv>
          <span>09 — Diseño Web</span>
          <span>Presencia Digital</span>
        </div>

        <div className={styles.grid}>
          <div className={styles.textContent} data-rv>
            <h2 className={styles.heading}>
              Tu presencia digital, <br />
              <span className={styles.italic}>llevada más allá del contenido.</span>
            </h2>
            <p className={styles.bodyText}>
              Diseñamos y desarrollamos soluciones web a la medida para negocios que necesitan convertir su identidad y contenido en una experiencia digital funcional, rápida y profesional. Cada proyecto se cotiza de forma independiente según su alcance y necesidades.
            </p>
            
            <ul className={styles.servicesList}>
              <li>Landing pages</li>
              <li>Sitios web para negocios</li>
              <li>Portafolios y catálogos</li>
              <li>Reservas y agendamiento</li>
              <li>Optimización y performance</li>
              <li>Mantenimiento continuo</li>
            </ul>

            <div className={styles.ctaWrap}>
              <a 
                href="https://wa.me/50689808289?text=Hola%2C%20me%20interesa%20cotizar%20el%20dise%C3%B1o%20y%20desarrollo%20de%20una%20p%C3%A1gina%20web."
                target="_blank"
                rel="noopener noreferrer"
                className={styles.ctaButton}
              >
                Cotizar proyecto web
              </a>
              <span className={styles.ctaNote}>Proyecto cotizado según alcance</span>
            </div>
          </div>

          <div className={styles.visualWrap} data-rv>
            <div className={styles.abstractBrowser}>
              <div className={styles.browserHeader}>
                <div className={styles.dots}>
                  <span />
                  <span />
                  <span />
                </div>
                <div className={styles.urlBar}>ian-studio.com</div>
              </div>
              <div className={styles.browserBody}>
                <div className={styles.wireHero}>
                  <div className={styles.wireTitle}></div>
                  <div className={styles.wireText}></div>
                  <div className={styles.wireTextShort}></div>
                </div>
                <div className={styles.wireGrid}>
                  <div className={styles.wireCard}></div>
                  <div className={styles.wireCard}></div>
                  <div className={styles.wireCard}></div>
                </div>
                <div className={styles.cursorWrapper}>
                  <svg className={styles.cursor} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.5 3L18.5 11.5L12 13L10 19.5L5.5 3Z" fill="var(--color-blue)" stroke="var(--color-black)" strokeWidth="1.5" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
