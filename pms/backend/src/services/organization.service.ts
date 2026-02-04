import prisma from '../prisma';

export const getOrganizationMembership = async (
  userId: number,
  organizationId: number
) => {
  return prisma.organizationUserRole.findFirst({
    where: {
      userId,
      organizationId
    },
    include: {
      role: true
    }
  });
};
