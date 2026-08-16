import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-ink/10">
      <div className="mx-auto flex max-w-3xl flex-col gap-3 px-6 py-8 text-sm text-ink/60 sm:flex-row sm:items-center sm:justify-between">
        <p>#PlayGG — pour un esport mixte et responsable</p>
        <nav className="flex gap-5">
          <Link href="/confidentialite" className="hover:text-ink">
            Confidentialité
          </Link>
          <Link href="/cgu" className="hover:text-ink">
            CGU
          </Link>
        </nav>
      </div>
    </footer>
  );
}
