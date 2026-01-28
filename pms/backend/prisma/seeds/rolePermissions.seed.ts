import { PrismaClient } from '../../generated/prisma/client';

const PERMISSIONS = [
  {
    role: 'OWNER',
    module: 'USERS',
    actions: 'create,read,update,delete'
  },
  {
    role: 'ADMIN',
    module: 'USERS',
    actions: 'create,read,update'
  },
  {
    role: 'MEMBER',
    module: 'USERS',
    actions: 'read'
  }
];

const seedRolePermissions = async (prisma: PrismaClient) => {
  const roleMap = await prisma.role.findMany();
  const moduleMap = await prisma.module.findMany();

  const rolesByName = Object.fromEntries(
    roleMap.map(role => [role.name, role.id])
  );
  const modulesByName = Object.fromEntries(
    moduleMap.map(mod => [mod.name, mod.id])
  );

  for (const perm of PERMISSIONS) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_moduleId: {
          roleId: rolesByName[perm.role],
          moduleId: modulesByName[perm.module]
        }
      },
      update: {
        actions: perm.actions
      },
      create: {
        roleId: rolesByName[perm.role],
        moduleId: modulesByName[perm.module],
        actions: perm.actions
      }
    });
  }

  console.log('Role permissions seeded successfully');
};

export default seedRolePermissions;
