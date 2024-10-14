import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

class Database {
  private static instance: Pool;
  private constructor() {}

  public static getInstance() {
    const databaseUrl = process.env.DATABASE_URL!;

    if (!Database.instance) {
      Database.instance = new Pool({ connectionString: databaseUrl });
    }

    return drizzle(Database.instance);
  }
}

export default Database;
