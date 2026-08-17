import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Politique de confidentialité — #PlayGG",
};

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-2xl px-6 py-16">
          <h1 className="font-display text-lg uppercase leading-relaxed sm:text-2xl">
            Politique de confidentialité
          </h1>
          <p className="mt-3 text-sm text-ink/50">
            Dernière mise à jour : à compléter avant publication. Ce
            document est un brouillon à faire relire par le responsable de
            traitement / DPO avant mise en ligne.
          </p>

          <div className="prose-sm mt-10 space-y-8 text-ink/75">
            <section>
              <h2 className="font-display text-xl uppercase text-ink">
                1. Responsable de traitement
              </h2>
              <p className="mt-2 leading-relaxed">
                [À compléter : identité et contact du responsable de
                traitement pour ce site, distinct ou non de Skillcamp — cf.
                question ouverte du brief de cadrage.]
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl uppercase text-ink">
                2. Données collectées
              </h2>
              <p className="mt-2 leading-relaxed">
                Lorsque vous signez la Charte #PlayGG, nous collectons votre
                nom ou pseudonyme, votre adresse email, et facultativement le
                nom de votre structure et un lien de profil ou de site. Ces
                données sont strictement limitées à ce qui est nécessaire à
                la signature et à sa vérification.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl uppercase text-ink">
                3. Finalités et base légale
              </h2>
              <ul className="mt-2 list-disc space-y-1.5 pl-5">
                <li>
                  Enregistrer et authentifier votre signature de la Charte —
                  base légale : votre consentement explicite.
                </li>
                <li>
                  Vous afficher sur le mur public des signataires — base
                  légale : votre consentement explicite, distinct du
                  précédent et modifiable à tout moment.
                </li>
                <li>
                  Vous envoyer l&apos;email de confirmation (double opt-in) —
                  base légale : exécution de votre demande de signature.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-xl uppercase text-ink">
                4. Durée de conservation
              </h2>
              <p className="mt-2 leading-relaxed">
                Votre signature est conservée tant que vous ne demandez pas
                sa suppression. [Durée précise à trancher avant publication —
                cf. brief de cadrage.]
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl uppercase text-ink">
                5. Vos droits
              </h2>
              <p className="mt-2 leading-relaxed">
                Vous disposez d&apos;un droit d&apos;accès, de rectification
                et d&apos;effacement de vos données. Pour exercer ces droits,
                contactez [email à compléter]. Une demande d&apos;effacement
                entraîne le retrait de votre signature du mur public et de la
                base de données.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl uppercase text-ink">
                6. Hébergement
              </h2>
              <p className="mt-2 leading-relaxed">
                Les données sont hébergées au sein de l&apos;Union européenne
                (Supabase, région Frankfurt).
              </p>
            </section>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
