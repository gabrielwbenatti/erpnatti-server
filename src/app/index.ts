import express, { Router } from "express";
import db from "./services/database";
import router from "./routes/v1";

async function main() {
  const app = express();

  app.use(express.json());
  app.use(router);

  app.listen(3000);
}

main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (e) => {
    console.log(e);
    await db.$disconnect();
    process.exit(1);
  });
