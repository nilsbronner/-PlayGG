import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SignatureCounter } from "@/components/SignatureCounter";
import { SignatoryWall } from "@/components/SignatoryWall";
import {
  getPublicSignatories,
  getSignatureCount,
  type PublicSignatory,
} from "@/lib/signatures";

export const metadata: Metadata = {
  title: "Signataires — #PlayGG",
};

export const dynamic = "force-dynamic";

const WALL_LIMIT = 90;

async function loadWallData(): Promise<{
  count: number;
  signatories: PublicSignatory[];
} | null> {
  try {
    const [count, signatories] = await Promise.all([
      getSignatureCount(),
      getPublicSignatories({ filter: "all", limit: WALL_LIMIT }),
    ]);
    return { count, signatories };
  } catch (error) {
    console.error("loadWallData failed:", error);
    return null;
  }
}

export default async function SignatairesPage() {
  const wallData = await loadWallData();

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <p className="mb-3 font-sans text-xs font-bold uppercase tracking-[0.14em] text-violet">
            Preuve sociale
          </p>
          <h1 className="font-display text-3xl uppercase leading-tight sm:text-4xl">
            Les signataires
          </h1>

          {wallData ? (
            <>
              <p className="mt-4 max-w-xl text-ink/65">
                <span className="font-sans font-bold text-ink">
                  <SignatureCounter initialCount={wallData.count} />
                </span>{" "}
                personnes et structures se sont déjà engagées pour un esport
                responsable. Certain·e·s signataires choisissent de ne pas
                apparaître ici : le mur n&apos;affiche que celles et ceux qui
                ont donné leur accord explicite.
              </p>

              <div className="mt-10">
                <SignatoryWall initialSignatories={wallData.signatories} limit={WALL_LIMIT} />
              </div>
            </>
          ) : (
            <p className="mt-8 rounded-xl border border-dashed border-ink/15 px-5 py-10 text-center text-ink/50">
              Le mur des signataires n&apos;est pas encore disponible. Revenez
              bientôt.
            </p>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
