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
app/                  App Router: layout, page, SEO (sitemap, robots, OG, íconos)
components/
  layout/             Nav, menú móvil, motor de motion global
  sections/            Las 11 secciones de la landing
  portfolio/           Filtro de categorías, galería editorial, lightbox
  ui/                  Piezas reutilizables (comparador antes/después)
hooks/                 Reveal, parallax, scroll lock, focus trap, media queries
data/                  Fuente única de verdad de todo el contenido y precios
lib/                   Motor de composición editorial de la galería
public/images/         Fotografías de producción (nombres normalizados)
scripts/build-assets.mjs   Genera public/images + iconos + OG desde _design/
_design/               Maqueta original de Claude Design — solo referencia
```

## Cómo añadir una fotografía nueva

1. Copia el archivo a `_design/uploads/` (o donde tengas el original).
2. Añade una entrada en `scripts/build-assets.mjs` → arreglo `PHOTOS`
   (`{ from, to }`, con `to` en minúsculas-con-guiones).
3. Corre `npm run assets` — copia y optimiza el archivo a `public/images/`.
4. Añade la pieza a `data/portfolio.js` con sus dimensiones reales
   (`width`/`height` — así el layout reserva el espacio sin saltos), su
   `categoria`, `orientacion` y el resto de metadatos.
5. Si quieres que aparezca en la edición curada de "Todo", pon
   `seleccion: true` y un `ordenTodo`.

No hay que tocar ningún componente: la galería, el lightbox y la selección
de "Todo" leen siempre de `data/portfolio.js`.

## Cómo activar una categoría

Las seis categorías completas ya existen en `data/categories.js`. Para
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

## Material privado

`_design/uploads/` contiene PDFs, capturas y originales de trabajo y está
excluido de Git (`.gitignore`). Solo las fotografías específicamente
aprobadas se copian, ya optimizadas, a `public/images/` vía
`npm run assets`.
