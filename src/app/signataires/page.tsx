import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SignatureCounter } from "@/components/SignatureCounter";
import { SignatoryWall } from "@/components/SignatoryWall";
import { getPublicSignatories, getSignatureCount } from "@/lib/signatures";

export const metadata: Metadata = {
  title: "Signataires — #PlayGG",
};

export const dynamic = "force-dynamic";

const WALL_LIMIT = 90;

export default async function SignatairesPage() {
  const [count, signatories] = await Promise.all([
    getSignatureCount(),
    getPublicSignatories({ filter: "all", limit: WALL_LIMIT }),
  ]);

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
          <p className="mt-4 max-w-xl text-ink/65">
            <span className="font-sans font-bold text-ink">
              <SignatureCounter initialCount={count} />
            </span>{" "}
            personnes et structures se sont déjà engagées pour un esport
            responsable. Certain·e·s signataires choisissent de ne pas
            apparaître ici : le mur n&apos;affiche que celles et ceux qui ont
            donné leur accord explicite.
          </p>

          <div className="mt-10">
            <SignatoryWall initialSignatories={signatories} limit={WALL_LIMIT} />
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
