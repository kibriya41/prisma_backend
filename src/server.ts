import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import prisma from "./lib/prisma";
import config from "./config";

const PORT = config.port;

async function main() {
  await prisma.$connect();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
