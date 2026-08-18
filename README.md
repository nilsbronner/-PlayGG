# #PlayGG — Site de signature de la Charte

Site annexe indépendant de SPLASH : page Charte + formulaire de signature
(enregistrée immédiatement, sans email de confirmation) + badge
téléchargeable + mur public des signataires (temps réel par
rafraîchissement automatique) + FAQ. Pas encore de snippet d'intégration
ni de back-office admin — prévus en V3.

## Stack

- **Next.js 15** (App Router) + TypeScript + Tailwind CSS
- **Supabase** (Postgres) — écritures exclusivement côté serveur avec la clé
  `service_role`, RLS activé en deny-by-default (aucune policy publique)
- **next/og** — génération du badge image (PNG dynamique)

## Mise en route

### 1. Installer les dépendances

```bash
npm install
```

### 2. Créer le schéma Supabase

Dans le dashboard de ton projet Supabase existant → **SQL Editor**, exécute
dans l'ordre le contenu de
[`supabase/migrations/0001_init.sql`](./supabase/migrations/0001_init.sql)
puis de
[`supabase/migrations/0002_add_quality.sql`](./supabase/migrations/0002_add_quality.sql).
La première crée les tables `signatures` et `confirmation_tokens` (cette
dernière n'est plus utilisée par le code, la signature étant enregistrée
immédiatement, mais elle reste inoffensive en base) avec RLS activé et sans
policy publique — toutes les opérations passent par la clé `service_role`,
jamais exposée au navigateur. La seconde ajoute la colonne `quality`.

Vérifie que ton projet est bien hébergé en région UE (Frankfurt) pour la
conformité RGPD.

### 3. Variables d'environnement

Copie `.env.example` vers `.env.local` et renseigne :

| Variable | Où la trouver |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | domaine final du site (ex. `https://playgg.fr`) |
| `SUPABASE_URL` | Supabase → Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API (clé **secrète**) |

```bash
cp .env.example .env.local
```

### 4. Lancer en local

```bash
npm run dev
```

## Déployer sur Vercel

1. Importe ce dépôt dans Vercel (New Project → sélectionner le repo).
2. Dans **Settings → Environment Variables**, ajoute les mêmes variables
   que dans `.env.local` (jamais commitées dans le repo).
3. Déploie. Ajuste `NEXT_PUBLIC_SITE_URL` une fois le domaine définitif
   (`playgg.fr` ou équivalent) branché sur le projet Vercel.

## Mur des signataires et compteur « temps réel »

`/signataires` et le bloc « Derniers signataires » de la page d'accueil
s'appuient sur `GET /api/signatures/wall` et `GET /api/signatures/count` —
des Route Handlers Next.js qui interrogent Supabase côté serveur avec la
clé `service_role` et ne renvoient jamais la colonne `email`. Le "temps
réel" est un rafraîchissement automatique côté client (toutes les ~8-10s),
pas un websocket — suffisant à cette échelle, sans configuration Supabase
Realtime supplémentaire. Aucune policy RLS publique n'est nécessaire : le
navigateur n'a jamais de clé Supabase, tout passe par ces routes.

## Ce qui reste à trancher avant mise en ligne publique

Repris du brief de cadrage — voir aussi les pages `/confidentialite` et
`/cgu`, qui contiennent des `[à compléter]` :

- Nom de domaine définitif.
- Responsable de traitement / DPO pour ce site.
- Durée de conservation exacte des signatures.
- Anti-abus : le formulaire a un champ honeypot, mais pas encore de captcha
  (Turnstile/hCaptcha) — à ajouter si le spam devient un problème.

## Prochaines phases (hors scope de ce site)

- **V2 restant** : snippet d'intégration HTML, page de vérification
  publique `/s/[id]` prouvant l'authenticité d'un badge.
- **V3** : back-office admin (Supabase Auth), export RGPD en un clic,
  statistiques, modération.
