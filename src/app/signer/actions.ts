"use server";

import { randomUUID } from "crypto";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase-admin";
import { sendConfirmationEmail } from "@/lib/resend";
import { signatureSchema } from "@/lib/schema";

export type SignatureFormState = {
  status: "idle" | "error";
  message?: string;
  fieldErrors?: Partial<Record<keyof ReturnType<typeof rawFromFormData>, string>>;
};

const TOKEN_TTL_HOURS = 48;

function rawFromFormData(formData: FormData) {
  return {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    organisation: String(formData.get("organisation") ?? ""),
    profileUrl: String(formData.get("profileUrl") ?? ""),
    consentCharter: formData.get("consentCharter") === "on",
    consentPublicDisplay: formData.get("consentPublicDisplay") === "on",
    consentPrivacy: formData.get("consentPrivacy") === "on",
    website: String(formData.get("website") ?? ""),
  };
}

export async function submitSignature(
  _prevState: SignatureFormState,
  formData: FormData,
): Promise<SignatureFormState> {
  const raw = rawFromFormData(formData);

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
    return { status: "error", fieldErrors };
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
    };
  }

  if (existing?.confirmed_at) {
    return {
      status: "error",
      message: "Cet email a déjà signé la Charte #PlayGG.",
    };
  }

  let signatureId = existing?.id;

  if (signatureId) {
    const { error: updateError } = await supabase
      .from("signatures")
      .update({
        name: data.name,
        organisation: data.organisation || null,
        profile_url: data.profileUrl || null,
        consent_charter: data.consentCharter,
        consent_public_display: data.consentPublicDisplay,
        consent_privacy: data.consentPrivacy,
      })
      .eq("id", signatureId);

    if (updateError) {
      return {
        status: "error",
        message: "Une erreur est survenue, réessayez dans un instant.",
      };
    }
  } else {
    const { data: inserted, error: insertError } = await supabase
      .from("signatures")
      .insert({
        name: data.name,
        email: data.email,
        organisation: data.organisation || null,
        profile_url: data.profileUrl || null,
        consent_charter: data.consentCharter,
        consent_public_display: data.consentPublicDisplay,
        consent_privacy: data.consentPrivacy,
      })
      .select("id")
      .single();

    if (insertError || !inserted) {
      return {
        status: "error",
        message: "Une erreur est survenue, réessayez dans un instant.",
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
    };
  }

  try {
    await sendConfirmationEmail({ to: data.email, name: data.name, token });
  } catch {
    return {
      status: "error",
      message:
        "Votre signature est enregistrée mais l'email de confirmation n'a pas pu être envoyé. Réessayez dans un instant.",
    };
  }

  redirect("/confirmation");
}
