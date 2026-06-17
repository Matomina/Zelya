# Zelya — Plateforme adulte premium

> **Statut : Maquette v1 — En attente de validation humaine**
>
> ⚠️ Ce projet contient des contenus destinés aux adultes (18+). Le développement complet ne démarrera qu'après validation de la maquette et du cadre légal.

---

## Structure du projet

```
zelya/
├── apps/
│   ├── web/          ← Front-end React + Vite + TypeScript (maquette)
│   ├── api/          ← API backend (à créer — FastAPI ou NestJS)
│   └── admin/        ← Interface d'administration (à créer)
├── docs/
│   ├── reference-analysis.md   ← Analyse UX/UI du site de référence
│   └── wireframe.md            ← Maquette descriptive de toutes les pages
├── docker-compose.yml          ← À créer
├── .env.example                ← Variables d'environnement
└── README.md
```

## Démarrage rapide (maquette front)

```bash
cd apps/web
npm install
npm run dev
```

La maquette tourne sur `http://localhost:5173`

## Commandes disponibles

```bash
npm run dev      # Serveur de développement
npm run build    # Build de production
npm run lint     # Vérification ESLint
npm run preview  # Prévisualiser le build de production
```

## Pages de la maquette

| URL | Page |
|-----|------|
| `/` | Accueil |
| `/profils` | Listing des profils |
| `/profil/:id` | Fiche profil |
| `/recherche` | Recherche avancée |
| `/connexion` | Connexion |
| `/inscription` | Inscription (3 étapes) |
| `/espace` | Dashboard utilisateur |
| `/contact` | Contact & Signalement |
| `/mentions-legales` | Mentions légales |
| `/confidentialite` | Politique de confidentialité |
| `/cgu` | CGU |

## Stack technique

- **Front** : React 18 + Vite + TypeScript + Tailwind CSS + React Router v6
- **Données** : JSON statiques (profils fictifs — aucune donnée réelle)
- **Images** : placehold.co (placeholder légal)
- **Icônes** : Lucide React

## Conformité (TODO avant production)

- [ ] Vérification d'âge certifiée ARCOM (remplacer le sessionStorage actuel)
- [ ] Bannière cookies conforme CNIL (audit par DPO)
- [ ] Mentions légales complètes (rédaction avocat)
- [ ] CGU et politique de confidentialité (rédaction avocat + DPO)
- [ ] Registre de traitements RGPD
- [ ] KYC créateurs (prestataire à identifier)
- [ ] Prestataire de paiement adulte (à valider)
- [ ] Déclaration ARCOM
- [ ] Audit de sécurité avant production

## Points à valider avant développement complet

1. Validation de la maquette par le porteur de projet
2. Validation du cadre légal par un professionnel compétent
3. Choix du statut juridique et création de la société
4. Identification du prestataire de paiement
5. Choix de l'hébergeur (conformité RGPD, résilience)
6. Définition de l'architecture API (FastAPI vs NestJS)
