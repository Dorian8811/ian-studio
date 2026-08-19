import { extras, conditions } from "@/data/extras";
import styles from "./Extras.module.css";

export default function Extras() {
  return (
    <section id="extras" className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.eyebrowRow} data-rv>
          <span>11 — Extras</span>
          <span>Personaliza el alcance</span>
        </div>

        <div className={styles.grid}>
          <div>
            {extras.map((e) => (
              <div key={e.num} className={styles.line} data-rv>
                <span className={styles.lineNum}>{e.num}</span>
                <span className={styles.lineName}>{e.name}</span>
              </div>
            ))}
          </div>

          <div data-rv>
            <div className={styles.condTitle}>Condiciones</div>
            <div className={styles.condList}>
              {conditions.map((c) => (
                <span key={c}>{c}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
