import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-ink/10">
      <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-4 px-6 py-5">
        <Link href="/" className="font-display text-2xl uppercase tracking-wide text-ink">
          <span className="text-orange">#</span>PlayGG
        </Link>
        <nav className="flex items-center gap-5 font-sans text-sm font-semibold text-ink/65">
          <Link href="/signataires" className="hover:text-ink">
            Signataires
          </Link>
          <Link href="/faq" className="hover:text-ink">
            FAQ
          </Link>
          <Link href="/signer" className="text-violet hover:text-ink">
            Signer la Charte
          </Link>
        </nav>
      </div>
    </header>
  );
}
