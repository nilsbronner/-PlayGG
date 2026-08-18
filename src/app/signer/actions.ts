"use server";

import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase-admin";
import { signatureSchema } from "@/lib/schema";

export type SignatureFormState = {
  status: "idle" | "error";
  message?: string;
  fieldErrors?: Partial<Record<keyof ReturnType<typeof rawFromFormData>, string>>;
};

function rawFromFormData(formData: FormData) {
  return {
    name: String(formData.get("name") ?? ""),
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
    .select("id")
    .eq("email", data.email)
    .is("revoked_at", null)
    .maybeSingle();

  if (lookupError) {
    return {
      status: "error",
      message: "Une erreur est survenue, réessayez dans un instant.",
    };
  }

  if (existing) {
    return {
      status: "error",
      message: "Cet email a déjà signé la Charte #PlayGG.",
    };
  }

  const { data: inserted, error: insertError } = await supabase
    .from("signatures")
    .insert({
      name: data.name,
      email: data.email,
      quality: data.quality,
      organisation: data.organisation || null,
      consent_charter: data.consentCharter,
      consent_public_display: data.consentPublicDisplay,
      // Le traitement de base (enregistrement de la signature) repose sur
      // l'exécution de la demande, pas sur un consentement distinct : il
      // n'y a donc plus de case à cocher dédiée, seulement un lien "en
      // savoir plus" vers la politique de confidentialité.
      consent_privacy: true,
      confirmed_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (insertError || !inserted) {
    return {
      status: "error",
      message: "Une erreur est survenue, réessayez dans un instant.",
    };
  }

  redirect(`/confirmation?id=${inserted.id}`);
}
