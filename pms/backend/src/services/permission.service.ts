import prisma from "../prisma";

export const getUserRoleInOrg = async (userId: number, organizationId: number) => {
  const membership = await prisma.organizationUserRole.findFirst({
    where: { userId, organizationId },
    include: { role: { select: { name: true } } }
  });

  return membership?.role.name || null;
}
