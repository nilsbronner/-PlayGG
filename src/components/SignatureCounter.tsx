"use client";

import { useEffect, useState } from "react";

const POLL_INTERVAL_MS = 8000;

export function SignatureCounter({ initialCount }: { initialCount: number }) {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      try {
        const res = await fetch("/api/signatures/count", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled && typeof data.count === "number") {
          setCount(data.count);
        }
      } catch {
        // Silencieux : on garde la dernière valeur connue en cas d'erreur réseau.
      }
    }

    const interval = setInterval(poll, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return (
    <span className="tabular-nums" aria-live="polite">
      {new Intl.NumberFormat("fr-FR").format(count)}
    </span>
  );
}
