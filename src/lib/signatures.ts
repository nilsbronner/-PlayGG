import "server-only";
import { createAdminClient } from "@/lib/supabase-admin";
import type { Quality } from "@/lib/quality";

export type PublicSignatory = {
  id: string;
  prenom: string | null;
  nom: string | null;
  pseudo: string | null;
  quality: Quality | null;
  organisation: string | null;
  confirmed_at: string;
};

export type SignatoryFilter = "all" | Quality;

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
  const columns = "id, prenom, nom, pseudo, quality, organisation, confirmed_at";

  const { data, error } =
    filter === "all"
      ? await supabase
          .from("signatures")
          .select(columns)
          .not("confirmed_at", "is", null)
          .is("revoked_at", null)
          .eq("consent_public_display", true)
          .order("confirmed_at", { ascending: false })
          .limit(limit)
      : await supabase
          .from("signatures")
          .select(columns)
          .not("confirmed_at", "is", null)
          .is("revoked_at", null)
          .eq("consent_public_display", true)
          .eq("quality", filter)
          .order("confirmed_at", { ascending: false })
          .limit(limit);

  if (error) throw error;
  return (data ?? []) as PublicSignatory[];
}
