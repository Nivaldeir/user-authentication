import fs from "fs";
import { PgAdapter } from "../infra/database/pg-adapter";
import path from "path";
const runMigration = async () => {
  try {
    const pgp = new PgAdapter( `${process.env.DATABASE_URL}`);
    const sqlPath = path.join(__dirname, "../../init.sql");
    const sql = fs.readFileSync(sqlPath, "utf8");
    await pgp.query(sql);
    console.log("Migration script executed successfully");
  } catch (error) {
    console.error("Error executing migration script:", error);
  } 
};

runMigration();
