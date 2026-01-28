import { PrismaClient } from '../../generated/prisma/client';

const seedModules = async (prisma: PrismaClient) => {
  const modules = ['USERS', 'ORGANIZATIONS', 'ROLES', 'PERMISSIONS'];

  for (const module of modules) {
    await prisma.module.upsert({
      where: { name: module },
      update: {},
      create: { name: module }
    });
  }

  console.log('Modules seeded successfully');
};

export default seedModules;
