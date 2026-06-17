# Zelya — Guide de démarrage

## Prérequis

| Outil | Version minimum | Vérification |
|---|---|---|
| Node.js | 20+ | `node --version` |
| npm | 9+ | `npm --version` |
| Docker Desktop | Dernière | doit être démarré |

## Démarrage en une commande

Depuis la racine du projet, dans **PowerShell** :

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\start.ps1
```

Le script fait automatiquement :
1. Vérifie Docker Desktop (le démarre si besoin)
2. Lance **PostgreSQL** + **Redis** en Docker
3. Attend que la base soit prête (healthcheck)
4. Installe les dépendances manquantes (`npm install`)
5. Crée les tables — **migration Prisma**
6. Injecte **25 profils fictifs** (seed)
7. Injecte **100 profils fictifs** avec photos portrait (randomuser.me)
8. Ouvre 2 terminaux : **API NestJS** + **Frontend React**

### URLs après démarrage

| Service | URL |
|---|---|
| Site web | http://localhost:5173 |
| API REST | http://localhost:3001/api/v1 |
| Swagger (docs API) | http://localhost:3001/api/docs |
| Admin | http://localhost:5174 *(démarrer manuellement)* |

### Comptes de démonstration

| Rôle | Email | Mot de passe |
|---|---|---|
| Visiteur | demo@zelya.demo | Demo1234! |
| Admin | admin@zelya.demo | Admin1234! |
| Créateur | lea.paris@zelya.demo | Demo1234! |

> Tous les créateurs suivent le format `<alias.lower>@zelya.demo` / `Demo1234!`  
> Exemples : `sofia.lyon@zelya.demo`, `marco.marseille@zelya.demo`

---

## Démarrage manuel (composant par composant)

### 1. Base de données

```powershell
docker compose up -d postgres redis
```

Attendre que postgres soit `healthy` :

```powershell
docker inspect --format="{{.State.Health.Status}}" zelya_postgres
```

### 2. API NestJS

```powershell
cd apps/api

# Première fois : créer les tables
npx prisma migrate dev --name init

# Peupler la base avec les données de démo
npx prisma db seed

# Démarrer en mode développement (hot reload)
npm run start:dev
```

### 3. Frontend React

```powershell
cd apps/web
npm run dev
```

### 4. Interface Admin (optionnel)

```powershell
cd apps/admin
npm install   # si pas encore fait
npm run dev   # → http://localhost:5174
```

---

## Commandes utiles

```powershell
# Voir les logs de la base de données
docker compose logs -f postgres

# Ouvrir Prisma Studio (interface visuelle de la BDD)
cd apps/api && npx prisma studio

# Réinitialiser la base avec les 100 profils (solution rapide)
.\reseed.ps1

# Réinitialiser manuellement
cd apps/api
npx prisma migrate reset --force   # supprime + recrée + seed automatique

# Arrêter les containers Docker
docker compose down

# Arrêter + supprimer les volumes (reset total BDD)
docker compose down -v
```

---

## Structure des fichiers importants

```
zelya/
├── start.ps1               ← Script de démarrage tout-en-un
├── .env                    ← Variables d'environnement (root, pour Docker)
├── docker-compose.yml      ← Services Docker (postgres, redis, api, web)
├── apps/
│   ├── api/
│   │   ├── .env            ← Variables d'environnement API
│   │   ├── prisma/
│   │   │   ├── schema.prisma   ← Schéma de base de données
│   │   │   └── seed.ts         ← Données de démonstration
│   │   └── src/            ← Code source NestJS
│   ├── web/
│   │   ├── .env            ← VITE_API_URL
│   │   └── src/            ← Code source React
│   └── admin/
│       └── src/            ← Interface de modération
└── docs/
    ├── DEMARRAGE.md        ← Ce fichier
    ├── NEXT_STEPS.md       ← TODOs avant production
    └── wireframe.md        ← Maquettes et specs
```

---

## Variables d'environnement

Copier `.env.example` → `.env` si besoin de personnaliser.

| Variable | Valeur par défaut | Description |
|---|---|---|
| `POSTGRES_PASSWORD` | `zelya_dev_password` | Mot de passe PostgreSQL |
| `REDIS_PASSWORD` | `redis_dev_password` | Mot de passe Redis |
| `JWT_SECRET` | *(dans .env)* | Secret JWT — changer en prod |
| `DATABASE_URL` | `postgresql://zelya:...@localhost:5432/zelya` | Connexion BDD |
| `VITE_API_URL` | `http://localhost:3001/api/v1` | URL de l'API (frontend) |

---

## Résolution de problèmes

### `docker: cannot connect to the Docker daemon`
→ Lancer Docker Desktop et attendre qu'il soit prêt (icône dans la barre système).

### `Error: POSTGRES_PASSWORD required`
→ Vérifier que le fichier `.env` existe à la racine du projet.

### `PrismaClientInitializationError: Can't reach database server`
→ Vérifier que le container postgres tourne :
```powershell
docker ps | grep zelya_postgres
```

### `Port 3001 already in use`
→ Tuer le processus existant :
```powershell
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

### `Port 5173 already in use`
→ Même procédure avec le port 5173.

---

## Notes légales

Ce projet est une **maquette fonctionnelle** en attente de validation juridique.  
Avant toute mise en production :

- ✋ **ARCOM** : vérification d'âge certifiée obligatoire (Yoti, IDnow, VerifyMy)
- ✋ **Paiement** : PSP adulte (CCBill, Segpay) + KYC créateurs
- ✋ **Stockage médias** : configurer S3/Cloudflare R2
- ✋ **Email transactionnel** : SendGrid ou Brevo
- ✋ **Audit juridique** : pages légales à valider par un avocat

Voir `docs/NEXT_STEPS.md` pour la liste complète.
