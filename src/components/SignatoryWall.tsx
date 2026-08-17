"use client";

import { useCallback, useEffect, useState } from "react";
import type { PublicSignatory, SignatoryFilter } from "@/lib/signatures";

const POLL_INTERVAL_MS = 10000;

const FILTERS: { value: SignatoryFilter; label: string }[] = [
  { value: "all", label: "Tous" },
  { value: "individual", label: "Individuel" },
  { value: "organisation", label: "Structures" },
];

function isSafeHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function SignatoryCard({ signatory }: { signatory: PublicSignatory }) {
  return (
    <li className="rounded-xl border border-ink/10 bg-surface p-4 transition hover:border-violet/40">
      <p className="font-sans text-base font-bold text-ink">{signatory.name}</p>
      {signatory.organisation && (
        <p className="mt-0.5 text-sm text-ink/55">{signatory.organisation}</p>
      )}
      {signatory.profile_url && isSafeHttpUrl(signatory.profile_url) && (
        <a
          href={signatory.profile_url}
          target="_blank"
          rel="noopener noreferrer nofollow ugc"
          className="mt-2 inline-block text-sm font-semibold text-violet hover:underline"
        >
          Voir le profil ↗
        </a>
      )}
    </li>
  );
}

export function SignatoryWall({
  initialSignatories,
  limit = 60,
  compact = false,
}: {
  initialSignatories: PublicSignatory[];
  limit?: number;
  compact?: boolean;
}) {
  const [filter, setFilter] = useState<SignatoryFilter>("all");
  const [signatories, setSignatories] = useState(initialSignatories);

  const load = useCallback(
    async (nextFilter: SignatoryFilter) => {
      try {
        const res = await fetch(`/api/signatures/wall?filter=${nextFilter}&limit=${limit}`, {
          cache: "no-store",
        });
        if (!res.ok) return;
        const data = await res.json();
        if (Array.isArray(data.signatories)) setSignatories(data.signatories);
      } catch {
        // Silencieux : on garde la dernière liste connue en cas d'erreur réseau.
      }
    },
    [limit],
  );

  // Recharge immédiatement au changement de filtre (skip du premier rendu, déjà servi par le serveur).
  useEffect(() => {
    if (compact || filter === "all") return;
    load(filter);
  }, [filter, load, compact]);

  useEffect(() => {
    const interval = setInterval(() => load(filter), POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [filter, load]);

  return (
    <div>
      {!compact && (
        <div className="mb-6 flex gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFilter(f.value)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                filter === f.value
                  ? "bg-ink text-cream"
                  : "border border-ink/15 text-ink/60 hover:border-ink/30"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      {signatories.length === 0 ? (
        <p className="rounded-xl border border-dashed border-ink/15 px-5 py-8 text-center text-ink/50">
          Soyez parmi les premiers signataires visibles ici.
        </p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {signatories.map((signatory) => (
            <SignatoryCard key={signatory.id} signatory={signatory} />
          ))}
        </ul>
      )}
    </div>
  );
}
