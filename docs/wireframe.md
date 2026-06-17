# Wireframe Zelya — v1

> Maquette descriptive de toutes les pages de la plateforme Zelya.
> Ces descriptions servent de base au développement front-end statique.
> **Aucun développement complet ne doit démarrer avant validation humaine de ce wireframe.**

---

## Identité visuelle Zelya

**Nom :** Zelya  
**Positionnement :** Plateforme adulte premium, légale, sécurisée, marché France/UE  
**Palette (proposition)** :
- Primaire : `#1A1A2E` (bleu nuit profond)
- Accent : `#E94560` (rose corail premium)
- Surface : `#16213E` (bleu marine sombre)
- Texte principal : `#EAEAEA`
- Texte secondaire : `#9CA3AF`
- Succès : `#10B981`
- Fond card : `#0F3460`

**Typographie :**
- Headings : Inter ou Sora (sans-serif moderne)
- Body : Inter
- Monospace (code, badges) : JetBrains Mono

**Ton :** Sobre, professionnel, premium. Aucun terme sexuellement explicite dans l'interface.

---

## Page 0 — Vérification d'âge (Age Gate)

> **Affichée en premier, avant tout accès au site.**

### Layout
```
┌─────────────────────────────────────────────┐
│                  [Logo Zelya]                │
│                                             │
│         Accès réservé aux adultes           │
│                                             │
│  Ce site contient des contenus réservés     │
│  aux personnes majeures (18 ans et plus).   │
│  En accédant à ce site, vous certifiez :    │
│                                             │
│  • Avoir 18 ans ou plus                     │
│  • Accepter les conditions d'utilisation    │
│  • Comprendre la nature du contenu          │
│                                             │
│  [ J'ai 18 ans ou plus — Entrer ]           │
│  [ Quitter le site ]                        │
│                                             │
│  ⚠️  Si vous êtes mineur, quittez ce site   │
│  immédiatement.                             │
│                                             │
│  Liens : Mentions légales | Confidentialité │
│          CGU | Contact                      │
└─────────────────────────────────────────────┘
```

### Comportement
- Plein écran, bloquant (pas de scroll possible derrière)
- Cookie de session enregistré après confirmation (pas de re-demande dans la session)
- Pas de cookie persistant (re-demande à chaque nouvelle visite ou session)
- TODO : remplacer ce mécanisme par une vérification d'âge certifiée conforme ARCOM en production

---

## Page 1 — Accueil (Home)

### Sections dans l'ordre

**1. Hero**
```
┌─────────────────────────────────────────────┐
│ [Header]                                    │
│                                             │
│  Découvrez des profils premium              │
│  sur Zelya                                  │
│                                             │
│  [Barre de recherche rapide]                │
│  Ville / Région / Mot-clé    [Rechercher]   │
│                                             │
│  Filtres rapides : Tous | En ligne | Nouveaux│
└─────────────────────────────────────────────┘
```

**2. Sélection géographique**
```
┌─────────────────────────────────────────────┐
│  Trouver près de vous                       │
│                                             │
│  [Onglets : Villes | Départements]          │
│                                             │
│  Paris (XXX) | Lyon (XXX) | Marseille (XXX) │
│  Toulouse (XXX) | Nice (XXX) | Bordeaux...  │
│                                             │
│  [Voir toutes les villes →]                 │
└─────────────────────────────────────────────┘
```

**3. Profils vedettes / En ligne**
```
┌─────────────────────────────────────────────┐
│  Profils en ligne maintenant                │
│                                             │
│  [Card] [Card] [Card] [Card]  ← scroll      │
│                                             │
│  [Voir tous les profils →]                  │
└─────────────────────────────────────────────┘
```

**4. Profils récents**
```
┌─────────────────────────────────────────────┐
│  Nouveaux profils                           │
│                                             │
│  [Card] [Card] [Card] [Card] [Card] [Card]  │
│                                             │
│  [Voir plus →]                              │
└─────────────────────────────────────────────┘
```

**5. Bannière conformité**
```
┌─────────────────────────────────────────────┐
│  🔒 Zelya s'engage pour votre sécurité      │
│                                             │
│  Profils vérifiés | Signalement facile      │
│  Données protégées | Modération active      │
└─────────────────────────────────────────────┘
```

**6. Footer**
(voir section Footer ci-dessous)

---

## Page 2 — Listing / Profils

### URL pattern : `/profils/` ou `/profils/{ville}/`

### Layout
```
┌────────────────────────────────────────────────┐
│ [Header]                                       │
├────────────┬───────────────────────────────────┤
│            │                                   │
│  FILTRES   │  GRILLE DE PROFILS                │
│  (sidebar) │                                   │
│            │  [Card][Card][Card]               │
│  Genre     │  [Card][Card][Card]               │
│  Ville     │  [Card][Card][Card]               │
│  Statut    │                                   │
│  Type      │  [Pagination]                     │
│  Âge       │                                   │
│            │                                   │
│  [Appliquer│                                   │
│   filtres] │                                   │
└────────────┴───────────────────────────────────┘
```

### Sidebar filtres
- **Genre** : Toutes | Femmes | Hommes | Couples | Trans
- **Statut** : Tous | En ligne | Disponible aujourd'hui
- **Type** : Standard | Premium | Vérifié
- **Ville** : Sélecteur avec recherche
- **Âge** : Range slider (18–65+)
- **Tri** : Plus récents | Populaires | En ligne d'abord

### Carte profil (Card)
```
┌──────────────────┐
│  [Photo/Avatar]  │
│  ● En ligne      │
│  [Badge PREMIUM] │
├──────────────────┤
│  Prénom, 28 ans  │
│  Paris (75)      │
│  ★★★★☆ (42)     │
│  [Voir le profil]│
└──────────────────┘
```

---

## Page 3 — Fiche profil

### URL pattern : `/profil/{id}/`

### Layout
```
┌─────────────────────────────────────────────────┐
│ [Header]                                        │
├─────────────────────────────────────────────────┤
│                                                 │
│  [Photo principale]  │  Prénom, 28 ans          │
│                      │  📍 Paris (75)           │
│  [Photo 2] [Photo 3] │  ● En ligne              │
│                      │  [Badge Vérifié]         │
│                      │                          │
│                      │  ★★★★☆  42 avis          │
│                      │                          │
│                      │  [Contacter]             │
│                      │  [Ajouter aux favoris]   │
│                      │  [Signaler ce profil]    │
├─────────────────────────────────────────────────┤
│                                                 │
│  À propos                                       │
│  [Texte de présentation libre — placeholder]    │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  Informations                                   │
│  Disponibilité : [jours/horaires]               │
│  Type de rencontre : [catégorie]                │
│  Langues : Français, Anglais                    │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  Avis (42)                                      │
│  [Liste des commentaires avec note]             │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  Profils similaires                             │
│  [Card] [Card] [Card]                           │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Éléments de conformité sur la fiche
- Bouton "Signaler ce profil" toujours visible
- Date de dernière connexion affichée
- Mentions légales en bas de fiche
- Pas de numéros de téléphone affichés en clair (masquage)

---

## Page 4 — Recherche / Filtres

### URL pattern : `/recherche/`

### Layout
```
┌─────────────────────────────────────────────────┐
│ [Header]                                        │
├─────────────────────────────────────────────────┤
│                                                 │
│  Rechercher un profil                           │
│                                                 │
│  [Champ texte : prénom, ville, mot-clé...]      │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │  FILTRES AVANCÉS                        │   │
│  │                                         │   │
│  │  Genre      [●Tous ○Femmes ○Hommes...]  │   │
│  │  Ville      [Sélecteur]                 │   │
│  │  Département[Sélecteur]                 │   │
│  │  Statut     [●Tous ○En ligne]           │   │
│  │  Type       [●Tous ○Vérifié ○Premium]  │   │
│  │  Âge min.   [18] — Âge max. [65+]      │   │
│  │  Disponible [Sélecteur jour/horaire]    │   │
│  │                                         │   │
│  │  [Rechercher]  [Réinitialiser]          │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  Résultats (XXX profils trouvés)                │
│  Tri : [Plus récents ▼]                         │
│                                                 │
│  [Card][Card][Card]                             │
│  [Card][Card][Card]                             │
│                                                 │
│  [Pagination]                                   │
└─────────────────────────────────────────────────┘
```

---

## Page 5 — Inscription / Connexion

### Page Connexion
```
┌─────────────────────────────────────────────────┐
│ [Header minimal]                                │
│                                                 │
│         Se connecter à Zelya                   │
│                                                 │
│  Email ou pseudo                                │
│  [____________________________]                 │
│                                                 │
│  Mot de passe                                   │
│  [____________________________] 👁              │
│                                                 │
│  [ ] Se souvenir de moi                         │
│  [Mot de passe oublié ?]                        │
│                                                 │
│  [Se connecter]                                 │
│                                                 │
│  ─────────── ou ───────────                     │
│                                                 │
│  Pas encore de compte ?                         │
│  [Créer un compte]                              │
└─────────────────────────────────────────────────┘
```

### Page Inscription (en 3 étapes)

**Étape 1 — Informations de base**
```
┌─────────────────────────────────────────────────┐
│  Créer un compte Zelya                          │
│  Étape 1/3 : Votre profil                       │
│                                                 │
│  Je suis : [○ Visiteur  ○ Créateur/Professionnel]│
│                                                 │
│  Pseudo *                                       │
│  [____________________________]                 │
│                                                 │
│  Email *                                        │
│  [____________________________]                 │
│                                                 │
│  Mot de passe *                                 │
│  [____________________________]                 │
│                                                 │
│  Confirmer le mot de passe *                    │
│  [____________________________]                 │
│                                                 │
│  [Suivant →]                                    │
└─────────────────────────────────────────────────┘
```

**Étape 2 — Vérification d'âge**
```
┌─────────────────────────────────────────────────┐
│  Étape 2/3 : Confirmation de majorité           │
│                                                 │
│  Date de naissance *                            │
│  [JJ] / [MM] / [AAAA]                          │
│                                                 │
│  ⚠️ Vous devez avoir 18 ans ou plus pour        │
│  utiliser Zelya. Cette information sera         │
│  vérifiée.                                      │
│                                                 │
│  TODO: Intégrer un système de vérification      │
│  d'âge certifié conforme ARCOM avant            │
│  mise en production.                            │
│                                                 │
│  [← Précédent]  [Suivant →]                    │
└─────────────────────────────────────────────────┘
```

**Étape 3 — Consentements**
```
┌─────────────────────────────────────────────────┐
│  Étape 3/3 : Consentements                      │
│                                                 │
│  [✓] J'ai lu et j'accepte les CGU *            │
│  [✓] J'ai lu la politique de confidentialité * │
│  [ ] J'accepte de recevoir des communications  │
│      de Zelya (optionnel)                       │
│                                                 │
│  En créant un compte, vous confirmez avoir     │
│  18 ans ou plus et accepter notre politique     │
│  de modération.                                 │
│                                                 │
│  [← Précédent]  [Créer mon compte]             │
└─────────────────────────────────────────────────┘
```

---

## Page 6 — Espace utilisateur (Dashboard visiteur)

```
┌─────────────────────────────────────────────────┐
│ [Header avec avatar utilisateur]                │
├────────────┬────────────────────────────────────┤
│            │                                    │
│  MENU      │  Tableau de bord                   │
│            │                                    │
│  Dashboard │  Bonjour, [Pseudo] 👋              │
│  Favoris   │                                    │
│  Messages  │  [Favoris récents]                 │
│  Historique│  [Card][Card][Card]                │
│  Paramètres│                                    │
│  Se déconn.│  [Activité récente]                │
│            │                                    │
│            │  [Paramètres du compte]            │
│            │  Email | Mot de passe | Supprimer  │
└────────────┴────────────────────────────────────┘
```

---

## Page 7 — Espace créateur / Professionnel

```
┌─────────────────────────────────────────────────┐
│ [Header]                                        │
├────────────┬────────────────────────────────────┤
│            │                                    │
│  MENU      │  Mon espace créateur               │
│            │                                    │
│  Mon profil│  Statut : [Actif / En attente]     │
│  Mes photos│                                    │
│  Mes stats │  📊 Statistiques                   │
│  Mes avis  │  Vues : XXX | Favoris : XX         │
│  Paramètres│  Contacts : XX ce mois             │
│  Se déconn.│                                    │
│            │  🖊 Modifier mon profil             │
│            │                                    │
│            │  📷 Gérer mes photos               │
│            │  [Upload] [Modifier] [Supprimer]   │
│            │                                    │
│            │  ⭐ Mes avis (XX)                  │
│            │  [Liste des commentaires reçus]    │
│            │                                    │
│            │  TODO: Monétisation à activer      │
│            │  après validation légale/bancaire  │
└────────────┴────────────────────────────────────┘
```

---

## Page 8 — Mentions légales

```
┌─────────────────────────────────────────────────┐
│ [Header]                                        │
├─────────────────────────────────────────────────┤
│                                                 │
│  Mentions légales                               │
│                                                 │
│  Éditeur du site                                │
│  [Raison sociale — À compléter]                 │
│  [Adresse — À compléter]                        │
│  [SIRET — À compléter]                          │
│  [Directeur de publication — À compléter]       │
│                                                 │
│  Hébergeur                                      │
│  [Nom de l'hébergeur — À compléter]             │
│  [Adresse — À compléter]                        │
│                                                 │
│  Propriété intellectuelle                       │
│  [Texte placeholder]                            │
│                                                 │
│  Limitation de responsabilité                   │
│  [Texte placeholder]                            │
│                                                 │
│  Droit applicable                               │
│  [Texte placeholder — droit français]           │
│                                                 │
│  TODO: Faire rédiger par un avocat spécialisé  │
│  avant mise en production.                      │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## Page 9 — Politique de confidentialité

```
┌─────────────────────────────────────────────────┐
│ [Header]                                        │
├─────────────────────────────────────────────────┤
│                                                 │
│  Politique de confidentialité                   │
│                                                 │
│  Conformité RGPD                                │
│  [Texte placeholder]                            │
│                                                 │
│  Données collectées                             │
│  [Texte placeholder]                            │
│                                                 │
│  Durée de conservation                          │
│  [Texte placeholder]                            │
│                                                 │
│  Vos droits (accès, rectification, suppression) │
│  [Texte placeholder]                            │
│                                                 │
│  Cookies                                        │
│  [Texte placeholder]                            │
│                                                 │
│  Contact DPO                                    │
│  [Email — À compléter]                          │
│                                                 │
│  TODO: Faire rédiger par un DPO certifié avant │
│  mise en production. Déposer un registre de    │
│  traitements conforme CNIL.                     │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## Page 10 — Contact / Signalement

```
┌─────────────────────────────────────────────────┐
│ [Header]                                        │
├─────────────────────────────────────────────────┤
│                                                 │
│  Contact & Signalement                          │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │  📢 Signaler un contenu                 │   │
│  │                                         │   │
│  │  Profil concerné (ID ou URL)            │   │
│  │  [____________________________]         │   │
│  │                                         │   │
│  │  Motif du signalement *                 │   │
│  │  [○ Contenu illégal                     │   │
│  │   ○ Mineur présumé                      │   │
│  │   ○ Usurpation d'identité               │   │
│  │   ○ Contenu non consenti                │   │
│  │   ○ Harcèlement                         │   │
│  │   ○ Autre]                              │   │
│  │                                         │   │
│  │  Détails (optionnel)                    │   │
│  │  [Zone de texte]                        │   │
│  │                                         │   │
│  │  Votre email (pour suivi)               │   │
│  │  [____________________________]         │   │
│  │                                         │   │
│  │  [Envoyer le signalement]               │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │  ✉️  Nous contacter                     │   │
│  │                                         │   │
│  │  Email : contact@zelya.fr               │   │
│  │  (placeholder — À confirmer)            │   │
│  │                                         │   │
│  │  Délai de réponse : 48h ouvrées         │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  ⚠️  Pour tout contenu impliquant un mineur,   │
│  contactez directement le Ministère de          │
│  l'Intérieur : www.internet-signalement.gouv.fr │
└─────────────────────────────────────────────────┘
```

---

## Composant — Header

```
┌─────────────────────────────────────────────────┐
│  [Logo Zelya]   [Nav principale]   [Se connecter│
│                                    Inscription] │
├─────────────────────────────────────────────────┤
│  Accueil | Profils | Recherche | ...            │
└─────────────────────────────────────────────────┘
```

- Logo à gauche, liens navigation au centre, actions à droite
- Sur mobile : hamburger menu
- Sticky en haut lors du scroll

---

## Composant — Footer

```
┌─────────────────────────────────────────────────┐
│  [Logo Zelya]                                   │
│  La plateforme adulte premium, légale et        │
│  sécurisée pour la France et l'UE.              │
│                                                 │
│  Accès réservé aux personnes majeures (18+)     │
│                                                 │
│  Liens utiles         Légal                     │
│  Accueil              Mentions légales          │
│  Profils              Confidentialité           │
│  Recherche            CGU                       │
│  Contact              CGV                       │
│  Signalement          Cookies                   │
│                                                 │
│  © 2026 Zelya. Tous droits réservés.            │
│  Site réservé aux adultes (18+)                 │
└─────────────────────────────────────────────────┘
```

---

## Composant — Bandeau cookies (CNIL)

```
┌─────────────────────────────────────────────────┐
│  🍪 Nous utilisons des cookies pour améliorer   │
│  votre expérience.                              │
│                                                 │
│  [Tout refuser]  [Personnaliser]  [Accepter]   │
│                                                 │
│  En savoir plus : Politique de confidentialité  │
└─────────────────────────────────────────────────┘
```

---

## Décisions d'architecture front-end

- **Stack** : React + Vite + TypeScript
- **Style** : Tailwind CSS
- **Routing** : React Router v6
- **State** : React Context (authentification simulée) + useState local
- **Données** : fichiers JSON statiques (mock data)
- **Images** : placeholders via `https://placehold.co/` (légal, gratuit)
- **Icônes** : Lucide React
- **Fonts** : Google Fonts (Inter)
- **Pas de backend** en v1 (maquette statique uniquement)

---

## Points à valider avant développement complet

1. **Palette de couleurs** : valider le choix bleu nuit / rose corail
2. **Terminologie** : valider le wording de chaque page (sobre, légal, professionnel)
3. **Structure de navigation** : valider les pages prioritaires v1
4. **Filtres listing** : valider les catégories et leur nomenclature
5. **Champs fiche profil** : valider ce qui est affiché publiquement
6. **Flux inscription** : valider les étapes et les champs obligatoires
7. **Age gate** : valider le mécanisme (cookie session vs autre)
8. **TODO légaux** : identifier un avocat spécialisé pour validation avant production
9. **Statut juridique** : valider la forme juridique avant de continuer (SAS, auto-entrepreneur, autre ?)
10. **Prestataire de paiement adulte** : identifier et valider avant toute monétisation
