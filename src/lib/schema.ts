import { z } from "zod";
import { QUALITIES } from "@/lib/quality";

/**
 * Schéma de validation du formulaire de signature.
 * Partagé entre le composant client (validation immédiate) et la Server
 * Action (validation faisant foi).
 *
 * Nom et prénom vont ensemble (les deux ou aucun des deux) ; le pseudo est
 * optionnel en complément, ou peut être utilisé seul si la personne
 * souhaite signer de façon anonyme.
 */
export const signatureSchema = z
  .object({
    prenom: z.string().trim().max(80, "80 caractères maximum."),
    nom: z.string().trim().max(80, "80 caractères maximum."),
    pseudo: z.string().trim().max(80, "80 caractères maximum."),
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
  })
  .superRefine((data, ctx) => {
    const hasPrenom = data.prenom.length > 0;
    const hasNom = data.nom.length > 0;
    const hasPseudo = data.pseudo.length > 0;

    if (hasPrenom !== hasNom) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: [hasPrenom ? "nom" : "prenom"],
        message:
          "Indiquez le prénom et le nom ensemble, ou laissez les deux vides et utilisez un pseudonyme.",
      });
    } else if (!hasPrenom && !hasPseudo) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["prenom"],
        message: "Indiquez votre nom et prénom, ou au moins un pseudonyme.",
      });
    }

    if (hasPrenom && data.prenom.length < 2) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["prenom"], message: "2 caractères minimum." });
    }
    if (hasNom && data.nom.length < 2) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["nom"], message: "2 caractères minimum." });
    }
    if (hasPseudo && data.pseudo.length < 2) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["pseudo"], message: "2 caractères minimum." });
    }
  });

export type SignatureInput = z.infer<typeof signatureSchema>;
