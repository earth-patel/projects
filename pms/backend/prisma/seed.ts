import seedModules from './seeds/modules.seed';
import seedRolePermissions from './seeds/rolePermissions.seed';
import seedRoles from './seeds/roles.seed';
import prisma from '../src/prisma';

async function main() {
  console.log('Seeding database...');

  await seedRoles(prisma);
  await seedModules(prisma);
  await seedRolePermissions(prisma);
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
