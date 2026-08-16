import "server-only";
import { createAdminClient } from "@/lib/supabase-admin";

export type PublicSignatory = {
  id: string;
  name: string;
  organisation: string | null;
  profile_url: string | null;
  confirmed_at: string;
};

export type SignatoryFilter = "all" | "individual" | "organisation";

export async function getSignatureCount(): Promise<number> {
  const supabase = createAdminClient();
  const { count, error } = await supabase
    .from("signatures")
    .select("id", { count: "exact", head: true })
    .not("confirmed_at", "is", null)
    .is("revoked_at", null);

  if (error) throw error;
  return count ?? 0;
}

export async function getPublicSignatories(params: {
  filter?: SignatoryFilter;
  limit?: number;
}): Promise<PublicSignatory[]> {
  const { filter = "all", limit = 60 } = params;
  const supabase = createAdminClient();
  const columns = "id, name, organisation, profile_url, confirmed_at";

  const { data, error } =
    filter === "individual"
      ? await supabase
          .from("signatures")
          .select(columns)
          .not("confirmed_at", "is", null)
          .is("revoked_at", null)
          .eq("consent_public_display", true)
          .is("organisation", null)
          .order("confirmed_at", { ascending: false })
          .limit(limit)
      : filter === "organisation"
        ? await supabase
            .from("signatures")
            .select(columns)
            .not("confirmed_at", "is", null)
            .is("revoked_at", null)
            .eq("consent_public_display", true)
            .not("organisation", "is", null)
            .order("confirmed_at", { ascending: false })
            .limit(limit)
        : await supabase
            .from("signatures")
            .select(columns)
            .not("confirmed_at", "is", null)
            .is("revoked_at", null)
            .eq("consent_public_display", true)
            .order("confirmed_at", { ascending: false })
            .limit(limit);

  if (error) throw error;
  return (data ?? []) as PublicSignatory[];
}
