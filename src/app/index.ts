import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.usuarios.create({
    data: { nome_usuario: "teste123", senha: "123456" },
  });

  const allUsers = await prisma.usuarios.findMany();
  console.log("all users", allUsers);
}

main()
  .then(async () => {
    await prisma.$disconnect;
  })
  .catch(async (e) => {
    console.log(e);
    await prisma.$disconnect;
    process.exit(1);
  });
