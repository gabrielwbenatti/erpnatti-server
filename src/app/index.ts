import db from "./services/database";

async function main() {
  await db.$connect();
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
