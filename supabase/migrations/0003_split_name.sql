-- #PlayGG — remplace la colonne "name" par prenom / nom / pseudo.
-- À exécuter dans le SQL Editor du projet Supabase, après 0002_add_quality.sql.
-- Nettoie d'abord les signatures de test existantes (aucune n'est
-- confirmée) : elles n'ont que l'ancien champ "name" rempli, donc une
-- fois "name" supprimée elles violeraient la contrainte ci-dessous.

delete from confirmation_tokens;
delete from signatures;

alter table signatures drop column if exists name;

alter table signatures add column if not exists prenom text;
alter table signatures add column if not exists nom text;
alter table signatures add column if not exists pseudo text;

alter table signatures drop constraint if exists signatures_identity_check;
alter table signatures
  add constraint signatures_identity_check
  check (
    (prenom is not null and nom is not null) or pseudo is not null
  );

comment on column signatures.prenom is 'Prénom du signataire (facultatif si pseudo seul).';
comment on column signatures.nom is 'Nom du signataire (facultatif si pseudo seul).';
comment on column signatures.pseudo is
  'Pseudonyme, optionnel en complément du nom/prénom, ou seul si le signataire choisit de rester anonyme.';
