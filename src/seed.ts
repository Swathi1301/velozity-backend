import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding...");

  // clear old data
  await prisma.apiKey.deleteMany();
  await prisma.user.deleteMany();
  await prisma.tenant.deleteMany();

  // create tenants
  const tenantA = await prisma.tenant.create({
    data: { name: "Tenant A" }
  });

  const tenantB = await prisma.tenant.create({
    data: { name: "Tenant B" }
  });

  const password = await bcrypt.hash("123456", 10);

  // users
  await prisma.user.createMany({
    data: [
      {
        name: "Owner A",
        email: "ownerA@test.com",
        password,
        tenantId: tenantA.id,
        role: "OWNER"
      },
      {
        name: "Member A",
        email: "memberA@test.com",
        password,
        tenantId: tenantA.id,
        role: "MEMBER"
      },
      {
        name: "Owner B",
        email: "ownerB@test.com",
        password,
        tenantId: tenantB.id,
        role: "OWNER"
      },
      {
        name: "Member B",
        email: "memberB@test.com",
        password,
        tenantId: tenantB.id,
        role: "MEMBER"
      }
    ]
  });

  // ✅ FIXED HERE (use keyHash)
  await prisma.apiKey.createMany({
    data: [
      { keyHash: "KEY_TENANT_A", tenantId: tenantA.id },
      { keyHash: "KEY_TENANT_B", tenantId: tenantB.id }
    ]
  });

  console.log("Seed completed!");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });