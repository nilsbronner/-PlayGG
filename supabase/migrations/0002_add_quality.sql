-- #PlayGG — ajout de la "qualité" du signataire ("vous signez en tant que")
-- À exécuter dans le SQL Editor du projet Supabase, après 0001_init.sql.

alter table signatures
  add column if not exists quality text
    check (quality in ('joueur', 'equipe_club', 'association', 'entreprise', 'elu', 'institution', 'autre'));

comment on column signatures.quality is
  'Catégorie choisie à la signature : joueur, equipe_club, association, entreprise, elu, institution, autre.';
