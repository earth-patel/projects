import prisma from '../prisma';

export const getUserOrganizations = async (userId: number) => {
  const data = await prisma.organizationUserRole.findMany({
    where: { userId },
    select: {
      organization: {
        select: { id: true, name: true }
      },
      role: {
        select: { name: true }
      }
    }
  });

  return data.map(item => ({
    id: item.organization.id,
    name: item.organization.name,
    role: item.role.name
  }));
};
