import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "FAQ — #PlayGG",
};

const FAQ_ITEMS: { question: string; answer: string }[] = [
  {
    question: "Qui peut signer la Charte #PlayGG ?",
    answer:
      "Toute personne, ainsi que les équipes, clubs, associations, entreprises et institutions qui adhèrent aux trois principes de la Charte.",
  },
  {
    question: "La signature est-elle gratuite ?",
    answer: "Oui. Signer la Charte #PlayGG est entièrement gratuit.",
  },
  {
    question: "Puis-je signer au nom de ma structure ?",
    answer:
      "Oui. Vous pouvez signer au nom de votre équipe, club, association, entreprise ou institution.",
  },
  {
    question: "Pourquoi dois-je confirmer mon adresse e-mail ?",
    answer:
      "Pour vérifier que la signature vient bien de vous et éviter les signatures automatisées ou frauduleuses.",
  },
  {
    question: "Quelles informations apparaissent sur le mur des signataires ?",
    answer:
      "Votre nom ou pseudonyme, et en quelle qualité si vous l'avez renseigné. Dans tous les cas, votre adresse e-mail n'est jamais publiée.",
  },
  {
    question: "Comment retirer ma signature ?",
    answer:
      "Vous pouvez demander à tout moment le retrait de votre signature. Les modalités sont précisées dans notre politique de confidentialité.",
  },
];

export default function FaqPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-2xl px-6 py-16">
          <h1 className="font-display text-base uppercase leading-relaxed sm:text-2xl">
            Vous avez des questions ?
          </h1>

          <div className="mt-10 divide-y divide-ink/10 rounded-2xl border border-ink/10 bg-surface">
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
      </main>
      <SiteFooter />
    </div>
  );
}
