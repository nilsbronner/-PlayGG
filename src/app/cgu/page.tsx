import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Conditions générales d'utilisation — #PlayGG",
};

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-2xl px-6 py-16">
          <h1 className="font-display text-lg uppercase leading-relaxed sm:text-2xl">
            Conditions générales d&apos;utilisation
          </h1>
          <p className="mt-3 text-sm text-ink/50">
            Brouillon à faire relire avant publication.
          </p>

          <div className="mt-10 space-y-8 text-ink/75">
            <section>
              <h2 className="font-display text-xl uppercase text-ink">1. Objet</h2>
              <p className="mt-2 leading-relaxed">
                Ce site permet à toute personne, structure ou marque de
                signer publiquement la Charte #PlayGG et d&apos;obtenir un
                badge attestant de cet engagement.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl uppercase text-ink">
                2. Conditions de signature
              </h2>
              <p className="mt-2 leading-relaxed">
                La signature n&apos;est effective qu&apos;après confirmation
                de l&apos;adresse email via le lien envoyé (double opt-in).
                Toute signature effectuée avec des informations manifestement
                fausses ou dans un but abusif pourra être retirée.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl uppercase text-ink">
                3. Badge et vérification
              </h2>
              <p className="mt-2 leading-relaxed">
                Le badge généré est associé à une signature confirmée et
                individuelle. Il ne doit pas être utilisé de façon à laisser
                croire à un engagement qui n&apos;a pas été réellement pris.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl uppercase text-ink">
                4. Modération
              </h2>
              <p className="mt-2 leading-relaxed">
                Le responsable du site se réserve le droit de retirer une
                signature en cas d&apos;abus manifeste du formulaire.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl uppercase text-ink">
                5. Contact
              </h2>
              <p className="mt-2 leading-relaxed">[Contact à compléter.]</p>
            </section>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
