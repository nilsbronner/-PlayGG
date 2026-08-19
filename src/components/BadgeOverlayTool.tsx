"use client";

import { useRef, useState } from "react";

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

// Le fichier de badge fait autorité sur le cadrage : le canevas de sortie
// reprend exactement ses proportions natives, et il est posé en plein
// cadre (0,0,W,H) sans le redimensionner ni le repositionner — la
// composition (taille, angle, marges) est déjà celle voulue dans le fichier.
function OverlayTool({
  title,
  description,
  overlaySrc,
  filename,
  previewClassName,
}: {
  title: string;
  description: string;
  overlaySrc: string;
  filename: string;
  previewClassName: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setError(null);
    try {
      const [photo, overlay] = await Promise.all([
        loadImage(URL.createObjectURL(file)),
        loadImage(overlaySrc),
      ]);
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;
      canvas.width = overlay.width;
      canvas.height = overlay.height;
      drawCover(ctx, photo, canvas.width, canvas.height);
      ctx.drawImage(overlay, 0, 0, canvas.width, canvas.height);
      setReady(true);
    } catch {
      setError("Impossible de charger cette image, réessayez.");
    }
  }

  return (
    <div className="rounded-2xl border border-ink/10 bg-surface p-6 text-left">
      <h3 className="font-display text-sm uppercase text-ink">{title}</h3>
      <p className="mt-2 text-sm text-ink/60">{description}</p>
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
      <canvas ref={canvasRef} className={`mt-4 rounded-xl ${ready ? `block ${previewClassName}` : "hidden"}`} />
      {ready && (
        <button
          type="button"
          onClick={() => canvasRef.current && downloadCanvas(canvasRef.current, filename)}
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
      <OverlayTool
        title="Photo de profil"
        description="Ajoutez le badge #PlayGG directement sur votre photo de profil actuelle."
        overlaySrc="/overlays/badge-profile.png"
        filename="playgg-photo-de-profil.png"
        previewClassName="w-full max-w-xs"
      />
      <OverlayTool
        title="Bannière"
        description="Ajoutez le badge #PlayGG à votre bannière de réseau social actuelle."
        overlaySrc="/overlays/badge-banner.png"
        filename="playgg-banniere.png"
        previewClassName="w-full"
      />
    </div>
  );
}
