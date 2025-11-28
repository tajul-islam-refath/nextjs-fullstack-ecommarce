import { PrismaClient } from "../app/generated/prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("🌱 Seeding delivery costs...");

  // Seed delivery costs
  const deliveryCosts = [
    { zone: "INSIDE_DHAKA" as const, cost: 60 },
    { zone: "OUTSIDE_DHAKA" as const, cost: 120 },
  ];

  for (const deliveryCost of deliveryCosts) {
    await prisma.deliveryCost.upsert({
      where: { zone: deliveryCost.zone },
      update: {},
      create: deliveryCost,
    });
    console.log(
      `✅ Created/Updated delivery cost for ${deliveryCost.zone}: ৳${deliveryCost.cost}`
    );
  }

  console.log("✨ Seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
