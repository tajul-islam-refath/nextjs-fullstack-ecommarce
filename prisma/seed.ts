
import prisma from '@/lib/prisma';
import * as bcrypt from 'bcryptjs';

async function main() {
  const email = 'admin-system@gmail.com';
  const password = 'Admin@123';
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      password: hashedPassword,
      role: 'admin',
      emailVerified: new Date(),
    },
  });

  console.log({ user });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
