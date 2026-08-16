import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "FAQ — #PlayGG",
};

const COMMITMENTS = [
  "Respecter et promouvoir les 3 principes de la charte (respect, inclusion, responsabilité) dans votre pratique de l'esport.",
  "Afficher publiquement votre engagement via le badge #PlayGG, si vous le souhaitez.",
  "Rien de plus : pas de cotisation, pas de démarche administrative supplémentaire.",
];

const NON_COMMITMENTS = [
  "Rejoindre une association ou une structure #PlayGG — il n'y en a pas, la Charte n'est pas une adhésion.",
  "Payer une cotisation ou des frais, quels qu'ils soient : signer est et restera gratuit.",
  "Un contrat juridiquement contraignant ni des obligations de résultat.",
  "Un audit ou un contrôle de vos pratiques.",
  "Le partage de vos données au-delà de ce que vous avez explicitement consenti.",
];

const FAQ_ITEMS: { question: string; answer: string }[] = [
  {
    question: "Qui peut signer la Charte #PlayGG ?",
    answer:
      "Toute personne — joueur, joueuse, créateur, créatrice, streamer — ainsi que les structures esport, clubs et marques qui adhèrent aux 3 principes de la charte.",
  },
  {
    question: "La signature est-elle payante ?",
    answer: "Non. Signer la Charte #PlayGG est entièrement gratuit, sans condition.",
  },
  {
    question: "Puis-je signer au nom de ma structure ou de ma marque ?",
    answer:
      "Oui : renseignez son nom dans le champ « Structure / club / marque » du formulaire. La signature reste rattachée à la personne qui la soumet, au nom de cette structure.",
  },
  {
    question: "Pourquoi dois-je confirmer mon email ?",
    answer:
      "C'est une étape de double consentement (double opt-in) : elle garantit que la signature vous appartient bien et évite les signatures automatisées ou frauduleuses.",
  },
  {
    question: "Mes données sont-elles rendues publiques ?",
    answer:
      "Seuls votre nom (ou pseudonyme) et, si vous les avez renseignés, votre structure et votre lien de profil apparaissent sur le mur public — et uniquement si vous avez coché la case correspondante lors de la signature. Votre email n'est jamais affiché publiquement.",
  },
  {
    question: "Comment retirer ma signature ?",
    answer:
      "Contactez le responsable de traitement du site (coordonnées sur la page Confidentialité) pour exercer votre droit à l'effacement. Votre signature est alors retirée du mur public et de la base de données.",
  },
  {
    question: "Que se passe-t-il si je ne reçois pas l'email de confirmation ?",
    answer:
      "Vérifiez vos courriers indésirables, ou retournez sur la page de signature pour recommencer : un nouveau lien de confirmation vous sera envoyé.",
  },
];

export default function FaqPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-2xl px-6 py-16">
          <p className="mb-3 font-sans text-xs font-bold uppercase tracking-[0.14em] text-violet">
            Avant de signer
          </p>
          <h1 className="font-display text-3xl uppercase leading-tight sm:text-4xl">
            Ce que ça engage — et ce que ça n&apos;engage pas
          </h1>
          <p className="mt-4 text-ink/65">
            Signer la Charte #PlayGG est une prise de position publique, pas
            un contrat. Voici précisément ce que ça implique.
          </p>

          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            <div className="rounded-2xl border border-ink/10 bg-white p-6">
              <h2 className="font-display text-lg uppercase tracking-wide text-ink">
                Vous vous engagez à
              </h2>
              <ul className="mt-4 space-y-3">
                {COMMITMENTS.map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-ink/70">
                    <span className="mt-0.5 flex-none font-display text-orange">+</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-ink/10 bg-white p-6">
              <h2 className="font-display text-lg uppercase tracking-wide text-ink">
                La signature ne vous engage pas à
              </h2>
              <ul className="mt-4 space-y-3">
                {NON_COMMITMENTS.map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-ink/70">
                    <span className="mt-0.5 flex-none font-display text-violet">–</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-16">
            <h2 className="font-display text-2xl uppercase tracking-wide">
              Questions fréquentes
            </h2>
            <div className="mt-6 divide-y divide-ink/10 rounded-2xl border border-ink/10 bg-white">
              {FAQ_ITEMS.map((item) => (
                <details key={item.question} className="group p-5 open:bg-cream/40">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-sans text-base font-bold text-ink marker:content-none">
                    {item.question}
                    <span className="flex-none text-xl text-ink/40 transition group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-ink/65">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
