import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SignatureCounter } from "@/components/SignatureCounter";
import { SignatoryWall } from "@/components/SignatoryWall";
import {
  CHARTER_INTRO_PARAGRAPHS,
  CHARTER_PRINCIPLES,
  CHARTER_TITLE,
} from "@/lib/charter";
import {
  getPublicSignatories,
  getSignatureCount,
  type PublicSignatory,
} from "@/lib/signatures";

// Rendu à la demande : la page appelle Supabase pour le compteur et
// l'aperçu des signataires, elle ne doit donc pas être pré-rendue au build
// (qui n'a pas forcément les identifiants Supabase, ni la garantie que la
// base soit joignable).
export const dynamic = "force-dynamic";

const PREVIEW_LIMIT = 6;

async function loadHomeData(): Promise<{
  count: number;
  recentSignatories: PublicSignatory[];
} | null> {
  // Tant que Supabase n'est pas configuré (ou momentanément indisponible),
  // on masque simplement le compteur et l'aperçu du mur plutôt que de
  // planter toute la page — la charte et le CTA restent utilisables.
  try {
    const [count, recentSignatories] = await Promise.all([
      getSignatureCount(),
      getPublicSignatories({ filter: "all", limit: PREVIEW_LIMIT }),
    ]);
    return { count, recentSignatories };
  } catch (error) {
    console.error("loadHomeData failed:", error);
    return null;
  }
}

export default async function HomePage() {
  const homeData = await loadHomeData();

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        <section className="mx-auto max-w-3xl px-6 pb-6 pt-16 sm:pt-24">
          <p className="mb-4 font-sans text-xs font-bold uppercase tracking-[0.14em] text-violet">
            La Charte #PlayGG
          </p>
          <h1 className="font-display text-xl uppercase leading-relaxed text-ink sm:text-3xl">
            {CHARTER_TITLE}
          </h1>

          <div className="mt-6 max-w-2xl space-y-4 text-lg leading-relaxed text-ink/70">
            {CHARTER_INTRO_PARAGRAPHS.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-6">
            <Link href="/signer" className="btn-primary">
              Signer la Charte
            </Link>
            {homeData && (
              <p className="text-sm text-ink/55">
                <span className="font-sans text-base font-bold text-ink">
                  <SignatureCounter initialCount={homeData.count} />
                </span>{" "}
                signataires déjà engagé·e·s
              </p>
            )}
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-6 py-14">
          <div className="space-y-10">
            {CHARTER_PRINCIPLES.map((principle, index) => (
              <div key={principle.slug} className="border-t border-ink/10 pt-8 first:border-t-0 first:pt-0">
                <div className="flex items-baseline gap-4">
                  <span className="font-display text-xl text-blue">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h2 className="font-display text-base uppercase sm:text-lg">
                    {principle.title}
                  </h2>
                </div>
                <div className="mt-3 space-y-3 pl-0 text-ink/70 sm:pl-12">
                  {principle.paragraphs.map((paragraph) => (
                    <p key={paragraph} className="leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {homeData && (
          <section className="mx-auto max-w-3xl px-6 py-14">
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="font-display text-base uppercase sm:text-lg">
                Derniers signataires
              </h2>
              <Link href="/signataires" className="text-sm font-bold text-violet hover:underline">
                Voir tout le mur →
              </Link>
            </div>
            <div className="mt-6">
              <SignatoryWall
                initialSignatories={homeData.recentSignatories}
                limit={PREVIEW_LIMIT}
                compact
              />
            </div>
          </section>
        )}

        <section className="mx-auto max-w-3xl px-6 pb-24">
          <div className="rounded-2xl bg-ink px-8 py-10 text-center sm:px-16">
            <h2 className="font-display text-base uppercase text-cream sm:text-xl">
              Prêt·e à vous engager&nbsp;?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-cream/70">
              La signature prend deux minutes. Vous recevrez un badge à
              afficher sur votre profil ou votre site.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
              <Link href="/signer" className="btn-primary">
                Signer la Charte
              </Link>
              <Link
                href="/faq"
                className="text-sm font-bold text-cream/70 underline hover:text-cream"
              >
                Ce que ça engage, en détail
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
