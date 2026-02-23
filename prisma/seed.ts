import { PrismaClient, UserRole, ApprovalStatus } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

const DEV_PIN = "123456";
const SALT_ROUNDS = 10;

async function main() {
  const pinHash = bcrypt.hashSync(DEV_PIN, SALT_ROUNDS);

  // Optional: 1 Agent, assign to 2 demo users
  const agent = await prisma.agent.upsert({
    where: { code: "AGENT01" },
    create: {
      name: "Эхний агент",
      phone: "90001111",
      code: "AGENT01",
    },
    update: {},
  });

  const demoPhones = Array.from({ length: 10 }, (_, i) =>
    String(90000001 + i).padStart(8, "0")
  );
  const mongolianNames = [
    "Бат-Эрдэнэ",
    "Сарнай",
    "Тэмүүлэн",
    "Отгонбаяр",
    "Нарантуяа",
    "Энхжин",
    "Болд",
    "Дэлгэрмаа",
    "Ганбат",
    "Ууганбаяр",
  ];
  const weightPairs: { current: number; goal: number }[] = [
    { current: 72, goal: 65 },
    { current: 68, goal: 62 },
    { current: 80, goal: 72 },
    { current: 75, goal: 68 },
    { current: 70, goal: 64 },
    { current: 85, goal: 78 },
    { current: 66, goal: 60 },
    { current: 78, goal: 70 },
    { current: 74, goal: 68 },
    { current: 82, goal: 75 },
  ];

  for (let i = 0; i < demoPhones.length; i++) {
    const phone = demoPhones[i];
    const name = mongolianNames[i];
    const { current, goal } = weightPairs[i];
    const assignAgent = i < 2 ? agent.id : undefined;

    await prisma.user.upsert({
      where: { phone },
      create: {
        phone,
        pinHash,
        name,
        currentWeightKg: current,
        goalWeightKg: goal,
        approvalStatus: ApprovalStatus.approved,
        role: UserRole.user,
        agentId: assignAgent,
      },
      update: {
        pinHash,
        name,
        currentWeightKg: current,
        goalWeightKg: goal,
        approvalStatus: ApprovalStatus.approved,
        role: UserRole.user,
        agentId: assignAgent,
      },
    });
  }

  // Admin user
  await prisma.user.upsert({
    where: { phone: "99999999" },
    create: {
      phone: "99999999",
      pinHash,
      name: "Admin",
      approvalStatus: ApprovalStatus.approved,
      role: UserRole.admin,
    },
    update: {
      pinHash,
      approvalStatus: ApprovalStatus.approved,
      role: UserRole.admin,
    },
  });

  console.log("Seed done: 10 demo users, 1 admin, 1 agent (2 users assigned).");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
