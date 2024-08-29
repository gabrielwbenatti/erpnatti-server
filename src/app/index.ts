import express, { Request } from "express";
import cors from "cors";
import db from "./config/database";
import router from "./routes/v1";

async function main() {
  const app = express();
  const port = 3000;

  app.use(express.json());
  app.use(cors<Request>());
  app.use(router);

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
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
