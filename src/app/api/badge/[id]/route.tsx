import { ImageResponse } from "next/og";
import { createAdminClient } from "@/lib/supabase-admin";
import { formatSignatoryName } from "@/lib/name";

export const runtime = "edge";

// URLs stables gstatic (résolues une fois pour toutes, cf. README).
const ARCADE_TTF_URL = "https://fonts.gstatic.com/s/silkscreen/v6/m8JUjfVPf62XiF7kO-i9aAhATms.ttf";
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
    .select("prenom, nom, pseudo, organisation, confirmed_at, revoked_at")
    .eq("id", id)
    .maybeSingle();

  if (!signature || !signature.confirmed_at || signature.revoked_at) {
    return new Response("Badge introuvable", { status: 404 });
  }

  const displayName = formatSignatoryName(signature);

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
          justifyContent: "space-between",
          background: "#14141C",
          padding: "56px 64px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <span style={{ fontFamily: "Silkscreen", fontSize: 20, color: "#5C6BFF" }}>#</span>
          <span style={{ fontFamily: "Silkscreen", fontSize: 20, color: "#A879FF" }}>
            PlayGG
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              fontFamily: "Plus Jakarta Sans",
              fontSize: 15,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: "#A879FF",
              marginBottom: 14,
            }}
          >
            Signataire de la Charte
          </span>
          <span
            style={{
              fontFamily: "Silkscreen",
              fontSize: 26,
              lineHeight: 1.5,
              color: "#F5F6FB",
              maxWidth: 620,
            }}
          >
            {displayName}
          </span>
          {signature.organisation && (
            <span
              style={{
                fontFamily: "Plus Jakarta Sans",
                fontSize: 18,
                color: "rgba(245,246,251,0.6)",
                marginTop: 14,
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
            color: "rgba(245,246,251,0.45)",
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
        { name: "Silkscreen", data: arcade, weight: 700, style: "normal" },
        { name: "Plus Jakarta Sans", data: jakarta, weight: 700, style: "normal" },
      ],
      headers: {
        "Cache-Control": "public, max-age=3600, s-maxage=86400",
      },
    },
  );
}
