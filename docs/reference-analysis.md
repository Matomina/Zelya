# Analyse du site de référence — UX/UI uniquement

> **Avertissement légal :** Cette analyse est produite exclusivement à des fins d'inspiration UX/UI. Aucun contenu (texte, image, code, profil, marque, nom) n'a été copié ou extrait. L'analyse porte sur la structure, la navigation et les patterns d'interface observables publiquement.

---

## 1. Structure globale

Le site de référence adopte une architecture classique d'annuaires avec plusieurs niveaux :

- **Header fixe** : logo + navigation principale multi-niveaux + sélecteur de langue + compteur de session (timeout)
- **Corps principal** : découpage par zone géographique (villes / départements) + widget chat en ligne + listings de profils vedettes
- **Navigation secondaire** : menu étendu donnant accès aux sections photos, vidéos, classements, annonces, flux en direct
- **Footer** : absent ou très discret (aucune mention légale visible en page d'accueil)

**Ce qui est inspirant :** La clarté de la navigation géographique, la richesse des filtres de catégories, l'indicateur de présence en ligne en temps réel.

**Ce qui doit être évité pour Zelya :** L'absence de page d'avertissement adulte avant accès au contenu, l'absence de bannière RGPD/cookies visible, le footer vide de tout lien légal.

---

## 2. Pages principales identifiées

| Page | URL pattern | Contenu principal |
|---|---|---|
| Accueil | `/` | Sélection géographique + chat en ligne + profils vedettes |
| Listing par ville | `/escorts/{ville}/` | Grille de profils filtrés |
| Listing par département | `/escorts/{dept}/` | Grille de profils filtrés |
| Listing par catégorie | `/profiles/{genre}/` | Femmes / hommes / trans / couples |
| Webcam / en ligne | `/escorts/online/`, `/profiles/webcam/` | Profils disponibles en temps réel |
| Exclusives | `/exclusives/` | Profils "premium" |
| Fiche profil | `/escort/{pseudo}-{id}/` | Détail complet du profil |
| Recherche | `/profiles/search_box/` | Moteur de recherche avec filtres |
| Photos | `/escorts/photos/`, `/escorts/topphotos/`, `/escorts/ratephotos/` | Galeries |
| Vidéos | `/video/` | Contenus vidéo |
| Annonces | `/escort/annonce/` | Format annonce texte |
| Classements | `/top-50-members-choice/`, `/profiles/most_followed/`, `/profiles/loyal/` | Rankings |
| Chat en direct | `/live-feed/`, `/online-in-chat/` | Flux temps réel |
| Connexion | `/users/login/` | Formulaire |
| Inscription | `/users/signup/` | Formulaire |
| Visites de ville | `/city_tours/` | Section dédiée |

---

## 3. Navigation

### Navigation principale (header)
- Accueil
- Nouveaux profils
- Escortes (avec sous-menu webcam)
- Escortes exclusives
- En ligne (avec sous-menu "dans le chat")
- TV/TS
- Homme
- Couples
- Se connecter / Inscription
- Visites de ville
- Sélecteur de langue (FR / EN)

### Navigation secondaire (barre étendue)
- Rechercher
- Photos
- Vidéo
- Top 100 des photos
- Évaluer photos
- Annonces
- Suivi d'escortes
- Fidèles escortes
- Commentaires
- Flux en direct
- Top 50

**Pour Zelya :** La navigation à deux niveaux est pertinente mais devra être simplifiée en v1. Le sélecteur de langue est un bon signal d'accessibilité internationale (à prévoir en v2).

---

## 4. Composants visibles

### Widget géographique
- Onglets : villes / départements / liste / carte
- Liste de villes avec compteurs de profils entre parenthèses
- Villes "populaires" en gras
- Total des profils affiché clairement

### Widget chat en ligne
- Compteur total / escortes / membres
- Liste de pseudonymes avec avatars miniatures en temps réel

### Cartes profil (listing)
- Photo principale (placeholder si aucune image)
- Pseudo/nom
- Ville liée
- Statut : "en ligne" / "déconnecté"
- Âge
- Badge "TOP GIRL"
- Note sous forme d'étoiles (1 à 5)
- Lien optionnel "Regardez ma vidéo"
- Section "Annonces vérifiées"

### Header
- Logo (lien vers accueil)
- Navigation multi-niveaux
- Compteur de session (timeout utilisateur)
- Sélecteur de langue

---

## 5. Filtres et recherche

Filtres identifiés :
- **Genre** : femme, homme, trans/TV-TS, couple
- **Disponibilité** : en ligne, dans le chat, webcam
- **Qualité** : exclusives, top 50, most followed, loyal
- **Géographie** : ville, département, pays (France, Belgique, Luxembourg, Suisse)
- **Type de contenu** : avec vidéo, avec photos
- **Chronologie** : nouveaux profils

**Pour Zelya :** Ces filtres sont pertinents et couvrent bien les besoins. On peut ajouter un filtre par type de service (en préservant un wording neutre et légal), et un filtre par disponibilité horaire.

---

## 6. Fonctionnement des fiches profil

D'après la structure des URLs et les cartes listing, une fiche profil contient :
- Photo(s) principale(s)
- Pseudo / nom de scène
- Localisation (ville + département)
- Statut en ligne
- Âge déclaré
- Badges (TOP GIRL, vérifié)
- Note / classement
- Lien vers vidéo personnelle si disponible
- Probablement : description libre, tarifs, services, coordonnées de contact

**À adapter pour Zelya :** Structurer la fiche profil avec des champs clairs et un wording neutre. Prévoir un champ "services proposés" avec liste fermée et validation manuelle pour éviter les dérives. Ajouter un bouton de signalement visible sur chaque fiche.

---

## 7. CTAs identifiés

- "Regardez ma vidéo" (sur carte profil)
- "Connexion" / "Inscription" (header)
- "Montre tout" (widget chat)
- Liens géographiques cliquables (villes/départements)
- "Toutes les villes..." / "Tous les départements..."
- "Cliquez ici pour voir qui offre des services virtuels" (bannière)

**Pour Zelya :** Les CTAs doivent être sobres, professionnels, non racoleurs. Éviter tout wording promettant une expérience sexuelle. Privilégier des CTAs orientés découverte et contact.

---

## 8. Éléments de réassurance

- Badge "Annonces vérifiées"
- Compteur total des profils actifs
- Indicateur de statut en ligne en temps réel
- Classements (TOP GIRL, top 50, most followed)
- Section "Fidèles escortes" (signal de longévité)

**Pour Zelya :** Prévoir des éléments de réassurance légaux et sécuritaires : badge "Profil vérifié", date de dernière connexion, politique de modération visible, lien vers procédure de signalement.

---

## 9. Ce qui ne doit PAS être copié

- Le code source du site
- Les textes, descriptions, intitulés de catégories
- Les images, photos, logos, bannières
- Les noms de profils, pseudonymes, villes associées
- La base de données de profils
- La marque "Sexemodel" et ses déclinaisons
- Les URLs et structures d'URL internes
- Les systèmes de notation et de classement tels quels

---

## 10. Ce qui sera adapté légalement pour Zelya

| Élément référence | Adaptation Zelya |
|---|---|
| Navigation géographique ville/département | ✅ Reprendre le concept, avec données fictives en maquette |
| Grille de cartes profils | ✅ Design original Zelya, données placeholder |
| Indicateur présence en ligne | ✅ Composant réutilisable, sans données réelles |
| Filtres catégories | ✅ Adapté avec wording neutre et légal |
| Fiche profil structurée | ✅ Champs repensés, bouton signalement intégré |
| Inscription / connexion | ✅ Formulaires originaux, mention KYC à prévoir |
| Section classements | ✅ Concept de mise en avant, algorithme à définir |

---

## 11. Améliorations proposées pour Zelya

### UX/UI
1. **Mobile-first** : le site de référence est partiellement adapté mobile. Zelya doit être pensé mobile en priorité.
2. **Design système cohérent** : palette de couleurs, typographie, composants unifiés dès le départ.
3. **Accessibilité** : niveaux de contraste corrects, navigation clavier, attributs ARIA.
4. **Performance** : lazy loading des images, pagination ou infinite scroll maîtrisé.
5. **UX de recherche** : filtres persistants, recherche textuelle, tri multiple.
6. **Onboarding** : parcours d'inscription guidé, étapes clairement indiquées.

### Légal et conformité (priorité absolue)
1. **Écran de vérification d'âge** obligatoire avant tout accès au contenu.
2. **Bandeau cookies CNIL-compliant** dès la première visite.
3. **Footer complet** : mentions légales, confidentialité, CGU, CGV, contact, signalement.
4. **Bouton de signalement** visible sur chaque profil.
5. **Wording professionnel** : aucun terme sexuellement explicite en dehors des zones réservées aux adultes vérifiés.
6. **TODO :** Faire valider la conformité ARCOM (vérification d'âge) et CNIL (RGPD) par un professionnel avant mise en production.

### Fonctionnalités nouvelles pour Zelya
1. **Système de messagerie sécurisée** entre utilisateurs (à prévoir en architecture mais pas en v1).
2. **Vérification des profils** avec workflow de validation manuelle.
3. **Espace créateur** séparé de l'espace visiteur.
4. **Tableau de bord analytics** pour les créateurs (vues, favoris, contacts).
5. **Système d'abonnement** (architecture à prévoir, implémentation après validation légale et bancaire).

---

## 12. Risques juridiques identifiés

> **TODO LÉGAL — À faire valider par un avocat spécialisé avant toute mise en production**

- [ ] Définition exacte des contenus autorisés sur la plateforme au regard du droit français
- [ ] Obligations ARCOM pour la vérification d'âge sur un site adulte (Décret n°2021-1136 et loi SREN)
- [ ] Qualification juridique de l'activité (plateforme d'annonces ? réseau social adulte ? autre ?)
- [ ] Obligations KYC/AML pour les créateurs monétisant leur contenu
- [ ] Responsabilité éditoriale vs hébergeur (statut LCEN)
- [ ] Compatibilité avec la directive DSA (Digital Services Act) pour les plateformes UGC
- [ ] Conditions d'utilisation des prestataires de paiement adulte
- [ ] Droit à l'image et consentement des personnes figurant sur les profils
- [ ] Conservation et sécurité des données personnelles (RGPD Art. 25, 32, 35)
- [ ] Procédure de retrait de contenu sur signalement (Notice and Takedown)
- [ ] Obligations de déclaration à l'ARCOM pour les plateformes diffusant des contenus pornographiques
