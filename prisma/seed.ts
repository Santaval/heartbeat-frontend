import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  let messagesCreated = 0;
  let datesCreated = 0;

  const messageCount = await prisma.message.count();
  if (messageCount === 0) {
    const { count } = await prisma.message.createMany({
      data: [
        { text: "Te amo ❤️" },
        { text: "Pienso en ti 💭" },
        { text: "Eres mi persona favorita" },
        { text: "No puedo esperar a verte" },
        { text: "Gracias por existir" },
        { text: "Mi corazón es tuyo" },
      ],
    });
    messagesCreated = count;
  }

  const importantDateCount = await prisma.importantDate.count();
  if (importantDateCount === 0) {
    const { count } = await prisma.importantDate.createMany({
      data: [
        { date: "14/02", label: "San Valentín", sortOrder: 0 },
        { date: "20/08", label: "Nuestro aniversario", sortOrder: 1 },
        { date: "25/12", label: "Navidad juntos", sortOrder: 2 },
      ],
    });
    datesCreated = count;
  }

  await prisma.dateIdea.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, idea: "Cena y película en casa 🍿" },
  });

  await prisma.rotation.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 },
  });

  console.log(
    `Seed complete: ${messagesCreated} messages created, ${datesCreated} important dates created, dateIdea/rotation singletons ensured.`
  );
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
