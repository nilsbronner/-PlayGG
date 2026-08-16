import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { CHARTER_INTRO, CHARTER_PRINCIPLES, CHARTER_TITLE } from "@/lib/charter";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        <section className="mx-auto max-w-3xl px-6 pb-10 pt-16 sm:pt-24">
          <p className="mb-4 font-sans text-xs font-bold uppercase tracking-[0.14em] text-violet">
            La Charte #PlayGG
          </p>
          <h1 className="font-display text-4xl uppercase leading-[0.95] text-ink sm:text-6xl">
            {CHARTER_TITLE}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink/70">
            {CHARTER_INTRO}
          </p>
          <div className="mt-9">
            <Link href="/signer" className="btn-primary">
              Signer la Charte
            </Link>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-6 py-12">
          <div className="grid gap-5 sm:grid-cols-3">
            {CHARTER_PRINCIPLES.map((principle, index) => (
              <div
                key={principle.title}
                className="rounded-2xl border border-ink/10 bg-white p-6"
              >
                <span className="font-display text-3xl text-orange">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h2 className="mt-3 font-display text-xl uppercase tracking-wide">
                  {principle.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-ink/65">
                  {principle.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-6 pb-24">
          <div className="rounded-2xl bg-ink px-8 py-10 text-center sm:px-16">
            <h2 className="font-display text-2xl uppercase text-cream sm:text-3xl">
              Prêt·e à vous engager&nbsp;?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-cream/70">
              La signature prend deux minutes. Vous recevrez un badge à
              afficher sur votre profil ou votre site.
            </p>
            <div className="mt-7">
              <Link href="/signer" className="btn-primary">
                Signer la Charte
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
