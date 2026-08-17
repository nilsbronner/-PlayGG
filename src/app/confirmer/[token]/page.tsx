import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { createAdminClient } from "@/lib/supabase-admin";

export const metadata: Metadata = {
  title: "Confirmation de signature — #PlayGG",
};

export const dynamic = "force-dynamic";

async function confirmSignature(token: string) {
  let supabase: ReturnType<typeof createAdminClient>;
  try {
    supabase = createAdminClient();
  } catch {
    return { status: "unavailable" as const };
  }

  const { data: tokenRow } = await supabase
    .from("confirmation_tokens")
    .select("token, signature_id, expires_at, used_at")
    .eq("token", token)
    .maybeSingle();

  if (!tokenRow) {
    return { status: "invalid" as const };
  }

  const { data: signature } = await supabase
    .from("signatures")
    .select("id, name, confirmed_at, revoked_at")
    .eq("id", tokenRow.signature_id)
    .maybeSingle();

  if (!signature || signature.revoked_at) {
    return { status: "invalid" as const };
  }

  // Déjà confirmée (ex. clic répété sur le lien) : on affiche simplement le succès.
  if (signature.confirmed_at) {
    return { status: "success" as const, id: signature.id, name: signature.name };
  }

  if (new Date(tokenRow.expires_at).getTime() < Date.now()) {
    return { status: "expired" as const };
  }

  const { error: updateError } = await supabase
    .from("signatures")
    .update({ confirmed_at: new Date().toISOString() })
    .eq("id", signature.id);

  if (updateError) {
    return { status: "invalid" as const };
  }

  await supabase
    .from("confirmation_tokens")
    .update({ used_at: new Date().toISOString() })
    .eq("token", token);

  return { status: "success" as const, id: signature.id, name: signature.name };
}

export default async function ConfirmTokenPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const result = await confirmSignature(token);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-lg px-6 py-24 text-center">
          {result.status === "success" && (
            <>
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue/10">
                <span className="font-display text-3xl text-blue">✓</span>
              </div>
              <h1 className="font-display text-lg uppercase leading-relaxed sm:text-2xl">
                Signature confirmée
              </h1>
              <p className="mt-4 text-ink/65">
                Merci {result.name}, votre engagement pour un esport
                responsable est désormais officiel.
              </p>

              <div className="mt-10 rounded-2xl border border-ink/10 bg-surface p-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/api/badge/${result.id}`}
                  alt="Badge de signature #PlayGG"
                  width={600}
                  height={315}
                  className="mx-auto w-full max-w-sm rounded-lg"
                />
                <a
                  href={`/api/badge/${result.id}`}
                  download={`playgg-badge-${result.id}.png`}
                  className="btn-primary mt-6 w-full sm:w-auto"
                >
                  Télécharger mon badge
                </a>
              </div>
            </>
          )}

          {result.status === "expired" && (
            <>
              <h1 className="font-display text-lg uppercase leading-relaxed sm:text-2xl">
                Lien expiré
              </h1>
              <p className="mt-4 text-ink/65">
                Ce lien de confirmation n&apos;est plus valide (48h max). Vous
                pouvez signer à nouveau pour recevoir un nouveau lien.
              </p>
              <Link href="/signer" className="btn-primary mt-8">
                Signer à nouveau
              </Link>
            </>
          )}

          {result.status === "invalid" && (
            <>
              <h1 className="font-display text-lg uppercase leading-relaxed sm:text-2xl">
                Lien invalide
              </h1>
              <p className="mt-4 text-ink/65">
                Ce lien de confirmation est introuvable ou a déjà été utilisé.
              </p>
              <Link href="/signer" className="btn-primary mt-8">
                Signer la Charte
              </Link>
            </>
          )}

          {result.status === "unavailable" && (
            <>
              <h1 className="font-display text-lg uppercase leading-relaxed sm:text-2xl">
                Service indisponible
              </h1>
              <p className="mt-4 text-ink/65">
                La confirmation des signatures n&apos;est pas encore
                configurée. Réessayez plus tard.
              </p>
            </>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
