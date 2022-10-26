import postgresql from "pg";

const { Pool } = postgresql;

let pool;

if (!global.pool) {
  global.pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: Number(process.env.PGPORT),
  });
}

pool = global.pool;

export default pool;
