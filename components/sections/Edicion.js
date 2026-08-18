import { edicion } from "@/data/content";
import { getPiece } from "@/data/portfolio";
import BeforeAfter from "@/components/ui/BeforeAfter";
import styles from "./Edicion.module.css";

export default function Edicion() {
  const antes = getPiece(edicion.antes);
  const despues = getPiece(edicion.despues);

  return (
    <section id="edicion" className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.eyebrowRow} data-rv>
          <span>07 — Edición</span>
          <span>Antes / Después</span>
        </div>

        <div className={styles.grid}>
          <div data-rv>
            <h2 className={styles.heading}>
              {edicion.headingA}
              <br />
              <span className={styles.headingItalic}>{edicion.headingItalic}</span>
              {edicion.headingB}
            </h2>
            <p className={styles.text}>{edicion.texto}</p>
            <div className={styles.factRow}>
              {edicion.ficha.map((f) => (
                <div key={f.k} className={styles.factCol}>
                  <span>{f.k}</span>
                  <span>{f.v}</span>
                </div>
              ))}
            </div>
          </div>

          <div data-rv>
            <BeforeAfter
              before={{ src: antes.src, alt: antes.alt }}
              after={{ src: despues.src, alt: despues.alt }}
            />
            <div className={styles.hint}>
              <span>Arrastra para comparar</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
