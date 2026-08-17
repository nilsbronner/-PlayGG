/**
 * "Vous signez en tant que" — catégorie de signataire, choisie à la
 * signature et utilisée pour filtrer le mur des signataires.
 */
export const QUALITIES = [
  "joueur",
  "equipe_club",
  "association",
  "entreprise",
  "elu",
  "institution",
  "autre",
] as const;

export type Quality = (typeof QUALITIES)[number];

export const QUALITY_LABELS: Record<Quality, { singular: string; plural: string }> = {
  joueur: { singular: "Joueuse / joueur", plural: "Joueuses / joueurs" },
  equipe_club: { singular: "Équipe / club", plural: "Équipes / clubs" },
  association: { singular: "Association", plural: "Associations" },
  entreprise: { singular: "Entreprise", plural: "Entreprises" },
  elu: { singular: "Élue / élu", plural: "Élues / élus" },
  institution: { singular: "Institution", plural: "Institutions" },
  autre: { singular: "Autre", plural: "Autres" },
};

export function isQuality(value: string): value is Quality {
  return (QUALITIES as readonly string[]).includes(value);
}
