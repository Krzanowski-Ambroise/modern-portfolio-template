# 🚀 Portfolio Cybersécurité Ultra-Moderne

Un portfolio professionnel spectaculaire développé avec **Next.js 15**, **TypeScript** et **Tailwind CSS**. Inclut un système complet de gestion de documents, diplômes et projets avec interface d'administration.

> **Développé avec ❤️ et Claude AI** en mode **VibeCoding** - Une approche collaborative entre humain et IA pour créer des solutions innovantes.

## 📸 Aperçu du Projet

### 🏠 Page d'Accueil
![Page d'Accueil](gitimg/exemple_accueil.png)
*Interface moderne avec animations et effets visuels*

### 🔐 Interface d'Administration
![Dashboard Admin](gitimg/exemple_dashboard.png)
*Gestionnaire de documents avec navigation par dossiers*

## ✨ Fonctionnalités

### Interface Publique
Interface moderne inspirée d'Apple avec effets glassmorphism, animations fluides grâce à Framer Motion, et design responsive optimisé pour tous les appareils. Performance optimale avec images optimisées, lazy loading, et effets visuels spectaculaires (background animé, particules, effets de glitch).

### Interface d'Administration
Gestionnaire de documents complet avec navigation par dossiers, upload drag & drop, et sélection multiple. Système de gestion des diplômes avec CRUD complet et synchronisation automatique. Gestion des projets avec images et technologies associées. Sécurité renforcée avec dossiers protégés et authentification JWT, le tout optimisé par un système de cache intelligent.

## 🎨 Palette de Couleurs

| Couleur | Code | Usage |
|---------|------|-------|
| **Fond principal** | `#000000` | Background de base |
| **Cyan** | `#00D4FF` | Accents primaires |
| **Violet** | `#B794F6` | Accents secondaires |
| **Pink** | `#F093FB` | Accents tertiaires |
| **Blanc** | `#FFFFFF` | Texte principal |
| **Gris** | `#A1A1AA` | Texte secondaire |

> **Effets glassmorphism** : `rgba(255,255,255,0.08)` + `blur(14px)` pour un rendu moderne et élégant

## 🛠️ Stack Technique

- **Framework** : Next.js 15 (App Router)
- **Language** : TypeScript
- **Styling** : Tailwind CSS
- **Animations** : Framer Motion
- **Icônes** : Lucide React
- **Base de données** : PostgreSQL
- **Authentification** : JWT
- **Upload** : Multer + File System

## 📁 Structure du Projet

```
portfolio/
├── app/
│   ├── admin/                    # Interface d'administration
│   │   └── page.tsx
│   ├── api/                      # API Routes
│   │   ├── auth/                 # Authentification
│   │   ├── documents/            # Gestion des documents
│   │   ├── diplomas/             # Gestion des diplômes
│   │   ├── projects/             # Gestion des projets
│   │   ├── technologies/         # Gestion des technologies
│   │   └── profile/              # Profil utilisateur
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   ├── projets/
│   └── contact/
├── components/
│   ├── admin/                    # Composants d'administration
│   │   ├── DocumentManager.tsx   # Gestionnaire de documents
│   │   ├── ProfileManager.tsx    # Gestion du profil
│   │   ├── FeaturedProjectsManager.tsx
│   │   └── AdminSidebar.tsx
│   ├── sections/                 # Sections de la page d'accueil
│   ├── ui/                       # Composants UI réutilisables
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   └── ...
├── lib/
│   ├── database-postgres.ts      # Configuration PostgreSQL
│   ├── auth.ts                   # Authentification
│   ├── analytics.ts              # Analytics
│   └── utils.ts
├── contexts/
│   ├── NotificationContext.tsx   # Système de notifications
│   └── ProfileContext.tsx        # Contexte du profil
├── hooks/
│   └── useAnalytics.ts           # Hook pour les analytics
├── scripts/                      # Scripts d'initialisation
│   ├── init-postgres-simple.cjs
│   ├── sync-diplomas-to-documents.cjs
│   └── ...
├── public/
│   ├── cv/                       # Fichiers CV
│   ├── diplomas/                 # Fichiers de diplômes
│   ├── mes-documents/             # Documents généraux
│   └── downloads/               # Fichiers téléchargeables
└── README.md
```

## 🚀 Installation Rapide

### 1. **Prérequis**
- Node.js 18+ 
- PostgreSQL 12+

### 2. **Installation**
```bash
# Cloner et installer
git clone https://github.com/Krzanowski-Ambroise/modern-portfolio-template.git
cd modern-portfolio-template
npm install

# Configurer la base de données
createdb portfolio
cp .env.example .env.local
# Éditer .env.local avec vos propres valeurs (voir ci-dessous)

# Initialiser la DB (Node.js 20.6+ pour --env-file)
node --env-file=.env.local scripts/init-postgres-simple.cjs

# Lancer le serveur
npm run dev
```

### 3. **Configuration**
Aucun identifiant n'est écrit dans le code : tout se lit depuis l'environnement. Copiez `.env.example` vers `.env.local` (ignoré par git) et renseignez :

| Variable | Rôle | Défaut |
|----------|------|--------|
| `PGHOST` / `PGPORT` / `PGDATABASE` | Serveur, port et nom de la base | `localhost` / `5432` / `portfolio` |
| `PGUSER` / `PGPASSWORD` | Vos identifiants PostgreSQL | — |
| `JWT_SECRET` | Secret de signature des tokens admin (longue chaîne aléatoire) | — |
| `ADMIN_PASSWORD` | Mot de passe du compte `admin`, utilisé à sa création | — |

Next.js charge `.env.local` automatiquement ; les scripts le lisent avec `node --env-file=.env.local scripts/<script>.cjs`. Le compte `admin` est créé à l'initialisation avec `ADMIN_PASSWORD` s'il n'existe pas encore ; pour changer son mot de passe, voir [README-POSTGRES.md](README-POSTGRES.md#changer-le-mot-de-passe-admin).

### 4. **Accès**
- **Portfolio** : http://localhost:3000
- **Admin** : http://localhost:3000/admin (utilisateur `admin`, mot de passe défini par `ADMIN_PASSWORD`)

## 📱 Pages Disponibles

### Interface Publique
- **/** : Page d'accueil avec hero, compétences et projets
- **/projets** : Galerie interactive des projets
- **/contact** : Formulaire de contact animé

### Interface d'Administration
- **/admin** : Dashboard principal
  - Gestionnaire de documents avec navigation par dossiers
  - Gestion des diplômes et synchronisation automatique
  - Gestion des projets avec upload d'images
  - Gestion des technologies et compétences
  - Gestion du profil utilisateur

## 🖼️ Captures d'Écran

### Page d'Accueil
Interface moderne avec hero section animée, affichage des technologies maîtrisées, galerie interactive des réalisations, et formulaire de contact animé avec validation.

### Interface d'Administration
Dashboard avec navigation intuitive (breadcrumb et bouton de retour), gestion de fichiers (upload drag & drop, sélection multiple), dossiers sécurisés pour la protection des documents sensibles, et synchronisation automatique des diplômes.

## 🔐 Système d'Authentification

Accès admin via `/admin` avec authentification JWT et session persistante. Protection des routes sensibles avec dossiers sécurisés (🔒) pour accès restreint, fichiers protégés en téléchargement uniquement, et actions conditionnelles selon les permissions.

## 📊 Gestionnaire de Documents

Navigation par dossiers avec interface type explorateur de fichiers, upload drag & drop, sélection multiple pour actions en masse, recherche et filtrage avancés, breadcrumb navigation claire, et cache intelligent pour des performances optimales.

**Structure** : Mes Documents (racine) → Mes CV (sécurisé) + Mes Diplômes (sécurisé) avec sous-dossiers par diplôme, plus documents généraux. Support des formats PDF, DOC, DOCX, TXT, PNG, JPG, JPEG, GIF, SVG.

## 🎓 Gestion des Diplômes

Synchronisation automatique avec création de dossiers pour chaque diplôme, nommage intelligent `[Titre] - [Date]`, association de tous les fichiers liés, et bouton "Sync Diplômes" dans le dossier "Mes Diplômes". Interface de gestion complète avec CRUD, upload multiple de fichiers par diplôme, métadonnées (titre, date, description), et prévisualisation des fichiers.

## 🚀 Gestion des Projets

Galerie interactive avec filtres, upload d'images de couverture et galeries, technologies associées avec tags et compétences, gestion des statuts (en cours, terminés, archivés), et liens externes (GitHub, démo, documentation). Interface admin complète avec CRUD intuitif, upload drag & drop pour les images, gestion des technologies, et prévisualisation en temps réel.

## 🎯 Composants UI

### Composants de Base
- `Button` : Boutons avec animations
- `Card` : Cartes avec effets glassmorphism
- `Input` : Champs de saisie stylisés
- `Modal` : Modales avec animations
- `Notification` : Système de notifications

### Composants Avancés
- `AnimatedCounter` : Compteurs animés
- `Typewriter` : Effet machine à écrire
- `GlitchText` : Texte avec effet glitch
- `ParticleField` : Champ de particules animées
- `MatrixRain` : Effet pluie de code Matrix

### Composants Admin
- `DocumentManager` : Gestionnaire de documents complet
- `ProfileManager` : Gestion du profil utilisateur
- `FeaturedProjectsManager` : Gestion des projets mis en avant
- `AdminSidebar` : Navigation d'administration

## 🎨 Personnalisation

### Couleurs
Modifiez les couleurs dans `tailwind.config.js` :

```javascript
colors: {
  primary: {
    cyan: '#00D4FF',
    violet: '#B794F6',
    pink: '#F093FB',
  },
  background: '#000000',
  text: {
    primary: '#FFFFFF',
    secondary: '#A1A1AA',
  }
}
```

### Base de Données
Structure des tables principales :
- `profiles` : Informations utilisateur
- `projects` : Projets et métadonnées
- `technologies` : Technologies et compétences
- `diplomas` : Diplômes et certifications
- `diploma_files` : Fichiers associés aux diplômes
- `document_folders` : Structure des dossiers
- `documents` : Fichiers et métadonnées
- `cv_files` : Gestion des CV

## 📊 Performance

- **Images optimisées** avec Next.js Image
- **Lazy loading** des composants
- **Animations GPU-accelerated**
- **Code splitting** automatique
- **Bundle optimization**
- **Cache intelligent** pour les documents
- **Pagination** pour les grandes listes

## 🔧 Scripts Disponibles

```bash
# Développement
npm run dev              # Serveur de développement
npm run build           # Build de production
npm run start           # Serveur de production
npm run lint            # Linting du code

# Base de données (connexion lue depuis .env.local)
node --env-file=.env.local scripts/init-postgres-simple.cjs        # Initialiser la DB
node --env-file=.env.local scripts/sync-diplomas-to-documents.cjs  # Sync diplômes
node --env-file=.env.local scripts/cleanup-diploma-folders.cjs     # Nettoyer les dossiers
```

## 🚀 Déploiement

### Vercel (Recommandé)
```bash
npm run build
vercel --prod
```

### Variables d'environnement de production
Définissez dans votre hébergeur les mêmes variables que `.env.example` (`PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, `PGPASSWORD`, `JWT_SECRET`, et `ADMIN_PASSWORD` le temps de créer le compte admin), avec des valeurs propres à la production, jamais commitées.

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🔒 Sécurité

### Authentification
- **JWT Tokens** : Authentification sécurisée
- **Sessions persistantes** : Connexion maintenue
- **Protection des routes** : Middleware d'authentification

### Gestion des Fichiers
- **Validation des types** : Types de fichiers autorisés
- **Taille limitée** : Limitation de la taille des uploads
- **Scan de sécurité** : Vérification des fichiers uploadés
- **Dossiers protégés** : Accès restreint aux dossiers sensibles

## 📝 Utilisation

### Pour les Développeurs
1. **Fork le projet** sur GitHub
2. **Cloner votre fork** localement
3. **Configurer la base de données** PostgreSQL
4. **Installer les dépendances** avec `npm install`
5. **Initialiser la DB** avec les scripts fournis
6. **Lancer le serveur** avec `npm run dev`

### Pour les Utilisateurs
1. **Accéder à l'interface** via `/admin`
2. **Se connecter** avec les identifiants admin
3. **Gérer les documents** dans le gestionnaire
4. **Synchroniser les diplômes** automatiquement
5. **Gérer les projets** et technologies

## 🌟 Fonctionnalités Avancées

### Animations
- **Parallax scrolling** : Effet de profondeur
- **Mouse follower effect** : Suivi de la souris
- **Intersection Observer** : Animations au scroll
- **Stagger animations** : Animations échelonnées
- **Scroll-triggered animations** : Déclenchement au scroll

### Responsive
- **Mobile-first design** : Conception mobile d'abord
- **Breakpoints adaptatifs** : Points de rupture intelligents
- **Grilles flexibles** : Layouts adaptatifs
- **Images responsives** : Images adaptatives

### Accessibilité
- **Navigation au clavier** : Contrôle complet au clavier
- **Contraste optimisé** : Lisibilité maximale
- **ARIA labels** : Descriptions pour lecteurs d'écran
- **Focus management** : Gestion du focus

## 📞 Support

Pour toute question ou support :
- **Documentation** : README complet avec exemples
- **Issues GitHub** : [Créer une issue](https://github.com/username/portfolio/issues)
- **Scripts d'aide** : Scripts d'initialisation inclus

## 📄 Licence

MIT License - Voir le fichier LICENSE pour plus de détails.

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 🤖 Développement Collaboratif

Ce projet a été développé en **collaboration étroite entre humain et IA** :

### VibeCoding avec Claude AI
- **Approche collaborative** : Développement en binôme humain-IA
- **Itération rapide** : Feedback continu et améliorations instantanées
- **Résolution de problèmes** : Solutions innovantes grâce à la collaboration
- **Code quality** : Standards élevés grâce à l'assistance IA

### Prochaines Évolutions
- **Système de Blog** : Articles sur les découvertes, guides d'installation, tutoriels
- **Système de Connexion** : Authentification utilisateur pour accéder au blog
- **API REST complète** : Endpoints pour intégrations externes
- **Recherche avancée** : Recherche full-text dans les documents et articles
- **Système de rôles** : Multi-utilisateurs avec permissions
- **Analytics** : Statistiques d'utilisation et de performance
- **Collaboration** : Partage de dossiers et articles entre utilisateurs

---

**Développé avec ❤️ par Ambroise Krzanowski**

*Portfolio professionnel avec système de gestion de documents intégré - Créé en collaboration avec Claude AI en mode VibeCoding*