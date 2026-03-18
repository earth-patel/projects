import prisma from '../prisma';

/**
 * Returns the role name of a user within a specific organization,
 * or null if the user is not a member.
 */
export const getUserRoleInOrg = async (
  userId: number,
  organizationId: number
) => {
  const membership = await prisma.organizationUserRole.findFirst({
    where: { userId, organizationId },
    include: { role: { select: { name: true } } }
  });

  return membership?.role.name || null;
};
