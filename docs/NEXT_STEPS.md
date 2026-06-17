# Zelya — Prochaines étapes

## Pour démarrer le projet localement

```bash
# 1. Copier les variables d'environnement
cp .env.example .env
# Éditer .env avec vos vraies valeurs (PostgreSQL, JWT secrets, etc.)

# 2. Back-end (API)
cd apps/api
npm install
npm run prisma:generate      # npx prisma generate (utilise la version locale ^5)
npx prisma migrate dev --name init
npx prisma db seed          # ← génère 25 profils fictifs + comptes démo
npm run start:dev
# → http://localhost:3001
# → Swagger : http://localhost:3001/api/docs

# 3. Front-end (web)
cd apps/web
npm install
npm run dev
# → http://localhost:5173

# 4. Admin
cd apps/admin
npm install
npm run dev
# → http://localhost:5174

# 5. Tout via Docker
docker-compose up --build
```

## Comptes de démonstration (après seed)

| Rôle | Email | Mot de passe |
|---|---|---|
| Visiteur | demo@zelya.demo | Demo1234! |
| Admin | admin@zelya.demo | Admin1234! |
| Créateur | léa.paris@zelya.demo | Demo1234! |
| Créateur | sofia.lyon@zelya.demo | Demo1234! |
| … | `<alias.lower>@zelya.demo` | Demo1234! |

## Ce qui a été implémenté (maquette fonctionnelle)

- ✅ **Seed de données** : 25 profils fictifs + admin + visiteur démo (`npx prisma db seed`)
- ✅ **Couche API cliente** : `apps/web/src/lib/api.ts` — axios avec refresh token automatique (intercepteur 401), gestion CORS
- ✅ **Authentification complète** : `AuthContext` — inscription wizard 3 étapes → POST /auth/register → JWT stocké → redirection `/espace`
- ✅ **Connexion fonctionnelle** : POST /auth/login → tokens → état global React Context
- ✅ **Refresh token automatique** : intercepteur axios sur 401, queue des requêtes en attente
- ✅ **Routes protégées** : `ProtectedRoute` sur `/espace` et `/messages` (garde côté frontend)
- ✅ **Consentements RGPD** : cases CGU + confidentialité obligatoires à l'inscription (étape 3 du wizard)
- ✅ **Listing profils** : filtres sidebar (genre, statut, type, âge), tri, pagination — API réelle
- ✅ **Détail profil** : photos, tags, bio, avis, profils similaires — API réelle
- ✅ **Recherche** : full-text sur alias/ville/région/département — API réelle
- ✅ **Pages en-ligne / nouveaux** : filtrées depuis l'API
- ✅ **Dashboard** : favoris récupérés depuis l'API
- ✅ **HomePage** : 3 sections de profils depuis l'API (en ligne, récents, populaires)
- ✅ **Design tokens** : zéro token `zelya-*` résiduel, tout en `z.*`
- ✅ **Loading states** : skeletons sur toutes les pages API
- ✅ **Error states** : messages d'erreur soignés sur toutes les pages API
- ✅ **CORS** : configuré `FRONTEND_URL` → localhost:5173

## TODOs bloquants avant production

### ❌ Légal / Conformité
- [ ] Faire valider les pages CGU, Confidentialité, Mentions légales par un juriste spécialisé numérique
- [ ] Désigner un DPO (délégué à la protection des données) — cnil.fr
- [ ] Mettre en place la vérification d'âge certifiée ARCOM (Yoti, IDnow, VerifyMy)
- [ ] Implémenter la procédure de retrait LCEN (contenu illicite)
- [ ] Valider statut juridique (SAS, SASU…) et immatriculation

### ❌ Paiement
- [ ] Choisir un PSP compatible adulte : CCBill, Segpay, Epoch
- [ ] Implémenter KYC créateurs (vérification identité + âge)
- [ ] Rédiger et faire valider les CGV
- [ ] Tester en sandbox avant tout paiement réel

### ❌ Stockage médias
- [ ] Configurer Cloudflare R2 ou AWS S3
  - Renseigner S3_BUCKET, S3_REGION, S3_ACCESS_KEY, S3_SECRET_KEY dans .env
- [ ] Implémenter `getPresignedUploadUrl()` dans media.service.ts
- [ ] Pipeline de modération : vérification âge + consentement avant approbation

### ❌ WebSocket (Messages)
- [ ] Remplacer l'auth query param par JWT sur handshake WS dans messages.gateway.ts
- [ ] Configurer Redis adapter pour le scaling multi-instance

### ⚠️ Back-end à compléter
- [ ] Endpoint admin stats (GET /admin/stats) pour le dashboard
- [ ] Endpoint GET /media/pending pour la modération
- [ ] Email transactionnel (inscription, reset mot de passe) — SendGrid, Brevo
- [ ] Vérification email à l'inscription

### ⚠️ Tests
- [ ] Tests unitaires (Jest) sur les services critiques : auth, profiles, reports
- [ ] Tests e2e (Supertest) sur les endpoints API
- [ ] Tests front-end (Vitest + Testing Library)

### ⚠️ Sécurité
- [ ] Audit de sécurité avant mise en production
- [ ] Rate limiting par IP sur l'endpoint register (anti-spam)
- [ ] Headers HSTS en production (nginx)
- [ ] Rotation des secrets JWT si compromise

## Architecture actuelle

```
zelya/
├── apps/
│   ├── web/          React 18 + Vite + TypeScript + Tailwind (port 5173)
│   ├── api/          NestJS 10 + Prisma 5 + PostgreSQL (port 3001)
│   └── admin/        React 18 + Vite + TypeScript (port 5174)
├── docs/
│   ├── reference-analysis.md
│   ├── wireframe.md
│   └── NEXT_STEPS.md  ← ce fichier
├── docker-compose.yml
└── .env.example
```
