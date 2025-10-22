# Configuration PostgreSQL

## 🗄️ Base de Données PostgreSQL

Le portfolio utilise maintenant PostgreSQL comme base de données principale, remplaçant le système JSON précédent.

### 📋 Prérequis

- PostgreSQL installé et en cours d'exécution
- Base de données `portfolio` créée
- Utilisateur `postgres` avec le mot de passe `q8a6dEpWMu`

### 🔧 Configuration

#### 1. Créer la base de données

```sql
CREATE DATABASE portfolio;
```

#### 2. Initialiser la base de données

```bash
npm run init-db
```

Cette commande va :
- Créer toutes les tables nécessaires
- Insérer l'utilisateur admin (username: `admin`, password: `admin123`)
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
- Password : `admin123`

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
- Vérifier les identifiants de connexion
- Vérifier que la base de données `portfolio` existe

#### Erreur d'authentification
- Vérifier que l'utilisateur admin existe
- Réinitialiser avec `npm run init-db`

#### Problèmes de performance
- Vérifier les index sur les colonnes fréquemment utilisées
- Optimiser les requêtes avec EXPLAIN
