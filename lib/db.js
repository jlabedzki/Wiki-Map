let dbParams = {};

const env = process.env.ENV || "development";

if (env === 'devlopment') {
  dbParams = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  };
} else {
  dbParams.connectionString = process.env.DATABASE_URL;
}

// PG database client/connection setup
const { Pool } = require('pg');
const db = new Pool(dbParams);

module.exports = {
  query: (text, params) => {
    return db.query(text, params);
  }
};
