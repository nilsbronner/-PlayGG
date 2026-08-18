import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { createAdminClient } from "@/lib/supabase-admin";

export const metadata: Metadata = {
  title: "C'est signé ! — #PlayGG",
};

export const dynamic = "force-dynamic";

async function loadSignature(id: string) {
  let supabase: ReturnType<typeof createAdminClient>;
  try {
    supabase = createAdminClient();
  } catch {
    return null;
  }

  const { data } = await supabase
    .from("signatures")
    .select("id, name")
    .eq("id", id)
    .is("revoked_at", null)
    .maybeSingle();

  return data;
}

export default async function ConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  const signature = id ? await loadSignature(id) : null;

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-lg px-6 py-24 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-violet/10 text-3xl">
            🎮
          </div>
          <h1 className="font-display text-lg uppercase leading-relaxed sm:text-2xl">
            {signature ? <>Bienvenue dans #PlayGG&nbsp;!</> : <>C&apos;est signé&nbsp;!</>}
          </h1>
          <p className="mt-4 text-ink/65">
            {signature
              ? `Récupérez votre badge, ${signature.name}.`
              : "Votre signature a bien été enregistrée."}
          </p>

          {signature && (
            <div className="mt-10 rounded-2xl border border-ink/10 bg-surface p-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/api/badge/${signature.id}`}
                alt="Badge de signature #PlayGG"
                width={600}
                height={315}
                className="mx-auto w-full max-w-sm rounded-lg"
              />
              <a
                href={`/api/badge/${signature.id}`}
                download={`playgg-badge-${signature.id}.png`}
                className="btn-primary mt-6 w-full sm:w-auto"
              >
                Télécharger mon badge
              </a>
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
