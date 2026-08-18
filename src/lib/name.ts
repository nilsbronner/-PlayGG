export type SignatoryNameParts = {
  prenom: string | null;
  nom: string | null;
  pseudo: string | null;
};

export function capitalizeFirst(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return trimmed;
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
}

/**
 * Nom d'affichage public d'un·e signataire : "Prénom "Pseudo" NOM".
 * Si nom/prénom n'ont pas été renseignés (choix d'anonymat), seul le
 * pseudo est affiché, sans guillemets.
 */
export function formatSignatoryName({ prenom, nom, pseudo }: SignatoryNameParts): string {
  const trimmedPseudo = pseudo?.trim() ?? "";
  const hasFullName = Boolean(prenom?.trim() && nom?.trim());

  if (!hasFullName) {
    return trimmedPseudo;
  }

  const parts = [capitalizeFirst(prenom!)];
  if (trimmedPseudo) parts.push(`"${trimmedPseudo}"`);
  parts.push(nom!.trim().toUpperCase());
  return parts.join(" ");
}

/** Prénom (ou pseudo à défaut) pour un message personnel type "Bonjour X,". */
export function greetingName({ prenom, pseudo }: { prenom: string; pseudo: string }): string {
  return prenom.trim() ? capitalizeFirst(prenom) : pseudo.trim();
}
