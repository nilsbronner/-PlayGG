import { NextResponse } from "next/server";
import { getSignatureCount } from "@/lib/signatures";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const count = await getSignatureCount();
    return NextResponse.json(
      { count },
      { headers: { "Cache-Control": "public, max-age=0, s-maxage=5, stale-while-revalidate=15" } },
    );
  } catch {
    return NextResponse.json({ error: "Impossible de charger le compteur." }, { status: 500 });
  }
}
