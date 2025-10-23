# Portfolio Cybersécurité Ultra-Moderne

Un portfolio professionnel spectaculaire développé avec **Next.js 15**, **TypeScript** et **Tailwind CSS**. Inclut un système complet de gestion de documents, diplômes et projets avec interface d'administration.

> **Développé avec ❤️ et Claude AI** en mode **VibeCoding** - Une approche collaborative entre humain et IA pour créer des solutions innovantes.

## 📸 Aperçu du Projet

### 🏠 Page d'Accueil
![Page d'Accueil](gitimg/exemple_accueil.png)
*Interface moderne avec animations et effets visuels*

### 🔐 Interface d'Administration
![Dashboard Admin](gitimg/exemple_dashboard.png)
*Gestionnaire de documents avec navigation par dossiers*

## 🚀 Fonctionnalités

### 🌐 Interface Publique
- **🎨 Design Ultra-Moderne** : Interface inspirée d'Apple avec effets glassmorphism
- **⚡ Animations Avancées** : Framer Motion pour des transitions fluides
- **📱 Responsive Design** : Optimisé pour tous les appareils
- **🚀 Performance Optimale** : Images optimisées et lazy loading
- **✨ Effets Visuels** : Background animé, particules, effets de glitch

### 🔐 Interface d'Administration
- **📁 Gestionnaire de Documents** : Navigation par dossiers, upload drag & drop
- **🎓 Gestion des Diplômes** : CRUD complet avec synchronisation automatique
- **🚀 Gestion des Projets** : Images et technologies associées
- **🔒 Sécurité Renforcée** : Dossiers protégés et authentification JWT
- **⚡ Cache Intelligent** : Performance optimisée

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
cp config.example.js .env.local
# Éditer .env.local avec vos paramètres

# Initialiser la DB
node scripts/init-postgres-simple.cjs

# Lancer le serveur
npm run dev
```

### 3. **Accès**
- **Portfolio** : http://localhost:3000
- **Admin** : http://localhost:3000/admin

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

### 🔑 Connexion Admin
- **🌐 Accès** : Via `/admin`
- **🔐 Authentification** : JWT
- **⏰ Session persistante** : Connexion maintenue
- **🛡️ Protection des routes** : Middleware d'authentification

### 🛡️ Gestion des Permissions
- **🔒 Dossiers sécurisés** : Accès restreint
- **📄 Fichiers protégés** : Téléchargement uniquement
- **⚙️ Actions conditionnelles** : Selon les permissions

## 📊 Gestionnaire de Documents

### 🔧 Fonctionnalités Principales
- **📁 Navigation par dossiers** : Interface type explorateur de fichiers
- **⬆️ Upload Drag & Drop** : Glisser-déposer pour uploader
- **☑️ Sélection multiple** : Actions en masse (télécharger, supprimer)
- **🔍 Recherche et filtrage** : Trouver rapidement les fichiers
- **🧭 Breadcrumb navigation** : Navigation claire avec chemin d'accès
- **⚡ Cache intelligent** : Performance optimisée

### 📂 Structure des Dossiers
```
📁 Mes Documents (Racine)
├── 📁 Mes CV (🔒 Sécurisé)
│   └── 📄 CV_Ambroise_Krzanowski.pdf
├── 📁 Mes Diplômes (🔒 Sécurisé)
│   ├── 📁 [Diplôme] - [Date]
│   └── 📁 [Diplôme] - [Date]
└── 📄 Documents généraux
```

### 📄 Types de Fichiers Supportés
- **Documents** : PDF, DOC, DOCX, TXT
- **Images** : PNG, JPG, JPEG, GIF, SVG
- **Archives** : ZIP, RAR (à implémenter)

## 🎓 Gestion des Diplômes

### 🔄 Synchronisation Automatique
- **📁 Création automatique** : Dossier créé pour chaque diplôme
- **🏷️ Nommage intelligent** : `[Titre] - [Date]`
- **📎 Fichiers associés** : Tous les fichiers liés au diplôme
- **🔄 Synchronisation** : Bouton "Sync Diplômes" dans le dossier "Mes Diplômes"

### 🎛️ Interface de Gestion
- **CRUD complet** : Créer, lire, modifier, supprimer
- **⬆️ Upload de fichiers** : Multiple fichiers par diplôme
- **📋 Métadonnées** : Titre, date, description
- **👁️ Prévisualisation** : Aperçu des fichiers

## 🚀 Gestion des Projets

### 🎨 Fonctionnalités
- **🖼️ Galerie interactive** : Affichage des projets avec filtres
- **⬆️ Upload d'images** : Images de couverture et galeries
- **🏷️ Technologies associées** : Tags et compétences
- **📊 Statut** : Projets en cours, terminés, archivés
- **🔗 Liens externes** : GitHub, démo, documentation

### 🎛️ Interface Admin
- **Gestion complète** : CRUD avec interface intuitive
- **⬆️ Upload d'images** : Drag & drop pour les images
- **🏷️ Gestion des technologies** : Association des compétences
- **👁️ Prévisualisation** : Aperçu en temps réel

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

### ⚡ Optimisations
- **🖼️ Images optimisées** avec Next.js Image
- **⏳ Lazy loading** des composants
- **🎬 Animations GPU-accelerated**
- **📦 Code splitting** automatique
- **🔧 Bundle optimization**
- **💾 Cache intelligent** pour les documents
- **📄 Pagination** pour les grandes listes

### 📈 Métriques
- **🚀 First Contentful Paint** : < 1.5s
- **⚡ Largest Contentful Paint** : < 2.5s
- **🎯 Cumulative Layout Shift** : < 0.1
- **📱 Mobile Performance** : Score 90+

## 🔧 Scripts Disponibles

```bash
# Développement
npm run dev              # Serveur de développement
npm run build           # Build de production
npm run start           # Serveur de production
npm run lint            # Linting du code

# Base de données
node scripts/init-postgres-simple.cjs        # Initialiser la DB
node scripts/sync-diplomas-to-documents.cjs  # Sync diplômes
node scripts/cleanup-diploma-folders.cjs     # Nettoyer les dossiers
```

## 🚀 Déploiement

### Vercel (Recommandé)
```bash
npm run build
vercel --prod
```

### Variables d'environnement de production
```env
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET=your_production_secret
```

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

### 🎬 Animations
- **🌊 Parallax scrolling** : Effet de profondeur
- **🖱️ Mouse follower effect** : Suivi de la souris
- **👁️ Intersection Observer** : Animations au scroll
- **🎭 Stagger animations** : Animations échelonnées
- **📜 Scroll-triggered animations** : Déclenchement au scroll

### 📱 Responsive
- **📱 Mobile-first design** : Conception mobile d'abord
- **📏 Breakpoints adaptatifs** : Points de rupture intelligents
- **🔲 Grilles flexibles** : Layouts adaptatifs
- **🖼️ Images responsives** : Images adaptatives

### ♿ Accessibilité
- **⌨️ Navigation au clavier** : Contrôle complet au clavier
- **🎨 Contraste optimisé** : Lisibilité maximale
- **🏷️ ARIA labels** : Descriptions pour lecteurs d'écran
- **🎯 Focus management** : Gestion du focus

## 📞 Support

Pour toute question ou support :
- **Documentation** : README complet avec exemples
- **Issues GitHub** : [Créer une issue](https://github.com/username/portfolio/issues)
- **Scripts d'aide** : Scripts d'initialisation inclus

## 📝 Licence

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

### 🧠 **VibeCoding avec Claude AI**
- **Approche collaborative** : Développement en binôme humain-IA
- **Itération rapide** : Feedback continu et améliorations instantanées
- **Résolution de problèmes** : Solutions innovantes grâce à la collaboration
- **Code quality** : Standards élevés grâce à l'assistance IA

### 🎯 **Prochaines Évolutions**
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