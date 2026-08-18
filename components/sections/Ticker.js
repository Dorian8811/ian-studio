import { tickerItems } from "@/data/content";
import styles from "./Ticker.module.css";

export default function Ticker() {
  return (
    <div className={styles.wrap} role="marquee" aria-label={`Servicios: ${tickerItems.join(", ")}`}>
      <div className={styles.track}>
        <div style={{ display: "flex" }}>
          {tickerItems.map((item, i) => (
            <span key={`a-${i}`} style={{ display: "contents" }}>
              <span className={styles.item}>{item}</span>
              <span className={styles.dot}>·</span>
            </span>
          ))}
        </div>
        <div style={{ display: "flex" }} aria-hidden="true">
          {tickerItems.map((item, i) => (
            <span key={`b-${i}`} style={{ display: "contents" }}>
              <span className={styles.item}>{item}</span>
              <span className={styles.dot}>·</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
