import "dotenv/config";
import express, { Request } from "express";
import cors from "cors";
import router from "./routes/v1";
import errorHandler from "./middlewares/error_handler";

async function main() {
  const app = express();
  const port = 3001;

  app.use(express.json());
  app.use(cors<Request>());
  app.use(router);
  app.use(errorHandler);

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

main().catch(async (e) => {
  console.log(e);
  process.exit(1);
});
