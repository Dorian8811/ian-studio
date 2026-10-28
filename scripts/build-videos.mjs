/**
 * Ian Studio — transcodificación de reels para la web.
 *
 * Toma los masters de cámara (`_design/uploads/drive/`, 18–27 Mbps, algunos
 * en 4K) y escribe en `public/videos/` dos versiones de cada reel:
 *
 *   <id>.av1.mp4   AV1 10 bits — fuente principal. A igual peso conserva
 *                  mucho más detalle que H.264 y no genera banding en
 *                  degradados (humo, luces de escenario, fondos oscuros).
 *   <id>.mp4       H.264 High — respaldo para navegadores/dispositivos sin
 *                  decodificador AV1 (buena parte de los iPhone).
 *
 * Y el poster en `public/images/<id>-poster.jpg` (+ `.webp` para el <video>), sacado del master a
 * resolución completa (no del archivo ya comprimido).
 *
 * Los masters 4K se reducen a 1080×1920 con lanczos: el reel nunca se
 * muestra a más de ~900 px reales de ancho, así que 1080 conserva todo el
 * detalle visible y el supermuestreo del 4K lo hace más nítido.
 *
 *   node scripts/build-videos.mjs            # todos
 *   node scripts/build-videos.mjs reel-04    # solo uno
 *
 * Requiere ffmpeg con libsvtav1 y libx264 en el PATH. Es idempotente.
 */

import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, stat, unlink } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(fileURLToPath(new URL("../", import.meta.url)));
const MASTERS = path.join(ROOT, "_design", "uploads", "drive");
const OUT_VIDEO = path.join(ROOT, "public", "videos");
const OUT_IMG = path.join(ROOT, "public", "images");

/** Reels: master -> id de producción, y segundo exacto del poster. */
const REELS = [
  { id: "reel-01", from: "reel-1.mp4", poster: 3 },
  { id: "reel-02", from: "reel-2.mp4", poster: 3 },
  { id: "reel-03", from: "exp-antes-del-corte.mp4", poster: 2 },
  { id: "reel-04", from: "v1-ian-terminado-2.mp4", poster: 21 },
  { id: "reel-05", from: "tip-cortes-correg.mp4", poster: 1.6 },
];

const SCALE = "scale=1080:1920:flags=lanczos+accurate_rnd+full_chroma_int";

/** Comunes a ambas salidas: solo vídeo + audio, sin metadata de cámara. */
const COMMON = [
  "-map", "0:v:0", "-map", "0:a:0?",
  "-map_metadata", "-1", "-map_chapters", "-1",
  "-vf", SCALE,
  "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709",
  "-c:a", "aac", "-b:a", "128k", "-ac", "2", "-ar", "48000",
  "-movflags", "+faststart",
];

const H264 = [
  "-c:v", "libx264", "-preset", "slow", "-tune", "film",
  "-crf", "20", "-maxrate", "6M", "-bufsize", "12M",
  "-profile:v", "high", "-level", "4.1", "-pix_fmt", "yuv420p",
  "-tag:v", "avc1",
];

// CRF elegidos midiendo VMAF contra el master (reel-02): H.264 crf 20 → 96.4,
// AV1 crf 24 → 97.4 con menos de la mitad del peso. El encode anterior
// (H.264 crf 24) daba 93.9. Por encima de ~95 la diferencia ya no se ve.
const AV1 = [
  "-c:v", "libsvtav1", "-preset", "6", "-crf", "24", "-g", "240",
  "-svtav1-params", "tune=0:enable-overlays=1:scd=1",
  "-pix_fmt", "yuv420p10le",
  "-tag:v", "av01",
];

/** Poster del <video>: solo se ve hasta que arranca el reel. */
const POSTER_WEBP = { quality: 80, effort: 6 };

const log = (...a) => console.log("  ", ...a);

function ffmpeg(args) {
  return new Promise((resolve, reject) => {
    const p = spawn("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", ...args], { stdio: "inherit" });
    p.on("error", reject);
    p.on("close", (code) => (code === 0 ? resolve() : reject(new Error(`ffmpeg salió con código ${code}`))));
  });
}

const mb = async (f) => ((await stat(f)).size / 1048576).toFixed(1) + " MB";

async function buildReel({ id, from, poster }) {
  const src = path.join(MASTERS, from);
  if (!existsSync(src)) {
    log(`! falta ${from} — se omite ${id}`);
    return;
  }

  const h264 = path.join(OUT_VIDEO, `${id}.mp4`);
  const av1 = path.join(OUT_VIDEO, `${id}.av1.mp4`);

  await ffmpeg(["-i", src, ...COMMON, ...H264, h264]);
  log(`${id}.mp4      H.264  ${await mb(h264)}`);

  await ffmpeg(["-i", src, ...COMMON, ...AV1, av1]);
  log(`${id}.av1.mp4  AV1    ${await mb(av1)}`);

  // Poster: PNG sin pérdida desde el master, luego JPEG 4:4:4 con sharp.
  // El JPEG es la fuente que next/image convierte (tarjetas de servicios y
  // especialidades); el atributo `poster` del <video> no pasa por next/image,
  // así que lleva su propio WebP ya optimizado.
  const tmp = path.join(OUT_IMG, `.${id}-poster.png`);
  await ffmpeg(["-ss", String(poster), "-i", src, "-frames:v", "1", "-vf", SCALE, tmp]);
  await sharp(tmp)
    .jpeg({ quality: 90, progressive: true, mozjpeg: true, chromaSubsampling: "4:4:4" })
    .toFile(path.join(OUT_IMG, `${id}-poster.jpg`));
  await sharp(tmp).webp(POSTER_WEBP).toFile(path.join(OUT_IMG, `${id}-poster.webp`));
  await unlink(tmp);
  log(`${id}-poster.jpg + .webp  (t=${poster}s)`);
}

async function main() {
  await mkdir(OUT_VIDEO, { recursive: true });
  const only = process.argv[2];
  const list = only ? REELS.filter((r) => r.id === only) : REELS;
  if (list.length === 0) throw new Error(`No existe el reel "${only}"`);

  for (const reel of list) {
    console.log(`\n${reel.id} ← ${reel.from}`);
    await buildReel(reel);
  }
  console.log("\nListo.\n");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
