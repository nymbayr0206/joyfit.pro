import { PrismaClient, UserRole, ApprovalStatus, StarType } from "@prisma/client";

const prisma = new PrismaClient();

const mongolianFirstNames = [
  "Бат", "Болд", "Энх", "Отгон", "Дорж", "Пүрэв", "Цэрэн", "Сайхан",
  "Мөнх", "Баяр", "Түмэн", "Гал", "Чулуун", "Дэлгэр", "Ган", "Тэмүүлэн",
  "Алтан", "Эрдэнэ", "Цэцэг", "Сарнай", "Нaran", "Оюун", "Золзаяа", "Ууганбаяр",
  "Амар", "Санаа", "Тэмүү", "Билгүүн", "Нарантуяа", "Цогт", "Баатар", "Жаргал",
  "Сүх", "Мягмар", "Лувсан", "Дамдин", "Батбаяр", "Очир", "Гантулга", "Ханд",
  "Тунгалаг", "Ариун", "Сэлэнгэ", "Номин", "Уянга", "Сайнбаяр", "Энхтуяа", "Мөнхбат",
  "Золзаяа", "Дэлгэрмаа", "Энхжин", "Ганзориг", "Анхбаяр", "Ууганцэцэг", "Энхмөнх", "Болормаа",
  "Батсайхан", "Цэндсүрэн", "Цолмон", "Мөнхцэцэг", "Ганболд", "Төгөлдөр", "Ариунболд"
];

const mongolianLastNames = [
  "баатар", "бат", "дорж", "жав", "өд", "сүх", "гэрэл", "чулуун",
  "эрдэнэ", "очир", "болд", "мөнх", "түмэн", "цэрэн", "пүрэв", "баяр"
];

async function main() {
  console.log("🌱 Starting seed...");

  await prisma.user.upsert({
    where: { phone: "99999999" },
    create: {
      phone: "99999999",
      firstName: "Admin",
      lastName: "System",
      approvalStatus: ApprovalStatus.APPROVED,
      role: UserRole.ADMIN,
    },
    update: {
      firstName: "Admin",
      lastName: "System",
      approvalStatus: ApprovalStatus.APPROVED,
      role: UserRole.ADMIN,
    },
  });
  console.log("✓ Admin user created (phone: 99999999)");

  const userCount = 63;
  let created = 0;
  
  for (let i = 0; i < userCount; i++) {
    const phone = String(88000000 + i).padStart(8, "0");
    const firstName = mongolianFirstNames[i % mongolianFirstNames.length];
    const lastName = mongolianLastNames[i % mongolianLastNames.length];
    
    await prisma.user.upsert({
      where: { phone },
      create: {
        phone,
        firstName,
        lastName,
        approvalStatus: ApprovalStatus.APPROVED,
        role: UserRole.USER,
      },
      update: {
        firstName,
        lastName,
        approvalStatus: ApprovalStatus.APPROVED,
        role: UserRole.USER,
      },
    });
    created++;
  }
  
  console.log(`✓ ${created} demo users created`);

  const users = await prisma.user.findMany({
    where: { role: UserRole.USER },
    take: 20,
  });

  for (const user of users.slice(0, 10)) {
    await prisma.starLedger.create({
      data: {
        userId: user.id,
        type: StarType.BRONZE,
        kgDelta: 0.5,
        createdAt: new Date(),
      },
    });
  }

  for (const user of users.slice(0, 5)) {
    await prisma.starLedger.create({
      data: {
        userId: user.id,
        type: StarType.SILVER,
        kgDelta: 1.0,
        createdAt: new Date(),
      },
    });
  }

  for (const user of users.slice(0, 2)) {
    await prisma.starLedger.create({
      data: {
        userId: user.id,
        type: StarType.GOLD,
        kgDelta: 2.0,
        createdAt: new Date(),
      },
    });
  }

  console.log("✓ Sample star ledger entries created for leaderboard");
  console.log(`\n🎉 Seed complete: 1 admin + ${userCount} demo users with sample stars`);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error("❌ Seed error:", e);
    prisma.$disconnect();
    process.exit(1);
  });
