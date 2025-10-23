Parfait 💪 Voici à nouveau **le fichier complet `README.md`**, formaté pour GitHub, 100 % copiable-collable, sans coupure ni bug.
Il exploite **tout le potentiel du Markdown** (badges, alignement HTML, table des matières cliquable, emojis, séparateurs, blocs de code, etc.).

---

````markdown
<!-- TITLE -->
<h1 align="center">⚡ Portfolio Cybersécurité Ultra-Moderne ⚡</h1>

<p align="center">
  <em>Un portfolio professionnel nouvelle génération pour présenter vos projets, diplômes et compétences en cybersécurité.</em>
</p>

<p align="center">
  <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js" alt="Next.js"></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript" alt="TypeScript"></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/TailwindCSS-3-38B2AC?style=for-the-badge&logo=tailwindcss" alt="TailwindCSS"></a>
  <a href="https://www.postgresql.org/"><img src="https://img.shields.io/badge/PostgreSQL-15-336791?style=for-the-badge&logo=postgresql" alt="PostgreSQL"></a>
  <a href="https://framer.com/motion"><img src="https://img.shields.io/badge/Framer_Motion-Animations-0055FF?style=for-the-badge&logo=framer" alt="Framer Motion"></a>
</p>

---

> 🧠 **Développé avec ❤️ et Claude AI** en mode **VibeCoding** — une collaboration humain + IA pour créer une expérience élégante et performante.

---

## 🧭 Table des Matières

- [🎯 Aperçu](#-aperçu)
- [🚀 Fonctionnalités](#-fonctionnalités)
- [🎨 Design & Couleurs](#-design--couleurs)
- [🛠️ Stack Technique](#️-stack-technique)
- [📁 Structure du Projet](#-structure-du-projet)
- [⚡ Installation Rapide](#-installation-rapide)
- [📂 Pages Principales](#-pages-principales)
- [🔐 Authentification & Sécurité](#-authentification--sécurité)
- [🎓 Gestion des Diplômes](#-gestion-des-diplômes)
- [🗂️ Gestionnaire de Documents](#️-gestionnaire-de-documents)
- [🖼️ Gestion des Projets](#-gestion-des-projets)
- [🧩 Composants UI](#-composants-ui)
- [📊 Performances](#-performances)
- [🧰 Scripts Disponibles](#-scripts-disponibles)
- [☁️ Déploiement](#️-déploiement)
- [🤝 Contribution](#-contribution)
- [🤖 Collaboration IA](#-collaboration-ia)
- [📜 Licence](#-licence)

---

## 🎯 Aperçu  

### 🏠 Page d’Accueil  
![Page d'accueil](gitimg/exemple_accueil.png)  
*Interface élégante, animations fluides et effets glassmorphism.*

### 🔐 Interface d’Administration  
![Dashboard Admin](gitimg/exemple_dashboard.png)  
*Gestionnaire de documents moderne avec navigation intuitive.*

---

## 🚀 Fonctionnalités  

### 🌐 Interface Publique  
- Design inspiré d’**Apple**, **animations Framer Motion**, **effets glassmorphism**
- Performance optimisée : **lazy loading**, **cache intelligent**, **Next.js Image**
- Effets visuels : particules, glitch, background animé  

### 🔒 Interface d’Administration  
- CRUD complet pour **documents**, **diplômes**, **projets**, **technologies**, **profil**
- Upload **drag & drop**, sélection multiple, breadcrumb clair  
- Authentification **JWT**, dossiers protégés, cache intelligent  

---

## 🎨 Design & Couleurs  

| Élément | Couleur | Description |
|----------|----------|-------------|
| Fond principal | `#000000` | Noir pur |
| Accent cyan | `#00D4FF` | Couleur principale |
| Accent violet | `#B794F6` | Équilibre des tons |
| Accent rose | `#F093FB` | Touche vivante |
| Texte principal | `#FFFFFF` | Blanc pur |
| Texte secondaire | `#A1A1AA` | Gris doux |

🎨 **Effet glassmorphism** : `rgba(255,255,255,0.08)` + `blur(14px)`  

---

## 🛠️ Stack Technique  

| Catégorie | Technologies |
|------------|---------------|
| Framework | **Next.js 15 (App Router)** |
| Langage | **TypeScript** |
| UI | **Tailwind CSS**, **Framer Motion**, **Lucide React** |
| Base de données | **PostgreSQL** |
| Authentification | **JWT** |
| Upload | **Multer + File System** |

---

## 📁 Structure du Projet  

```bash
portfolio/
├── app/
│   ├── admin/             # Interface d’administration
│   ├── api/               # API Routes
│   │   ├── auth/          # Authentification
│   │   ├── documents/     # Documents
│   │   ├── diplomas/      # Diplômes
│   │   ├── projects/      # Projets
│   │   ├── technologies/  # Technologies
│   │   └── profile/       # Profil utilisateur
│   ├── layout.tsx
│   ├── page.tsx
│   └── projets/, contact/
├── components/
│   ├── admin/, sections/, ui/
│   ├── Navbar.tsx, Footer.tsx
├── lib/, contexts/, hooks/
├── scripts/               # Scripts d’init & sync
├── public/                # Ressources statiques
└── README.md
````

---

## ⚡ Installation Rapide

### 1️⃣ Prérequis

* Node.js ≥ 18
* PostgreSQL ≥ 12

### 2️⃣ Installation

```bash
git clone https://github.com/Krzanowski-Ambroise/modern-portfolio-template.git
cd modern-portfolio-template
npm install
```

Configurer la base :

```bash
createdb portfolio
cp config.example.js .env.local
# Modifier .env.local
node scripts/init-postgres-simple.cjs
npm run dev
```

### 3️⃣ Accès

* 🌐 **Portfolio** : [http://localhost:3000](http://localhost:3000)
* 🔐 **Admin** : [http://localhost:3000/admin](http://localhost:3000/admin)

---

## 📂 Pages Principales

| Section | URL        | Description                |
| ------- | ---------- | -------------------------- |
| Accueil | `/`        | Hero, compétences, projets |
| Projets | `/projets` | Galerie interactive        |
| Contact | `/contact` | Formulaire animé           |
| Admin   | `/admin`   | Tableau de bord complet    |

---

## 🔐 Authentification & Sécurité

* 🔑 **JWT Tokens** + sessions persistantes
* 🧱 **Middleware de protection** des routes sensibles
* 🧩 **Validation stricte** des fichiers uploadés
* 🧰 **Limitation de taille** et scan de sécurité
* 🔒 **Dossiers sécurisés** pour données sensibles

---

## 🎓 Gestion des Diplômes

* 📂 Création automatique de dossiers dédiés
* 📸 Upload multiple et métadonnées (titre, date, description)
* 🔄 Synchronisation automatique (`Sync Diplômes`)
* 🧠 Nommage intelligent `[Titre] - [Date]`
* 👁️ Prévisualisation intégrée

---

## 🗂️ Gestionnaire de Documents

* 🪶 Interface type explorateur
* 📤 Upload **drag & drop** + actions multiples
* 🔍 Recherche, filtrage, breadcrumb clair
* ⚡ Cache intelligent & pagination
* 📄 Formats supportés : `PDF`, `DOC`, `TXT`, `PNG`, `JPG`, `SVG`, `GIF`

---

## 🖼️ Gestion des Projets

* 🧱 Galerie interactive filtrable
* 🖼️ Upload d’images & galeries
* 🏷️ Association de technologies & compétences
* 🔗 Liens externes (GitHub, démo, doc)
* ⚙️ CRUD intuitif avec prévisualisation en temps réel

---

## 🧩 Composants UI

### 🧱 De Base

`Button`, `Card`, `Input`, `Modal`, `Notification`

### ⚡ Avancés

`AnimatedCounter`, `Typewriter`, `GlitchText`, `ParticleField`, `MatrixRain`

### 🔧 Admin

`DocumentManager`, `ProfileManager`, `FeaturedProjectsManager`, `AdminSidebar`

---

## 🎨 Personnalisation

Modifiez les couleurs dans `tailwind.config.js` :

```js
colors: {
  primary: { cyan: '#00D4FF', violet: '#B794F6', pink: '#F093FB' },
  background: '#000000',
  text: { primary: '#FFFFFF', secondary: '#A1A1AA' }
}
```

---

## 📊 Performances

* ⚙️ **Optimisation Next.js Image**
* 🚀 **Lazy loading & code splitting**
* 🧠 **Animations GPU-accelerated**
* 🧩 **Cache intelligent & pagination**

---

## 🧰 Scripts Disponibles

```bash
# Développement
npm run dev
npm run build
npm run start
npm run lint

# Base de données
node scripts/init-postgres-simple.cjs
node scripts/sync-diplomas-to-documents.cjs
```

---

## ☁️ Déploiement

### 🟢 Vercel (Recommandé)

```bash
npm run build
vercel --prod
```

### ⚙️ Variables d’Environnement

```env
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET=your_production_secret
```

### 🐳 Docker

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

---

## 🤝 Contribution

1. Fork le projet
2. Crée ta branche `feature/YourFeature`
3. Commit : `git commit -m 'Add YourFeature'`
4. Push : `git push origin feature/YourFeature`
5. Ouvre une **Pull Request** 🎉

---

## 🤖 Collaboration IA

### 🧠 VibeCoding avec Claude AI

* 🤝 Développement en binôme humain + IA
* ⚡ Itération rapide & feedback continu
* 🧩 Résolution de problèmes créative
* 💎 Code propre & maintenable

### 🔮 Prochaines Évolutions

* 📝 Système de blog intégré
* 👤 Authentification utilisateur pour le blog
* 🔍 Recherche full-text
* 🧠 Analytics et statistiques d’usage
* 🔐 Système de rôles multi-utilisateurs

---

## 📜 Licence

🪪 **MIT License** — voir le fichier [LICENSE](LICENSE).

---

<h3 align="center">💼 Développé avec ❤️ par <strong>Ambroise Krzanowski</strong></h3>

<p align="center"><em>Portfolio cybersécurité avec gestion de documents intégrée — créé en collaboration avec Claude AI (VibeCoding)</em></p>

---

```

---

Souhaites-tu que je t’ajoute **une section “Live Demo”** (avec badge Vercel, lien démo et aperçu GIF du site) juste sous le titre ?  
Ça donne un look encore plus “pro produit SaaS / portfolio dev” sur GitHub.
```
