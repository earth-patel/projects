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

export const getUserOrganizations = async (userId: number) => {
  return prisma.organizationUserRole.findMany({
    where: { userId },
    select: {
      organization: {
        select: {
          id: true,
          name: true
        }
      },
      role: {
        select: {
          name: true
        }
      }
    }
  });
};
