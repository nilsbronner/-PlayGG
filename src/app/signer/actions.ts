"use server";

import { randomUUID } from "crypto";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase-admin";
import { sendConfirmationEmail } from "@/lib/resend";
import { signatureSchema } from "@/lib/schema";
import { greetingName } from "@/lib/name";
import { SIGNUP_ENABLED } from "@/lib/feature-flags";

export type SignatureFormValues = {
  prenom: string;
  nom: string;
  pseudo: string;
  email: string;
  quality: string;
  organisation: string;
  consentCharter: boolean;
  consentPublicDisplay: boolean;
};

export type SignatureFormState = {
  status: "idle" | "error";
  message?: string;
  fieldErrors?: Partial<Record<keyof ReturnType<typeof rawFromFormData>, string>>;
  values?: SignatureFormValues;
};

const TOKEN_TTL_HOURS = 48;

function rawFromFormData(formData: FormData) {
  return {
    prenom: String(formData.get("prenom") ?? ""),
    nom: String(formData.get("nom") ?? ""),
    pseudo: String(formData.get("pseudo") ?? ""),
    email: String(formData.get("email") ?? ""),
    quality: String(formData.get("quality") ?? ""),
    organisation: String(formData.get("organisation") ?? ""),
    consentCharter: formData.get("consentCharter") === "on",
    consentPublicDisplay: formData.get("consentPublicDisplay") === "on",
    website: String(formData.get("website") ?? ""),
  };
}

export async function submitSignature(
  _prevState: SignatureFormState,
  formData: FormData,
): Promise<SignatureFormState> {
  if (!SIGNUP_ENABLED) {
    return {
      status: "error",
      message: "Les signatures sont momentanément suspendues. Réessayez d'ici peu.",
    };
  }

  const raw = rawFromFormData(formData);
  // On repropose systématiquement les valeurs saisies : si la soumission
  // échoue (validation, erreur serveur...), le formulaire doit rester
  // rempli au lieu de forcer la personne à tout retaper.
  const values: SignatureFormValues = {
    prenom: raw.prenom,
    nom: raw.nom,
    pseudo: raw.pseudo,
    email: raw.email,
    quality: raw.quality,
    organisation: raw.organisation,
    consentCharter: raw.consentCharter,
    consentPublicDisplay: raw.consentPublicDisplay,
  };

  // Honeypot : un champ invisible pour les humains. S'il est rempli, on fait
  // comme si tout allait bien sans rien écrire en base.
  if (raw.website.trim().length > 0) {
    redirect("/confirmation");
  }

  const parsed = signatureSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: SignatureFormState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof typeof fieldErrors;
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { status: "error", fieldErrors, values };
  }

  const data = parsed.data;

  let supabase: ReturnType<typeof createAdminClient>;
  try {
    supabase = createAdminClient();
  } catch {
    return {
      status: "error",
      message:
        "Le service de signature n'est pas encore configuré, réessayez plus tard.",
      values,
    };
  }

  const { data: existing, error: lookupError } = await supabase
    .from("signatures")
    .select("id, confirmed_at")
    .eq("email", data.email)
    .is("revoked_at", null)
    .maybeSingle();

  if (lookupError) {
    return {
      status: "error",
      message: "Une erreur est survenue, réessayez dans un instant.",
      values,
    };
  }

  if (existing?.confirmed_at) {
    return {
      status: "error",
      message: "Cet email a déjà signé la Charte #PlayGG.",
      values,
    };
  }

  let signatureId = existing?.id;

  if (signatureId) {
    const { error: updateError } = await supabase
      .from("signatures")
      .update({
        prenom: data.prenom || null,
        nom: data.nom || null,
        pseudo: data.pseudo || null,
        quality: data.quality,
        organisation: data.organisation || null,
        consent_charter: data.consentCharter,
        consent_public_display: data.consentPublicDisplay,
        // Le traitement de base (signature + email de confirmation) repose
        // sur l'exécution de la demande, pas sur un consentement distinct :
        // il n'y a donc plus de case à cocher dédiée, seulement un lien
        // "en savoir plus" vers la politique de confidentialité.
        consent_privacy: true,
      })
      .eq("id", signatureId);

    if (updateError) {
      return {
        status: "error",
        message: "Une erreur est survenue, réessayez dans un instant.",
        values,
      };
    }
  } else {
    const { data: inserted, error: insertError } = await supabase
      .from("signatures")
      .insert({
        prenom: data.prenom || null,
        nom: data.nom || null,
        pseudo: data.pseudo || null,
        email: data.email,
        quality: data.quality,
        organisation: data.organisation || null,
        consent_charter: data.consentCharter,
        consent_public_display: data.consentPublicDisplay,
        consent_privacy: true,
      })
      .select("id")
      .single();

    if (insertError || !inserted) {
      return {
        status: "error",
        message: "Une erreur est survenue, réessayez dans un instant.",
        values,
      };
    }
    signatureId = inserted.id;
  }

  const token = randomUUID();
  const expiresAt = new Date(Date.now() + TOKEN_TTL_HOURS * 60 * 60 * 1000).toISOString();

  const { error: tokenError } = await supabase.from("confirmation_tokens").insert({
    token,
    signature_id: signatureId,
    expires_at: expiresAt,
  });

  if (tokenError) {
    return {
      status: "error",
      message: "Une erreur est survenue, réessayez dans un instant.",
      values,
    };
  }

  try {
    await sendConfirmationEmail({
      to: data.email,
      greetingName: greetingName({ prenom: data.prenom, pseudo: data.pseudo }),
      token,
    });
  } catch (error) {
    console.error("sendConfirmationEmail failed:", error);
    return {
      status: "error",
      message:
        "Votre signature est enregistrée mais l'email de confirmation n'a pas pu être envoyé. Réessayez dans un instant.",
      values,
    };
  }

  redirect("/confirmation");
}
