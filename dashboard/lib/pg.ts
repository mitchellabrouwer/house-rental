import postgresql from "pg";

const { Pool } = postgresql;

let pool;

if (typeof module === "object" && typeof module.exports === "object") {
  console.log("node");
}

if (typeof window !== "undefined" && typeof window.document !== "undefined") {
  console.log("browser");
}

if (!global.pool) {
  // const connection = {
  //   pool,
  //   query: (...args) => {
  //     return pool.connect().then((pool) => {
  //       return pool.query(...args).then((res) => {
  //         pool.release();
  //         return res.rows;
  //       });
  //     });
  //   },
  // };

  global.pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: Number(process.env.PGPORT),
  });
}

pool = global.pool;

// if (callback) {
//   callback(connection);
// }

// return connection;

export default pool;
