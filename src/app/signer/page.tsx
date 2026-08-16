import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SignatureForm } from "@/components/SignatureForm";

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
          <h1 className="font-display text-3xl uppercase leading-tight sm:text-4xl">
            Signer la Charte #PlayGG
          </h1>
          <p className="mt-4 text-ink/65">
            Vous recevrez un email de confirmation. Votre signature ne sera
            effective qu&apos;après validation du lien qu&apos;il contient.
          </p>

          <div className="mt-10">
            <SignatureForm />
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
