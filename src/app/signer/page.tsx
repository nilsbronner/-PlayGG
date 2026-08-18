import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SignatureForm } from "@/components/SignatureForm";
import { SIGNUP_ENABLED } from "@/lib/feature-flags";

export const metadata: Metadata = {
  title: "Signer la Charte — #PlayGG",
};

export default function SignerPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-xl px-6 py-16">
          <p className="mb-3 font-sans text-xs font-bold uppercase tracking-[0.14em] text-violet">
            Signature
          </p>
          <h1 className="font-display text-lg uppercase leading-relaxed sm:text-2xl">
            Signer la Charte #PlayGG
          </h1>

          {SIGNUP_ENABLED ? (
            <>
              <p className="mt-4 text-ink/65">
                Vous recevrez un email de confirmation. Votre signature ne sera
                effective qu&apos;après validation du lien qu&apos;il contient.
              </p>
              <div className="mt-10">
                <SignatureForm />
              </div>
            </>
          ) : (
            <div className="mt-10 rounded-2xl border border-ink/10 bg-surface p-6">
              <p className="text-ink/70">
                Les signatures sont momentanément suspendues le temps d&apos;une
                courte intervention technique. Merci de repasser d&apos;ici peu
                pour signer la Charte #PlayGG.
              </p>
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
