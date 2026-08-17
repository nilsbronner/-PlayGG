import { z } from "zod";
import { QUALITIES } from "@/lib/quality";

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
  quality: z.enum(QUALITIES, {
    errorMap: () => ({ message: "Indiquez en tant que quoi vous signez." }),
  }),
  organisation: z
    .string()
    .trim()
    .max(200, "200 caractères maximum.")
    .optional()
    .or(z.literal("")),
  consentCharter: z
    .boolean()
    .refine((v) => v === true, "Vous devez adhérer aux principes de la charte."),
  consentPublicDisplay: z.boolean(),
  // Champ honeypot : doit rester vide. Les bots le remplissent souvent.
  website: z.string().max(0).optional().or(z.literal("")),
});

export type SignatureInput = z.infer<typeof signatureSchema>;
