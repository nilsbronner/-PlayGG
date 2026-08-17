"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { submitSignature, type SignatureFormState } from "@/app/signer/actions";
import { QUALITIES, QUALITY_LABELS } from "@/lib/quality";

const initialState: SignatureFormState = { status: "idle" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn-primary w-full sm:w-auto" disabled={pending}>
      {pending ? "Envoi en cours…" : "Je signe #PlayGG"}
    </button>
  );
}

export function SignatureForm() {
  const [state, formAction] = useActionState(submitSignature, initialState);

  return (
    <form action={formAction} className="space-y-6" noValidate>
      {state.status === "error" && state.message && (
        <p className="rounded-lg bg-danger/10 px-4 py-3 text-sm font-medium text-danger">
          {state.message}
        </p>
      )}

      {/* Honeypot anti-bot : champ caché, doit rester vide */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Laissez ce champ vide</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <label htmlFor="name" className="field-label">
          Votre nom ou pseudonyme
        </label>
        <input id="name" name="name" type="text" required className="field-input" />
        {state.fieldErrors?.name && <p className="field-error">{state.fieldErrors.name}</p>}
      </div>

      <div>
        <label htmlFor="email" className="field-label">
          Votre adresse e-mail
        </label>
        <input id="email" name="email" type="email" required className="field-input" />
        <p className="mt-1.5 text-sm text-ink/50">
          Elle nous permet de confirmer votre signature. Elle ne sera pas publiée.
        </p>
        {state.fieldErrors?.email && <p className="field-error">{state.fieldErrors.email}</p>}
      </div>

      <fieldset>
        <legend className="field-label">Vous signez en tant que</legend>
        <div className="space-y-2.5">
          {QUALITIES.map((quality) => (
            <label key={quality} className="flex items-center gap-2.5">
              <input
                type="radio"
                name="quality"
                value={quality}
                required
                className="h-4 w-4 flex-none border-ink/30 text-violet focus:ring-violet"
              />
              <span className="text-sm text-ink/80">{QUALITY_LABELS[quality].singular}</span>
            </label>
          ))}
        </div>
        {state.fieldErrors?.quality && <p className="field-error">{state.fieldErrors.quality}</p>}
      </fieldset>

      <div>
        <label htmlFor="organisation" className="field-label">
          Structure / club / entreprise{" "}
          <span className="font-normal text-ink/40">(optionnel)</span>
        </label>
        <input id="organisation" name="organisation" type="text" className="field-input" />
      </div>

      <div className="space-y-4 border-t border-ink/10 pt-6">
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            name="consentCharter"
            required
            className="mt-1 h-4 w-4 flex-none rounded border-ink/30 text-violet focus:ring-violet"
          />
          <span className="text-sm text-ink/80">
            J&apos;adhère aux trois principes de la Charte #PlayGG.
          </span>
        </label>
        {state.fieldErrors?.consentCharter && (
          <p className="field-error -mt-2">{state.fieldErrors.consentCharter}</p>
        )}

        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            name="consentPublicDisplay"
            className="mt-1 h-4 w-4 flex-none rounded border-ink/30 text-violet focus:ring-violet"
          />
          <span className="text-sm text-ink/80">
            J&apos;accepte que mon nom ou pseudonyme apparaisse sur le mur des signataires.
          </span>
        </label>

        <a href="/confidentialite" className="inline-block text-sm font-semibold text-violet underline">
          En savoir plus sur l&apos;utilisation de vos données →
        </a>
      </div>

      <SubmitButton />
      <p className="text-sm text-ink/50">
        Je recevrai un email de confirmation. Ma signature ne sera effective qu&apos;après
        validation du lien.
      </p>
    </form>
  );
}
