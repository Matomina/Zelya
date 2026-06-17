# Zelya — Guide Claude Code

## Contexte projet

Zelya est une plateforme adulte légale et premium pour le marché français/UE.
Statut actuel : **maquette fonctionnelle complète** — front-end + back-end scaffold prêts, en attente de validation juridique avant production.

## Stack technique

| Couche | Technologie |
|---|---|
| Front web | React 18 + Vite + TypeScript + Tailwind CSS v3 |
| Front admin | React 18 + Vite + TypeScript + Tailwind CSS v3 |
| API | NestJS 10 + Prisma 5 + PostgreSQL 16 |
| Auth | JWT (access 15min) + refresh token rotation (stocké en DB) |
| Temps réel | Socket.io (WebSocket Gateway NestJS) |
| Infra | Docker Compose — postgres, redis, api, web, admin |

## Structure du monorepo

```
zelya/
├── apps/
│   ├── web/        → React front-end public (port 5173)
│   ├── api/        → NestJS API REST + WebSocket (port 3001)
│   └── admin/      → Interface modération (port 5174)
├── docs/
│   ├── reference-analysis.md
│   ├── wireframe.md
│   └── NEXT_STEPS.md   ← TODOs bloquants avant production
├── docker-compose.yml
└── .env.example
```

## Commandes essentielles

```bash
# Web
cd apps/web && npm run dev          # dev
cd apps/web && npm run lint         # lint
cd apps/web && npm run build        # build

# API
cd apps/api && npm run start:dev    # dev avec hot reload
cd apps/api && npm run build        # build
cd apps/api && npx prisma studio    # GUI base de données
cd apps/api && npx prisma migrate dev --name <nom>  # nouvelle migration

# Admin
cd apps/admin && npm run dev        # dev (port 5174)

# Tout en Docker
docker-compose up --build
```

## Système de design (Tailwind tokens `z.*`)

Tous les composants utilisent le préfixe `z.` — **ne jamais utiliser d'anciens tokens `zelya-*`**.

| Token | Valeur | Usage |
|---|---|---|
| `bg-z-bg` | `#07070F` | Fond principal |
| `bg-z-surface` | `#0D0C1E` | Surfaces secondaires |
| `bg-z-card` | `#12112B` | Cards |
| `text-z-text` | `#F5F3FF` | Texte principal |
| `text-z-sub` | `#C4C2E0` | Texte secondaire |
| `text-z-muted` | `#9795B5` | Texte atténué |
| `text-z-violet` | `#8B5CF6` | Accent principal |
| `text-z-violet-light` | `#A78BFA` | Accent clair |
| `text-z-online` | `#00F590` | Statut en ligne |
| `border-z-border` | `#1E1B3A` | Bordures |
| `shadow-glow` | violet 25px | Glow sur cards |

Classes composants disponibles dans `index.css` :
`.btn-primary` `.btn-outline` `.btn-ghost` `.btn-danger`
`.input` `.card` `.card-glass` `.card-glow`
`.badge` `.badge-premium` `.badge-verified` `.badge-online` `.badge-new`
`.gradient-text` `.online-dot` `.skeleton` `.glow-violet`

## Pages front-end (apps/web/src/pages/)

| Fichier | Route | Description |
|---|---|---|
| `HomePage.tsx` | `/` | Accueil — hero, sections profils, stats |
| `ListingPage.tsx` | `/profils` | Listing avec filtres sidebar |
| `ProfileDetailPage.tsx` | `/profils/:id` | Fiche profil complète |
| `OnlinePage.tsx` | `/en-ligne` | Profils connectés en temps réel |
| `NouveauxPage.tsx` | `/nouveaux` | Dernières inscriptions |
| `SearchPage.tsx` | `/recherche` | Recherche full-text + filtres |
| `LoginPage.tsx` | `/connexion` | Formulaire login |
| `RegisterPage.tsx` | `/inscription` | Wizard 3 étapes |
| `DashboardPage.tsx` | `/espace` | Dashboard utilisateur |
| `MessagesPage.tsx` | `/messages` | Messagerie (auth wall) |
| `EspaceCreateurPage.tsx` | `/espace-createur` | Landing créateurs |
| `ContactPage.tsx` | `/contact` | Signalement |
| `LegalPage.tsx` | `/mentions-legales` `/confidentialite` `/cgu` | Pages légales |

## Modules API (apps/api/src/)

| Module | Endpoints principaux |
|---|---|
| `auth` | POST /register, /login, /refresh, /logout · GET /me |
| `users` | GET/PATCH/DELETE /users/:id |
| `profiles` | GET /profiles, GET /profiles/:id, PATCH /profiles/:id |
| `favorites` | POST/GET /favorites, GET /favorites/:id/status |
| `reviews` | GET /reviews/profile/:id, POST, PATCH, DELETE |
| `messages` | GET /messages/inbox, GET /messages/:userId, POST, DELETE |
| `reports` | POST /reports, GET /reports, PATCH /reports/:id/resolve |
| `search` | GET /search?q=&city=&gender=&ageMin=&ageMax= |
| `media` | service prêt — controller à activer après config S3/R2 |

Swagger disponible en dev : `http://localhost:3001/api/docs`

## Schéma Prisma — modèles principaux

`User` · `Profile` · `Tag` · `Media` · `Message` · `Review` · `Favorite`
`Report` · `Session` · `RefreshToken` · `Consent` · `AuditLog`

Après toute modification du schéma :
```bash
cd apps/api && npx prisma migrate dev --name description_du_changement
```

## Pages admin (apps/admin/src/pages/)

`DashboardPage` · `UsersPage` · `ProfilesPage` · `ReportsPage`
`MediaModerationPage` · `LegalPage` (tableau conformité 13 points)

Auth : JWT stocké dans `localStorage` sous la clé `zelya_admin_token`.
Seuls les rôles `ADMIN` et `MODERATOR` peuvent accéder à l'admin.

## Règles de développement

1. **Ne jamais copier** contenu, images, textes ou code du site de référence (sexemodel.com)
2. **Ne jamais ajouter** de contenu sexuel explicite réel dans le code
3. **Ne jamais intégrer** de paiement réel avant validation légale et KYC
4. Toujours utiliser les tokens `z.*` — zéro token `zelya-*` dans le code
5. Tout effet hover dynamique → `onMouseEnter`/`onMouseLeave` inline styles (pas de classe Tailwind dynamique)
6. Images → `https://placehold.co/` uniquement (placeholder légal)
7. Avant tout changement de schéma Prisma → créer une migration nommée
8. Les pages légales sont des **placeholders** — validation juridique requise

## TODOs bloquants (ne pas implémenter sans validation)

- **ARCOM** : vérification d'âge certifiée (Yoti, IDnow, VerifyMy) — `TODO: ARCOM` dans le code
- **Paiement** : PSP adulte (CCBill, Segpay) + KYC créateurs — bloqué jusqu'à statut juridique
- **Stockage médias** : S3/Cloudflare R2 — implémenter `getPresignedUploadUrl()` dans `media.service.ts`
- **WebSocket auth** : remplacer query param userId par JWT handshake dans `messages.gateway.ts`
- **Email** : transactionnel (SendGrid ou Brevo) — inscription + reset mot de passe
- **Tests** : Jest (api) + Vitest (web) — aucun test écrit pour l'instant

## Variables d'environnement requises

Copier `.env.example` → `.env` et remplir :
- `DATABASE_URL` — PostgreSQL
- `JWT_SECRET` + `JWT_REFRESH_SECRET` — secrets forts (32+ chars)
- `POSTGRES_PASSWORD` + `REDIS_PASSWORD`
- `WEB_URL` — URL du front (CORS)

Voir `.env.example` pour la liste complète et les TODOs (AGE_VERIFY, PAYMENT, STORAGE).

## Conformité légale (toujours respecter)

- RGPD : soft delete avec anonymisation, table `Consent`, table `AuditLog`
- CNIL : bannière cookies avec consentement explicite catégorisé
- ARCOM : age gate front (`AgeGate.tsx`) + TODO vérification certifiée en production
- Signalement : module `reports` + page `ContactPage`
- Toute implémentation sensible → créer un TODO commenté, ne pas improviser
