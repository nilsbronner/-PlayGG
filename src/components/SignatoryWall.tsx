"use client";

import { useCallback, useEffect, useState } from "react";
import type { PublicSignatory, SignatoryFilter } from "@/lib/signatures";
import { QUALITIES, QUALITY_LABELS } from "@/lib/quality";
import { formatSignatoryName } from "@/lib/name";

const POLL_INTERVAL_MS = 10000;

const FILTERS: { value: SignatoryFilter; label: string }[] = [
  { value: "all", label: "Tous" },
  ...QUALITIES.map((quality) => ({ value: quality, label: QUALITY_LABELS[quality].plural })),
];

function SignatoryCard({ signatory }: { signatory: PublicSignatory }) {
  return (
    <li className="rounded-xl border border-ink/10 bg-surface p-4 transition hover:border-violet/40">
      <p className="font-sans text-base font-bold text-ink">{formatSignatoryName(signatory)}</p>
      {signatory.quality && (
        <p className="mt-0.5 text-sm text-violet">
          {QUALITY_LABELS[signatory.quality].singular}
        </p>
      )}
      {signatory.organisation && (
        <p className="mt-0.5 text-sm text-ink/55">{signatory.organisation}</p>
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
        <div className="mb-6 flex flex-wrap gap-2">
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
          Les premiers signataires
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
