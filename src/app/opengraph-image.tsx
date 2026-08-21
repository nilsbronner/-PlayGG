import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const ARCADE_TTF_URL = "https://fonts.gstatic.com/s/silkscreen/v6/m8JUjfVPf62XiF7kO-i9aAhATms.ttf";
const JAKARTA_BOLD_TTF_URL =
  "https://fonts.gstatic.com/s/plusjakartasans/v12/LDIbaomQNQcsA88c7O9yZ4KMCoOg4IA6-91aHEjcWuA_TknNSg.ttf";

async function loadFont(url: string) {
  const res = await fetch(url);
  return res.arrayBuffer();
}

export default async function Image() {
  const [arcade, jakarta] = await Promise.all([
    loadFont(ARCADE_TTF_URL),
    loadFont(JAKARTA_BOLD_TTF_URL),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#FFFFFF",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <span style={{ fontFamily: "Silkscreen", fontSize: 60, color: "#2F3EE0" }}>#</span>
          <span style={{ fontFamily: "Silkscreen", fontSize: 60, color: "#8B4FF0" }}>PlayGG</span>
        </div>
        <span
          style={{
            fontFamily: "Plus Jakarta Sans",
            fontSize: 24,
            color: "#14141C",
            marginTop: 32,
            maxWidth: 460,
            textAlign: "center",
          }}
        >
          Signez la Charte pour un esport mixte et responsable
        </span>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Silkscreen", data: arcade, weight: 700, style: "normal" },
        { name: "Plus Jakarta Sans", data: jakarta, weight: 700, style: "normal" },
      ],
    },
  );
}
