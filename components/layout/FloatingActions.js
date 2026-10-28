"use client";

import { useEffect, useState } from "react";
import Icon from "@/components/ui/Icon";
import { site } from "@/data/site";
import styles from "./FloatingActions.module.css";

/**
 * WhatsApp y «volver arriba», fijos abajo a la derecha.
 *
 * Aparecen al dejar atrás el hero (ahí ya están los CTA grandes). El de
 * WhatsApp se retira mientras la sección de contacto está en pantalla, que
 * tiene el mismo enlace en grande; «volver arriba» se queda.
 *
 * Como useScrollProgress, solo re-renderiza al cruzar el umbral, no por
 * frame. Ocultos usan `visibility: hidden` (vía CSS), así que salen del
 * orden de tabulación y del árbol de accesibilidad.
 */
export default function FloatingActions() {
  const [pastHero, setPastHero] = useState(false);
  const [atContact, setAtContact] = useState(false);

  useEffect(() => {
    let raf = null;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        setPastHero(window.scrollY > window.innerHeight * 0.9);
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const contact = document.getElementById("contacto");
    if (!contact) return;
    const io = new IntersectionObserver(([entry]) => setAtContact(entry.isIntersecting), {
      threshold: 0.15,
    });
    io.observe(contact);
    return () => io.disconnect();
  }, []);

  const toTop = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    // El botón se oculta al llegar arriba: el foco pasa a la marca del
    // header para que el teclado no quede en un elemento invisible.
    document.querySelector('header a[href="#top"]')?.focus({ preventScroll: true });
  };

  return (
    // WhatsApp arriba y «volver arriba» en la esquina: cuando WhatsApp se
    // retira, el otro botón no se mueve de lugar.
    <div className={`${styles.stack} ${pastHero ? styles.shown : ""}`}>
      <a
        href={site.contact.whatsapp.href}
        className={`${styles.btn} ${styles.whatsapp} ${atContact ? styles.away : ""}`}
        aria-label="Escribir por WhatsApp"
      >
        <Icon name="chat" size={18} />
        <span className={styles.label}>WhatsApp</span>
      </a>
      <button type="button" className={`${styles.btn} ${styles.top}`} onClick={toTop} aria-label="Volver arriba">
        <Icon name="arrow-up" size={18} />
      </button>
    </div>
  );
}
