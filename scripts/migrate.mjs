// Applies db/schema.sql (idempotent: CREATE ... IF NOT EXISTS). Usage: npm run db:migrate
import { readFile } from "node:fs/promises";
import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set (put it in .env.local or the environment).");
  process.exit(1);
}
const sql = neon(process.env.DATABASE_URL);
const schema = await readFile(new URL("../db/schema.sql", import.meta.url), "utf8");
for (const statement of schema.split(/;\s*$/m).map((s) => s.trim()).filter(Boolean)) {
  await sql.query(statement);
}
console.log("Schema applied.");
