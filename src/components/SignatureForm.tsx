"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { submitSignature, type SignatureFormState } from "@/app/signer/actions";

const initialState: SignatureFormState = { status: "idle" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn-primary w-full sm:w-auto" disabled={pending}>
      {pending ? "Envoi en cours…" : "Signer la Charte"}
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
          Nom ou pseudonyme <span className="text-danger">*</span>
        </label>
        <input id="name" name="name" type="text" required className="field-input" />
        {state.fieldErrors?.name && <p className="field-error">{state.fieldErrors.name}</p>}
      </div>

      <div>
        <label htmlFor="email" className="field-label">
          Email <span className="text-danger">*</span>
        </label>
        <input id="email" name="email" type="email" required className="field-input" />
        <p className="mt-1.5 text-sm text-ink/50">
          Utilisé uniquement pour confirmer votre signature. Jamais affiché publiquement.
        </p>
        {state.fieldErrors?.email && <p className="field-error">{state.fieldErrors.email}</p>}
      </div>

      <div>
        <label htmlFor="organisation" className="field-label">
          Structure / club / marque{" "}
          <span className="font-normal text-ink/40">(optionnel)</span>
        </label>
        <input id="organisation" name="organisation" type="text" className="field-input" />
      </div>

      <div>
        <label htmlFor="profileUrl" className="field-label">
          Lien de profil ou de site{" "}
          <span className="font-normal text-ink/40">(optionnel)</span>
        </label>
        <input
          id="profileUrl"
          name="profileUrl"
          type="url"
          placeholder="https://…"
          className="field-input"
        />
        {state.fieldErrors?.profileUrl && (
          <p className="field-error">{state.fieldErrors.profileUrl}</p>
        )}
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
            J&apos;ai lu et j&apos;accepte les 3 principes de la Charte #PlayGG.{" "}
            <span className="text-danger">*</span>
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
            J&apos;accepte d&apos;apparaître sur le mur public des signataires.
          </span>
        </label>

        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            name="consentPrivacy"
            required
            className="mt-1 h-4 w-4 flex-none rounded border-ink/30 text-violet focus:ring-violet"
          />
          <span className="text-sm text-ink/80">
            J&apos;accepte le traitement de mes données conformément à la{" "}
            <a href="/confidentialite" className="text-violet underline">
              politique de confidentialité
            </a>
            . <span className="text-danger">*</span>
          </span>
        </label>
        {state.fieldErrors?.consentPrivacy && (
          <p className="field-error -mt-2">{state.fieldErrors.consentPrivacy}</p>
        )}
      </div>

      <SubmitButton />
    </form>
  );
}
