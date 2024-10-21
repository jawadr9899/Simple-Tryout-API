import { DB } from "https://deno.land/x/sqlite@v3.9.1/mod.ts";

const db = new DB("database.db");

// create table
db.execute(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(50) NOT NULL,
        email VARCHAR(50) NOT NULL,
        phone VARCHAR(50) NOT NULL
    );
`);

export { db };
