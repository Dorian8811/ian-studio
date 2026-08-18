import Link from "next/link";
import styles from "./not-found.module.css";

export const metadata = {
  title: "Página no encontrada",
};

export default function NotFound() {
  return (
    <div className={styles.wrap}>
      <span className={styles.code}>404 — fuera de cuadro</span>
      <h1 className={styles.heading}>
        Esta imagen
        <br />
        <span className={styles.headingItalic}>no existe</span>
      </h1>
      <p className={styles.text}>
        La página que buscas se movió, se editó o nunca estuvo aquí. Volvé al portafolio para
        seguir viendo el trabajo.
      </p>
      <Link href="/" className={styles.cta}>
        Volver al inicio
      </Link>
    </div>
  );
}
