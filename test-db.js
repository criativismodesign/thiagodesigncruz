const { PrismaClient } = require("@prisma/client");
const p = new PrismaClient();

async function testDB() {
  try {
    await p.user.findFirst();
    console.log("Database OK");
  } catch (e) {
    console.error("Database ERROR:", e.message);
  }
  await p.$disconnect();
}

testDB();
