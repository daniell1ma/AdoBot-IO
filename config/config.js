require('dotenv').config(); // Carrega as variáveis do .env

module.exports = {
  defaults: {
    charset: "utf8mb4",
    collate: "utf8mb4_unicode_ci"
  },
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: "mysql",
    admin : {
      username: "admin",
      password: "admin"
    }
  },
  production: {
    use_env_variable: "DATABASE_URL",
    pool: {
      max: 5,
      min: 1,
      idle: 10000,
      maxIdleTime: 120000
    },
    admin: {
      username: {
        use_env_variable: "ADMIN_USERNAME"
      } ,
      password: {
        use_env_variable: "ADMIN_PASSWORD"
      }
    }
  }
};