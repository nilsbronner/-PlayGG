-- #PlayGG — schéma initial (MVP)
-- À exécuter dans le SQL Editor du projet Supabase (Frankfurt / région UE).

create extension if not exists "pgcrypto";

create table if not exists signatures (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  organisation text,
  profile_url text,
  consent_charter boolean not null default false,
  consent_public_display boolean not null default false,
  consent_privacy boolean not null default false,
  confirmed_at timestamptz,
  created_at timestamptz not null default now(),
  revoked_at timestamptz
);

-- Une seule signature active (non révoquée) par email.
create unique index if not exists signatures_email_active_idx
  on signatures (email)
  where revoked_at is null;

create table if not exists confirmation_tokens (
  token uuid primary key default gen_random_uuid(),
  signature_id uuid not null references signatures (id) on delete cascade,
  expires_at timestamptz not null,
  used_at timestamptz
);

create index if not exists confirmation_tokens_signature_id_idx
  on confirmation_tokens (signature_id);

-- Row Level Security : deny-by-default. Aucune policy n'est créée ici :
-- toutes les lectures/écritures de l'application passent par la clé
-- service_role (Server Actions / Route Handlers Next.js côté serveur), qui
-- contourne le RLS. Le client (navigateur) n'a jamais accès direct à ces
-- tables. Quand le mur public des signataires (V2) sera construit, créer
-- une vue dédiée qui exclut la colonne `email` et n'expose que les lignes
-- où `confirmed_at is not null and consent_public_display = true and
-- revoked_at is null`, avec une policy de lecture publique sur cette vue
-- uniquement — jamais sur la table `signatures` elle-même.
alter table signatures enable row level security;
alter table confirmation_tokens enable row level security;
