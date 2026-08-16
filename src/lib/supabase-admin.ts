import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Client Supabase côté serveur uniquement, avec la clé service_role.
 * Ne jamais importer ce fichier depuis un composant client ("use client")
 * ou l'exposer au navigateur : la clé service_role contourne le RLS.
 */
function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Variable d'environnement manquante: ${name}`);
  }
  return value;
}

export function createAdminClient() {
  return createClient(getEnv("SUPABASE_URL"), getEnv("SUPABASE_SERVICE_ROLE_KEY"), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export type SignatureRow = {
  id: string;
  name: string;
  email: string;
  organisation: string | null;
  profile_url: string | null;
  consent_charter: boolean;
  consent_public_display: boolean;
  consent_privacy: boolean;
  confirmed_at: string | null;
  created_at: string;
  revoked_at: string | null;
};

export type ConfirmationTokenRow = {
  token: string;
  signature_id: string;
  expires_at: string;
  used_at: string | null;
};
