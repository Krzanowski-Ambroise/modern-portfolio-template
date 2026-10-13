// Configuration PostgreSQL des scripts, lue depuis l'environnement (voir .env.example)
// Exemple : node --env-file=.env.local scripts/init-postgres-simple.cjs
module.exports = {
  user: process.env.PGUSER,
  host: process.env.PGHOST || 'localhost',
  database: process.env.PGDATABASE || 'portfolio',
  password: process.env.PGPASSWORD,
  port: Number(process.env.PGPORT) || 5432,
}
