# Ian Studio

Sitio web de portafolio de Ian Solís — fotografía, video vertical y contenido
mensual para negocios y marcas personales en Costa Rica.

Implementación en Next.js del sistema visual **Luz Dura** diseñado en Claude
Design. La maqueta original vive en [`_design/`](_design/) como referencia y
no se toca durante el desarrollo.

## Requisitos

- Node.js ≥ 20.9 (probado con 24.19.0)
- npm ≥ 10 (probado con 11.17.0)

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Build de producción

```bash
npm run build
npm run start
```

## Lint

```bash
npm run lint
```

## Estructura

```
app/                  App Router: layout, page, /privacidad, /terminos, SEO (sitemap, robots, OG, íconos)
components/
  layout/             Nav, menú móvil, motor de motion global, WhatsApp / volver arriba flotantes
  legal/              Plantilla de las páginas legales (contenido en data/legal.js)
  sections/            Las 11 secciones de la landing
  portfolio/           Filtro de categorías, galería editorial, lightbox
  ui/                  Piezas reutilizables (íconos, comparador, reel)
hooks/                 Reveal, parallax, scroll lock, focus trap, media queries
data/                  Fuente única de verdad de todo el contenido y precios
lib/                   Composición de la galería y placeholders borrosos
public/images/         Fotografías de producción (nombres normalizados)
scripts/build-assets.mjs   Genera public/images + iconos + OG + placeholders
scripts/build-videos.mjs   Genera los reels AV1 + H.264 y sus posters
_design/               Maqueta original de Claude Design — solo referencia
```

## Masters del Drive

Los originales que entrega Ian viven en su carpeta compartida de Google
Drive. Se copian a `_design/uploads/drive/` (privado, fuera de Git) con
nombres en minúsculas-con-guiones — `img-1-automotriz.png`,
`reel-1.mp4`, etc. — y los dos scripts de abajo generan todo lo que se
publica a partir de ahí. Nunca se edita a mano un archivo de `public/`.

## Cómo añadir una fotografía nueva

1. Copia el master a `_design/uploads/drive/`.
2. Añade una entrada en `scripts/build-assets.mjs` → arreglo `PHOTOS`
   (`{ from, to, mode }`, con `to` en minúsculas-con-guiones). El modo
   decide cómo se guarda la fuente, siempre sin perder calidad:
   - `lossless` para PNG sin pérdida → WebP lossless (píxel idéntico).
   - `camera` para JPEG de cámara → lado largo 3840 px, JPEG q95 4:4:4.
   - `copy` cuando no hay master: copia los bytes tal cual.
3. Corre `npm run assets` — escribe `public/images/`, el inventario y los
   placeholders borrosos (`data/blur.json`).
4. Añade la pieza a `data/portfolio.js` con sus dimensiones reales
   (`width`/`height` — así el layout reserva el espacio sin saltos), su
   `categoria`, `orientacion` y el resto de metadatos.
5. Si quieres que aparezca en la edición curada de "Todo", pon
   `seleccion: true` y un `ordenTodo`.

No hay que tocar ningún componente: la galería, el lightbox y la selección
de "Todo" leen siempre de `data/portfolio.js`.

## Cómo añadir un reel de video nuevo

Necesitas [ffmpeg](https://ffmpeg.org) con `libsvtav1` y `libx264`.

1. Copia el master a `_design/uploads/drive/`.
2. Añade una entrada en `scripts/build-videos.mjs` → arreglo `REELS`
   (`{ id, from, poster }`, donde `poster` es el segundo exacto del
   fotograma de portada).
3. Corre `npm run videos` (o `npm run videos -- reel-06` para uno solo).
   Genera dos archivos por reel — `reel-06.av1.mp4` (AV1 10 bits, fuente
   principal) y `reel-06.mp4` (H.264, respaldo para dispositivos sin AV1)
   — más `public/images/reel-06-poster.jpg` desde el master. Los masters
   4K se reducen a 1080×1920.
4. Añade la pieza a `verticalSlides` en `data/content.js` con
   `sources: reelSources("reel-06")`, `poster`, `categoria` y `duracion`.

El rótulo "Reel 01…" y el contador ("01 / 05") salen de la posición en el
arreglo — no hay que tocar el componente.

Calidad medida con VMAF contra el master (≥ 95 se considera
indistinguible): AV1 crf 24 → 97.4, H.264 crf 20 → 96.4. El encode
anterior (H.264 crf 24) daba 93.9.

## Cómo activar una categoría

Todas las categorías ya existen en `data/categories.js`. Para
publicar una que hoy está oculta (Espacios, Detrás de cámara, Contenido):

1. Asegúrate de tener al menos 3 piezas reales en `data/portfolio.js` para
   esa categoría.
2. Cambia `visible: false` a `visible: true` en `data/categories.js`.

Eso es todo — el chip aparece, la URL (`?categoria=slug`) funciona y la
galería se genera sola con el patrón editorial determinista.

## Cómo configurar Instagram

Todavía no hay usuario confirmado. Cuando lo haya:

```bash
# .env.local
NEXT_PUBLIC_INSTAGRAM=usuario_sin_arroba
```

Sin esta variable, el enlace de Instagram simplemente no se muestra en
ningún lugar del sitio (nunca aparece un `#` ni un enlace roto).

## Cómo configurar la URL pública

```bash
# .env.local (desarrollo) o variables de entorno del proyecto en Vercel
NEXT_PUBLIC_SITE_URL=https://tu-dominio.com
```

Se usa para `metadataBase`, Open Graph, `sitemap.xml` y `robots.txt`. Sin
configurar, el sitio funciona igual pero cae a `http://localhost:3000` en
las URLs absolutas generadas para metadata.

## Desplegar en Vercel

1. Sube el repositorio a GitHub.
2. Importa el proyecto en [vercel.com/new](https://vercel.com/new).
3. Framework Preset: **Next.js** (autodetectado).
4. Configura la variable de entorno `NEXT_PUBLIC_SITE_URL` con la URL que
   Vercel te asigne (o tu dominio propio una vez conectado).
5. Deploy. Los siguientes pushes a `main` despliegan automáticamente.
6. Dominio propio: Project Settings → Domains → añade el dominio y sigue
   las instrucciones de DNS. Actualiza `NEXT_PUBLIC_SITE_URL` cuando el
   dominio esté activo y vuelve a desplegar.
7. Estadísticas: el sitio ya incluye `<Analytics />` de Vercel Web
   Analytics (sin cookies, por eso no hay banner de consentimiento). Solo
   empieza a registrar visitas cuando se activa en el panel del proyecto →
   **Analytics → Enable**. Si se cambia por una herramienta que use cookies,
   hay que actualizar `/privacidad` (`data/legal.js`) y pedir consentimiento.

## Material privado

`_design/uploads/` contiene PDFs, capturas y originales de trabajo y está
excluido de Git (`.gitignore`). Solo las fotografías específicamente
aprobadas se copian, ya optimizadas, a `public/images/` vía
`npm run assets`.
