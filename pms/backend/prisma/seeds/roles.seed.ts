import { PrismaClient } from '../../generated/prisma/client';

const seedRoles = async (prisma: PrismaClient) => {
  const roles = ['OWNER', 'ADMIN', 'MEMBER'];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role },
      update: {},
      create: { name: role }
    });
  }

  console.log('Roles seeded successfully');
};

export default seedRoles;
