// Configuration d'exemple pour le portfolio
// Copiez ce fichier vers .env.local et adaptez les valeurs

module.exports = {
  // Configuration de la base de données PostgreSQL
  database: {
    url: 'postgresql://username:password@localhost:5432/portfolio',
    user: 'postgres',
    host: 'localhost',
    database: 'portfolio',
    password: 'your_password_here',
    port: 5432
  },

  // JWT Secret pour l'authentification
  jwt: {
    secret: 'your_jwt_secret_here'
  },

  // Configuration de l'application
  app: {
    url: 'http://localhost:3000',
    environment: 'development'
  }
};
