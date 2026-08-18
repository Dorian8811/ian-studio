"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { useScrollLock } from "@/hooks/useScrollLock";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { site } from "@/data/site";
import styles from "./Nav.module.css";

export default function Nav() {
  const { progress, scrolled } = useScrollProgress();
  const [menuOpen, setMenuOpen] = useState(false);
  const overlayRef = useRef(null);

  useScrollLock(menuOpen);
  useFocusTrap(overlayRef, menuOpen);

  const close = () => setMenuOpen(false);

  return (
    <>
      <div
        className={styles.progress}
        style={{ width: `${progress}%` }}
        role="progressbar"
        aria-label="Progreso de lectura"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
      />

      <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
        <div className={styles.bar}>
          <a href="#top" className={styles.brand}>
            <Image src="/images/logo.png" alt={site.name} width={94} height={77} priority />
            <span className={styles.brandText}>
              <span className={styles.wordmark}>IAN STUDIO</span>
              <span className={styles.sublabel}>{site.tagline.toUpperCase()}</span>
            </span>
          </a>

          <nav className={styles.navRight} aria-label="Navegación principal">
            <div className={styles.navLinks}>
              {site.nav.map((item) => (
                <a key={item.href} href={item.href} className={styles.navLink}>
                  {item.label}
                </a>
              ))}
            </div>
            <button
              type="button"
              className={styles.burger}
              onClick={() => setMenuOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              <span className={styles.burgerIcon}>
                <span />
                <span />
              </span>
              Menú
            </button>
            <a href="#contacto" className={styles.cta}>
              <span className={styles.ctaDot} />
              Trabajemos juntos
            </a>
          </nav>
        </div>
      </header>

      <div
        id="mobile-menu"
        ref={overlayRef}
        className={`${styles.overlay} ${menuOpen ? styles.open : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación"
        aria-hidden={!menuOpen}
        tabIndex={-1}
        onKeyDown={(e) => {
          if (e.key === "Escape") close();
        }}
      >
        <Image src="/images/logo.png" alt={site.name} width={78} height={64} className={styles.overlayLogo} />
        <button type="button" className={styles.overlayClose} onClick={close}>
          Cerrar ✕
        </button>

        {site.nav.map((item, i) => (
          <a
            key={item.href}
            href={item.href}
            className={`${styles.overlayLink} ${item.href === "#categorias" ? styles.accent : ""}`}
            style={{ transitionDelay: menuOpen ? `${i * 40}ms` : "0ms" }}
            onClick={close}
          >
            {item.label}
          </a>
        ))}

        <div className={styles.overlayContact}>
          <a href={site.contact.whatsapp.href} onClick={close}>
            {site.contact.whatsapp.label}
          </a>
          <a href={site.contact.email.href} onClick={close}>
            {site.contact.email.label}
          </a>
        </div>
      </div>
    </>
  );
}
