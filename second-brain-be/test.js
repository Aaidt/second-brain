const { PrismaClient } = require('@prisma/client');


const prisma = new PrismaClient();

async function main() {
  await prisma.$connect();
  console.log('Connected to DB!');
}

main().catch((e) => {
  console.error(e);
});
