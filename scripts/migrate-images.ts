import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const repairs = await prisma.repairCase.findMany();

  for (const repair of repairs) {
    // Skip if already migrated
    if (repair.images && repair.images.length > 0) {
      continue;
    }

   const images = repair.images ?? [];

    if (images.length === 0) continue;

    await prisma.repairCase.update({
      where: { id: repair.id },
      data: {
        images,
      },
    });

    console.log(`✅ Migrated repair ID: ${repair.id}`);
  }

  console.log("🎉 Migration completed safely");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });