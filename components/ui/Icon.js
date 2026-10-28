/**
 * Íconos del sistema: SVG propios, un solo trazo (1.5) y extremos
 * redondeados, heredando `currentColor`. Reemplazan los glifos Unicode
 * (‹ › ✕ ↓ ↗ → +), que cambian de peso y alineación según la fuente.
 *
 * Decorativos por defecto (`aria-hidden`): el control que los contiene es
 * quien lleva el nombre accesible.
 */

const PATHS = {
  "chevron-left": "M14.5 6 8.5 12l6 6",
  "chevron-right": "m9.5 6 6 6-6 6",
  close: "M6.5 6.5l11 11M17.5 6.5l-11 11",
  plus: "M12 5.5v13M5.5 12h13",
  "arrow-down": "M12 5v14M6.5 13.5 12 19l5.5-5.5",
  "arrow-up": "M12 19V5M6.5 10.5 12 5l5.5 5.5",
  chat: "M20.5 12a8.5 8.5 0 0 1-12.6 7.45L3.5 20.5l1.05-4.4A8.5 8.5 0 1 1 20.5 12Z",
  "arrow-right": "M5 12h14M13.5 6.5 19 12l-5.5 5.5",
  "arrow-up-right": "M7 17 17 7M8.5 7H17v8.5",
  play: "M8 5.5v13l10.5-6.5L8 5.5Z",
  pause: "M8.5 5.5v13M15.5 5.5v13",
  "sound-off": "M4 9.5v5h3.5L12 18.5v-13L7.5 9.5H4ZM16 9.5l4.5 5M20.5 9.5l-4.5 5",
  "sound-on": "M4 9.5v5h3.5L12 18.5v-13L7.5 9.5H4ZM15.5 9a4.2 4.2 0 0 1 0 6M18 6.5a7.8 7.8 0 0 1 0 11",
};

export default function Icon({ name, size = 16, className, strokeWidth = 1.5 }) {
  const d = PATHS[name];
  if (!d) return null;
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={d} />
    </svg>
  );
}
