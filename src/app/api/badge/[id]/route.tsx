import { ImageResponse } from "next/og";
import { createAdminClient } from "@/lib/supabase-admin";

export const runtime = "edge";

// URLs stables gstatic (résolues une fois pour toutes, cf. README).
const ANTON_TTF_URL = "https://fonts.gstatic.com/s/anton/v27/1Ptgg87LROyAm0K0.ttf";
const JAKARTA_BOLD_TTF_URL =
  "https://fonts.gstatic.com/s/plusjakartasans/v12/LDIbaomQNQcsA88c7O9yZ4KMCoOg4IA6-91aHEjcWuA_TknNSg.ttf";

async function loadFont(url: string) {
  const res = await fetch(url);
  return res.arrayBuffer();
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  let supabase: ReturnType<typeof createAdminClient>;
  try {
    supabase = createAdminClient();
  } catch {
    return new Response("Badge indisponible", { status: 404 });
  }

  const { data: signature } = await supabase
    .from("signatures")
    .select("name, organisation, confirmed_at, revoked_at")
    .eq("id", id)
    .maybeSingle();

  if (!signature || !signature.confirmed_at || signature.revoked_at) {
    return new Response("Badge introuvable", { status: 404 });
  }

  const [anton, jakarta] = await Promise.all([
    loadFont(ANTON_TTF_URL),
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
          justifyContent: "space-between",
          background: "#161616",
          padding: "56px 64px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <span style={{ fontFamily: "Anton", fontSize: 34, color: "#FF5011" }}>#</span>
          <span style={{ fontFamily: "Anton", fontSize: 34, color: "#F8F0EA" }}>PlayGG</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              fontFamily: "Plus Jakarta Sans",
              fontSize: 15,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: "#7F5CF9",
              marginBottom: 14,
            }}
          >
            Signataire de la Charte
          </span>
          <span
            style={{
              fontFamily: "Anton",
              fontSize: 44,
              lineHeight: 1.05,
              color: "#F8F0EA",
              maxWidth: 560,
            }}
          >
            {signature.name}
          </span>
          {signature.organisation && (
            <span
              style={{
                fontFamily: "Plus Jakarta Sans",
                fontSize: 18,
                color: "rgba(248,240,234,0.6)",
                marginTop: 10,
              }}
            >
              {signature.organisation}
            </span>
          )}
        </div>

        <div
          style={{
            display: "flex",
            fontFamily: "Plus Jakarta Sans",
            fontSize: 14,
            color: "rgba(248,240,234,0.45)",
          }}
        >
          Pour un esport mixte et responsable
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Anton", data: anton, weight: 400, style: "normal" },
        { name: "Plus Jakarta Sans", data: jakarta, weight: 700, style: "normal" },
      ],
      headers: {
        "Cache-Control": "public, max-age=3600, s-maxage=86400",
      },
    },
  );
}
