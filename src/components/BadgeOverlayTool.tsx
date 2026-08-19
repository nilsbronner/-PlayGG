"use client";

import { useRef, useState } from "react";

type BannerFormat = { id: string; label: string; width: number; height: number };

const BANNER_FORMATS: BannerFormat[] = [
  { id: "twitter", label: "Twitter / X", width: 1500, height: 500 },
  { id: "linkedin", label: "LinkedIn", width: 1584, height: 396 },
  { id: "facebook", label: "Facebook", width: 820, height: 312 },
];

const PROFILE_SIZE = 1000;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

// Remplit tout le cadre en recadrant l'excédent (comme CSS background-size: cover).
function drawCover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, w: number, h: number) {
  const imgRatio = img.width / img.height;
  const targetRatio = w / h;
  let sx = 0;
  let sy = 0;
  let sw = img.width;
  let sh = img.height;
  if (imgRatio > targetRatio) {
    sw = img.height * targetRatio;
    sx = (img.width - sw) / 2;
  } else {
    sh = img.width / targetRatio;
    sy = (img.height - sh) / 2;
  }
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);
}

// Place l'image en entier dans le cadre sans la déformer ni la rogner
// (comme CSS background-size: contain), centrée.
function drawContain(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  boxX: number,
  boxY: number,
  boxW: number,
  boxH: number,
) {
  const imgRatio = img.width / img.height;
  const boxRatio = boxW / boxH;
  let dw = boxW;
  let dh = boxH;
  if (imgRatio > boxRatio) {
    dh = boxW / imgRatio;
  } else {
    dw = boxH * imgRatio;
  }
  const dx = boxX + (boxW - dw) / 2;
  const dy = boxY + (boxH - dh) / 2;
  ctx.drawImage(img, dx, dy, dw, dh);
}

function downloadCanvas(canvas: HTMLCanvasElement, filename: string) {
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }, "image/png");
}

const fileInputClass =
  "mt-4 block text-sm text-ink/70 file:mr-4 file:rounded-full file:border-0 file:bg-ink file:px-4 file:py-2 file:text-sm file:font-semibold file:text-cream file:cursor-pointer cursor-pointer";

function ProfileOverlayTool() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setError(null);
    try {
      const [photo, overlay] = await Promise.all([
        loadImage(URL.createObjectURL(file)),
        loadImage("/overlays/badge-profile.png"),
      ]);
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;
      canvas.width = PROFILE_SIZE;
      canvas.height = PROFILE_SIZE;
      drawCover(ctx, photo, PROFILE_SIZE, PROFILE_SIZE);
      const margin = PROFILE_SIZE * 0.05;
      drawContain(ctx, overlay, margin, margin, PROFILE_SIZE - margin * 2, PROFILE_SIZE - margin * 2);
      setReady(true);
    } catch {
      setError("Impossible de charger cette image, réessayez.");
    }
  }

  return (
    <div className="rounded-2xl border border-ink/10 bg-surface p-6 text-left">
      <h3 className="font-display text-sm uppercase text-ink">Photo de profil</h3>
      <p className="mt-2 text-sm text-ink/60">
        Ajoutez le badge #PlayGG directement sur votre photo de profil actuelle.
      </p>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
        className={fileInputClass}
      />
      {error && <p className="field-error mt-2">{error}</p>}
      <canvas ref={canvasRef} className={`mt-4 w-full max-w-xs rounded-xl ${ready ? "block" : "hidden"}`} />
      {ready && (
        <button
          type="button"
          onClick={() => canvasRef.current && downloadCanvas(canvasRef.current, "playgg-photo-de-profil.png")}
          className="btn-primary mt-4"
        >
          Télécharger
        </button>
      )}
    </div>
  );
}

function BannerOverlayTool() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<File | null>(null);
  const [format, setFormat] = useState<BannerFormat>(BANNER_FORMATS[0]!);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function render(file: File, fmt: BannerFormat) {
    setError(null);
    try {
      const [photo, overlay] = await Promise.all([
        loadImage(URL.createObjectURL(file)),
        loadImage("/overlays/badge-banner.png"),
      ]);
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;
      canvas.width = fmt.width;
      canvas.height = fmt.height;
      drawCover(ctx, photo, fmt.width, fmt.height);
      const overlayW = fmt.width * 0.42;
      const overlayH = overlayW * (overlay.height / overlay.width);
      const margin = fmt.width * 0.03;
      ctx.drawImage(
        overlay,
        fmt.width - overlayW - margin,
        fmt.height - overlayH - margin,
        overlayW,
        overlayH,
      );
      setReady(true);
    } catch {
      setError("Impossible de charger cette image, réessayez.");
    }
  }

  function handleFile(file: File) {
    fileRef.current = file;
    render(file, format);
  }

  function handleFormatChange(fmt: BannerFormat) {
    setFormat(fmt);
    if (fileRef.current) render(fileRef.current, fmt);
  }

  return (
    <div className="rounded-2xl border border-ink/10 bg-surface p-6 text-left">
      <h3 className="font-display text-sm uppercase text-ink">Bannière</h3>
      <p className="mt-2 text-sm text-ink/60">
        Ajoutez le badge #PlayGG à votre bannière de réseau social actuelle.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {BANNER_FORMATS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => handleFormatChange(f)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              format.id === f.id ? "bg-ink text-cream" : "border border-ink/15 text-ink/60 hover:border-ink/30"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
        className={fileInputClass}
      />
      {error && <p className="field-error mt-2">{error}</p>}
      <canvas ref={canvasRef} className={`mt-4 w-full rounded-xl ${ready ? "block" : "hidden"}`} />
      {ready && (
        <button
          type="button"
          onClick={() =>
            canvasRef.current && downloadCanvas(canvasRef.current, `playgg-banniere-${format.id}.png`)
          }
          className="btn-primary mt-4"
        >
          Télécharger
        </button>
      )}
    </div>
  );
}

export function BadgeOverlayTool() {
  return (
    <div className="mt-10 grid gap-5 sm:grid-cols-2">
      <ProfileOverlayTool />
      <BannerOverlayTool />
    </div>
  );
}
