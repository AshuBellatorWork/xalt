const db = require("../config/db");
const initTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      user_id SERIAL PRIMARY KEY,
      user_name VARCHAR(100),
      user_email VARCHAR(100) UNIQUE NOT NULL,
      user_age INTEGER
    );
  `;
  try {
    await db.query(createTableQuery);
    console.log("Users table is ready.");
  } catch (err) {
    console.error(" Error initializing users table:", err.message);
  }
};

initTable();

const create = async (data) => {
  const keys = Object.keys(data);
  const values = Object.values(data);
  const placeholders = keys.map((_, i) => `$${i + 1}`).join(", ");

  const query = `
    INSERT INTO users (${keys.join(", ")})
    VALUES (${placeholders})
    RETURNING *;
  `;

  const result = await db.query(query, values);
  return result.rows[0];
};
module.exports = { db, create };
