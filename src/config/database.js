require("dotenv").config()

module.exports = {
  development: {
    dialect: 'sqlite',
    storage: 'database.db',
    dialectOptions: {
      timezone: "local",
    },
  },
  test: {
    username: "root",
    password: null,
    database: "database_test",
    host: "127.0.0.1",
    dialect: "mysql",
    timezone: "Asia/Jakarta",
    dialectOptions: {
      timezone: "local",
    },
  },
  production: {
    username: "root",
    password: null,
    database: "database_production",
    host: "127.0.0.1",
    dialect: "mysql",
    timezone: "Asia/Jakarta",
    dialectOptions: {
      timezone: "local",
    },
  },
};