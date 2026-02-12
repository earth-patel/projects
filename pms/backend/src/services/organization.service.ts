import prisma from '../prisma';

export const getUserOrganizations = async (userId: number) => {
  return prisma.organizationUserRole.findMany({
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
};
