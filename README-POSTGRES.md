# Configuration PostgreSQL

## 🗄️ Base de Données PostgreSQL

Le portfolio utilise maintenant PostgreSQL comme base de données principale, remplaçant le système JSON précédent.

### 📋 Prérequis

- PostgreSQL installé et en cours d'exécution
- Base de données `portfolio` créée
- Un utilisateur PostgreSQL ayant accès à cette base (ses identifiants se définissent dans `.env.local`, voir ci-dessous)

### 🔧 Configuration

#### 1. Créer la base de données

```sql
CREATE DATABASE portfolio;
```

#### 2. Définir les variables d'environnement

Aucun identifiant n'est écrit dans le code : la connexion, le secret JWT et le mot de passe admin sont lus depuis l'environnement.

```bash
cp .env.example .env.local
# puis renseigner vos valeurs dans .env.local (ignoré par git)
```

| Variable | Rôle | Défaut |
|----------|------|--------|
| `PGHOST` | Hôte PostgreSQL | `localhost` |
| `PGPORT` | Port PostgreSQL | `5432` |
| `PGDATABASE` | Nom de la base | `portfolio` |
| `PGUSER` | Utilisateur PostgreSQL | — |
| `PGPASSWORD` | Mot de passe de cet utilisateur | — |
| `JWT_SECRET` | Secret de signature des tokens admin (obligatoire pour se connecter) | — |
| `ADMIN_PASSWORD` | Mot de passe du compte `admin`, utilisé à sa création | — |

Next.js charge `.env.local` automatiquement. Les scripts de `scripts/` lisent les mêmes variables : chargez le fichier avec `node --env-file=.env.local` (Node.js 20.6+) ou exportez les variables dans votre shell.

#### 3. Initialiser la base de données

```bash
node --env-file=.env.local scripts/init-postgres-simple.cjs
# ou, avec les variables déjà exportées dans le shell :
npm run init-db
```

Cette commande va :
- Créer toutes les tables nécessaires
- Créer l'utilisateur `admin` avec le mot de passe `ADMIN_PASSWORD` (s'il n'existe pas encore ; rien n'est créé si la variable est vide)
- Ajouter les catégories par défaut
- Ajouter les technologies par défaut
- Insérer les projets d'exemple
- Configurer les projets à la une

### 📊 Structure de la Base de Données

#### Tables Principales

- **users** : Utilisateurs administrateurs
- **categories** : Catégories de projets
- **technologies** : Technologies utilisées
- **projects** : Projets du portfolio
- **project_technologies** : Relations projets-technologies
- **featured_projects** : Projets mis en avant

#### Relations

- `projects.category_id` → `categories.id`
- `project_technologies.project_id` → `projects.id`
- `project_technologies.technology_id` → `technologies.id`
- `featured_projects.project_id` → `projects.id`

### 🚀 Utilisation

#### Démarrage de l'application

```bash
npm run dev
```

#### Accès à l'administration

- URL : `http://localhost:3000/admin`
- Username : `admin`
- Password : celui défini dans `ADMIN_PASSWORD` lors de la création du compte

#### Changer le mot de passe admin

Le compte n'est créé que s'il n'existe pas : modifier `ADMIN_PASSWORD` ne change pas un compte existant. Supprimez le compte, mettez le nouveau mot de passe dans `ADMIN_PASSWORD`, puis relancez l'initialisation (elle ne touche pas aux autres données) :

```sql
DELETE FROM users WHERE username = 'admin';
```

```bash
node --env-file=.env.local scripts/init-postgres-simple.cjs
```

Une fois le compte créé, `ADMIN_PASSWORD` peut être retiré de `.env.local`.

### 🔒 Sécurité

- Les mots de passe sont hashés avec bcrypt
- L'authentification utilise JWT
- Les requêtes sensibles nécessitent une authentification

### 📝 API Endpoints

#### Authentification
- `POST /api/auth/login` - Connexion
- `POST /api/auth/verify` - Vérification du token

#### Projets
- `GET /api/projects` - Liste des projets
- `POST /api/projects` - Créer un projet
- `GET /api/projects/[id]` - Détails d'un projet
- `PUT /api/projects/[id]` - Modifier un projet
- `DELETE /api/projects/[id]` - Supprimer un projet

#### Projets à la une
- `GET /api/featured` - Liste des projets à la une
- `POST /api/featured` - Mettre à jour les projets à la une

#### Catégories
- `GET /api/categories` - Liste des catégories
- `POST /api/categories` - Créer une catégorie
- `GET /api/categories/[id]` - Détails d'une catégorie
- `PUT /api/categories/[id]` - Modifier une catégorie
- `DELETE /api/categories/[id]` - Supprimer une catégorie

#### Technologies
- `GET /api/technologies` - Liste des technologies
- `POST /api/technologies` - Créer une technologie
- `GET /api/technologies/[id]` - Détails d'une technologie
- `PUT /api/technologies/[id]` - Modifier une technologie
- `DELETE /api/technologies/[id]` - Supprimer une technologie

### 🛠️ Développement

#### Connexion à la base de données

```javascript
import { pool, query } from '@/lib/database-postgres'

// Exécuter une requête
const result = await query('SELECT * FROM projects')

// Obtenir un client
const client = await pool.connect()
```

#### Gestion des transactions

```javascript
const client = await getClient()
try {
  await client.query('BEGIN')
  // ... opérations ...
  await client.query('COMMIT')
} catch (error) {
  await client.query('ROLLBACK')
  throw error
} finally {
  client.release()
}
```

### 🔄 Migration depuis JSON

La migration depuis le système JSON vers PostgreSQL est automatique. Les données existantes sont préservées et la structure est optimisée pour de meilleures performances.

### 📈 Avantages de PostgreSQL

- **Performance** : Requêtes optimisées et indexation
- **Scalabilité** : Gestion de grandes quantités de données
- **Sécurité** : Contrôle d'accès granulaire
- **Intégrité** : Contraintes et relations garanties
- **Flexibilité** : Requêtes SQL complexes
- **Backup** : Sauvegarde et restauration faciles

### 🐛 Dépannage

#### Erreur de connexion
- Vérifier que PostgreSQL est en cours d'exécution
- Vérifier les identifiants de connexion (variables `PG*` de `.env.local`)
- Vérifier que la base de données `portfolio` existe

#### Erreur d'authentification
- Vérifier que `JWT_SECRET` est défini
- Vérifier que l'utilisateur admin existe (créé seulement si `ADMIN_PASSWORD` est défini)
- Réinitialiser avec `node --env-file=.env.local scripts/init-postgres-simple.cjs`

#### Problèmes de performance
- Vérifier les index sur les colonnes fréquemment utilisées
- Optimiser les requêtes avec EXPLAIN
