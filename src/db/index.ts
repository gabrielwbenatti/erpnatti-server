import "dotenv/config";
import { drizzle } from "drizzle-orm/connect";
import { produtosTable } from "./schema";

async function main() {
  const db = await drizzle("node-postgres", process.env.DATABASE_URL!);

  const rows = await db.select().from(produtosTable);
  console.log(rows);

  const product: typeof produtosTable.$inferInsert = {
    nome: "teste",
    movimenta_estoque: false,
  };

  await db.insert(produtosTable).values(product);
  const rows2 = await db.select().from(produtosTable);
  console.log(rows2);
}

main();
