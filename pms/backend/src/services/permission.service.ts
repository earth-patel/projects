import prisma from '../prisma';

export class PermissionService {
  // Helper method to get a user's role in an organization
  static async getUserRoleInOrganization(
    userId: number,
    organizationId: number
  ) {
    const membership = await prisma.organizationUserRole.findFirst({
      where: { organizationId, userId },
      include: { role: { select: { name: true } } }
    });

    return membership?.role.name || null;
  }

  // Method to check if a user has one of the required roles in an organization
  static async hasRequiredRole(
    userId: number,
    organizationId: number,
    allowedRoles: string[]
  ) {
    const roleName = await this.getUserRoleInOrganization(
      userId,
      organizationId
    );

    if (!roleName) {
      return false;
    }

    return allowedRoles.includes(roleName);
  }
}
