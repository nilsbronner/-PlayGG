import { NextResponse } from "next/server";
import { getPublicSignatories, type SignatoryFilter } from "@/lib/signatures";

export const dynamic = "force-dynamic";

const VALID_FILTERS: SignatoryFilter[] = ["all", "individual", "organisation"];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const filterParam = searchParams.get("filter") ?? "all";
  const filter = VALID_FILTERS.includes(filterParam as SignatoryFilter)
    ? (filterParam as SignatoryFilter)
    : "all";
  const limitParam = Number(searchParams.get("limit") ?? 60);
  const limit = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 1), 120) : 60;

  try {
    const signatories = await getPublicSignatories({ filter, limit });
    return NextResponse.json(
      { signatories },
      { headers: { "Cache-Control": "public, max-age=0, s-maxage=5, stale-while-revalidate=15" } },
    );
  } catch (error) {
    console.error("GET /api/signatures/wall failed:", error);
    return NextResponse.json({ error: "Impossible de charger les signataires." }, { status: 500 });
  }
}
