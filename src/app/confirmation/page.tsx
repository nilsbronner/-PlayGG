import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "C'est signé ! — #PlayGG",
};

export default function ConfirmationPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-lg px-6 py-24 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-violet/10 text-3xl">
            🎮
          </div>
          <h1 className="font-display text-lg uppercase leading-relaxed sm:text-2xl">
            C&apos;est signé !
          </h1>
          <p className="mt-4 text-ink/65">
            Un email vient de vous être envoyé. Cliquez sur le lien qu&apos;il
            contient pour confirmer votre signature — il expire dans 48
            heures.
          </p>
          <p className="mt-3 text-sm text-ink/45">
            Rien reçu&nbsp;? Vérifiez vos spams ou{" "}
            <a href="/signer" className="text-violet underline">
              recommencez
            </a>
            .
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
