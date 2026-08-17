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
          <p className="mt-3 text-sm text-ink/50">Dernière mise à jour : [date]</p>
          <p className="mt-6 leading-relaxed text-ink/75">
            Cette politique explique quelles données sont collectées lorsque
            vous signez la Charte #PlayGG, pourquoi elles le sont et comment
            elles sont utilisées.
          </p>

          <div className="prose-sm mt-10 space-y-8 text-ink/75">
            <section>
              <h2 className="font-display text-xl uppercase text-ink">
                1. Responsable du traitement
              </h2>
              <p className="mt-2 leading-relaxed">
                Le responsable du traitement des données collectées sur
                playgg.fr est :
              </p>
              <p className="mt-2 leading-relaxed">
                Skillcamp Strasbourg Esport
                <br />
                [Adresse]
                <br />
                [Adresse e-mail]
              </p>
              <p className="mt-2 leading-relaxed">
                Pour toute question concernant vos données personnelles ou
                pour exercer vos droits : [Adresse e-mail]
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl uppercase text-ink">
                2. Données collectées
              </h2>
              <p className="mt-2 leading-relaxed">
                Lorsque vous signez la Charte #PlayGG, nous collectons :
              </p>
              <ul className="mt-2 list-disc space-y-1.5 pl-5">
                <li>votre nom ou pseudonyme ;</li>
                <li>votre adresse e-mail ;</li>
                <li>votre qualité, si vous choisissez de la renseigner ;</li>
                <li>
                  le nom de votre structure, club ou entreprise, si vous
                  choisissez de le renseigner.
                </li>
              </ul>
              <p className="mt-2 leading-relaxed">
                Ces données sont limitées à ce qui est nécessaire pour
                enregistrer et vérifier votre signature, vous envoyer votre
                badge #PlayGG et, si vous le souhaitez, afficher votre
                signature sur le mur public des signataires.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl uppercase text-ink">
                3. Utilisation de vos données
              </h2>
              <p className="mt-2 leading-relaxed">Vos données sont utilisées pour :</p>
              <ul className="mt-2 list-disc space-y-1.5 pl-5">
                <li>enregistrer et vérifier votre signature de la Charte #PlayGG ;</li>
                <li>
                  vous envoyer l&apos;e-mail de confirmation nécessaire à la
                  validation de votre signature ;
                </li>
                <li>vous envoyer votre badge #PlayGG ;</li>
                <li>
                  afficher votre nom ou pseudonyme et, si vous les avez
                  renseignés, votre qualité et le nom de votre structure sur
                  le mur public des signataires, si vous avez donné votre
                  accord pour y apparaître.
                </li>
              </ul>
              <p className="mt-2 leading-relaxed">
                L&apos;affichage public de votre signature fait l&apos;objet
                d&apos;un consentement distinct de la signature elle-même.
                Vous pouvez retirer ce consentement à tout moment.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl uppercase text-ink">
                4. Durée de conservation
              </h2>
              <p className="mt-2 leading-relaxed">
                Votre signature et les données associées sont conservées tant
                que vous souhaitez rester signataire de la Charte #PlayGG.
              </p>
              <p className="mt-2 leading-relaxed">
                Vous pouvez à tout moment demander le retrait de votre
                signature et l&apos;effacement de vos données.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl uppercase text-ink">
                5. Vos droits
              </h2>
              <p className="mt-2 leading-relaxed">
                Vous disposez d&apos;un droit d&apos;accès, de rectification
                et d&apos;effacement de vos données. Vous pouvez également
                retirer à tout moment votre consentement à l&apos;affichage
                public de votre signature.
              </p>
              <p className="mt-2 leading-relaxed">
                Pour exercer vos droits, contactez : [Adresse e-mail]
              </p>
              <p className="mt-2 leading-relaxed">
                Votre demande de retrait entraîne la suppression de votre
                signature du mur public et l&apos;effacement des données
                associées, sous réserve des obligations légales qui
                pourraient s&apos;appliquer.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl uppercase text-ink">
                6. Hébergement
              </h2>
              <p className="mt-2 leading-relaxed">
                Les données sont hébergées au sein de l&apos;Union européenne,
                via Supabase, dans la région de Francfort (Allemagne).
              </p>
            </section>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
