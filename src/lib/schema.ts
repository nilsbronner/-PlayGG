import { z } from "zod";

/**
 * Schéma de validation du formulaire de signature.
 * Partagé entre le composant client (validation immédiate) et la Server
 * Action (validation faisant foi).
 */
export const signatureSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Indiquez un nom ou pseudonyme d'au moins 2 caractères.")
    .max(120, "120 caractères maximum."),
  email: z.string().trim().email("Adresse email invalide.").max(255),
  organisation: z
    .string()
    .trim()
    .max(200, "200 caractères maximum.")
    .optional()
    .or(z.literal("")),
  profileUrl: z
    .string()
    .trim()
    .max(300)
    .optional()
    .or(z.literal(""))
    .refine((value) => {
      if (!value) return true;
      try {
        return new URL(value).protocol === "https:" || new URL(value).protocol === "http:";
      } catch {
        return false;
      }
    }, "Doit être une URL http(s) valide (https://...)."),
  consentCharter: z
    .boolean()
    .refine((v) => v === true, "Vous devez accepter les principes de la charte."),
  consentPublicDisplay: z.boolean(),
  consentPrivacy: z
    .boolean()
    .refine((v) => v === true, "Vous devez accepter la politique de confidentialité."),
  // Champ honeypot : doit rester vide. Les bots le remplissent souvent.
  website: z.string().max(0).optional().or(z.literal("")),
});

export type SignatureInput = z.infer<typeof signatureSchema>;
