import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-ink/10">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-5">
        <Link href="/" className="font-display text-2xl uppercase tracking-wide text-ink">
          <span className="text-orange">#</span>PlayGG
        </Link>
        <Link
          href="/signer"
          className="font-sans text-sm font-bold text-violet hover:text-ink"
        >
          Signer la Charte
        </Link>
      </div>
    </header>
  );
}
