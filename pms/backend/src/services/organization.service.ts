import prisma from '../prisma';

type CreateOrganizationInput = {
  name: string;
  userId: number;
};

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

export const createOrganizationService = async ({
  name,
  userId
}: CreateOrganizationInput) => {
  return await prisma.$transaction(async tx => {
    // create organization
    const organization = await tx.organization.create({
      data: {
        name,
        createdById: userId
      }
    });

    // get owner role
    const ownerRole = await tx.role.findFirst({
      where: { name: 'OWNER' }
    });

    if (!ownerRole) {
      throw new Error('Owner role not found. Please seed roles first.');
    }

    // assign owner role to user
    await tx.organizationUserRole.create({
      data: {
        userId,
        organizationId: organization.id,
        roleId: ownerRole.id
      }
    });

    return organization;
  });
};

export const getOrganizationMembers = async (organizationId: number) => {
  const members = await prisma.organizationUserRole.findMany({
    where: { organizationId },
    select: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true
        }
      },
      role: {
        select: { name: true }
      }
    }
  });

  return members.map(m => ({
    id: m.user.id,
    firstName: m.user.firstName,
    lastName: m.user.lastName,
    email: m.user.email,
    role: m.role.name
  }));
};

export const removeOrganizationMember = async ({
  organizationId,
  targetUserId,
  requestingUserId
}: {
  organizationId: number;
  targetUserId: number;
  requestingUserId: number;
}) => {
  // cannot remove yourself
  if (targetUserId === requestingUserId) {
    return 'CANNOT_REMOVE_SELF';
  }

  const targetMembership = await prisma.organizationUserRole.findFirst({
    where: { userId: targetUserId, organizationId },
    include: { role: { select: { name: true } } }
  });

  if (!targetMembership) {
    return 'MEMBER_NOT_FOUND';
  }

  // OWNER cannot be removed
  if (targetMembership.role.name === 'OWNER') {
    return 'CANNOT_REMOVE_OWNER';
  }

  // Get requesting user's role to enforce ADMIN restriction
  const requestingMembership = await prisma.organizationUserRole.findFirst({
    where: { userId: requestingUserId, organizationId },
    include: { role: { select: { name: true } } }
  });

  // ADMIN can only remove MEMBER, not other ADMINs
  if (
    requestingMembership?.role.name === 'ADMIN' &&
    targetMembership.role.name !== 'MEMBER'
  ) {
    return 'INSUFFICIENT_PERMISSIONS';
  }

  await prisma.organizationUserRole.delete({
    where: { id: targetMembership.id }
  });

  return true;
};

export const changeOrganizationMemberRole = async ({
  organizationId,
  targetUserId,
  newRoleName,
  requestingUserId
}: {
  organizationId: number;
  targetUserId: number;
  newRoleName: string;
  requestingUserId: number;
}) => {
  // Cannot change your own role
  if (targetUserId === requestingUserId) {
    return 'CANNOT_CHANGE_OWN_ROLE';
  }

  // OWNER role cannot be assigned via this flow
  if (newRoleName === 'OWNER') {
    return 'INVALID_ROLE';
  }

  // Validate the new role exists
  const newRole = await prisma.role.findUnique({
    where: { name: newRoleName }
  });
  if (!newRole) {
    return 'INVALID_ROLE';
  }

  // Get target's current membership
  const targetMembership = await prisma.organizationUserRole.findFirst({
    where: { userId: targetUserId, organizationId },
    include: { role: { select: { name: true } } }
  });

  if (!targetMembership) {
    return 'MEMBER_NOT_FOUND';
  }

  // OWNER's role cannot be changed
  if (targetMembership.role.name === 'OWNER') {
    return 'CANNOT_CHANGE_OWNER_ROLE';
  }

  // No-op guard: If the target already has the desired role, do nothing
  if (targetMembership.role.name === newRoleName) {
    return 'ALREADY_HAS_ROLE';
  }

  await prisma.organizationUserRole.update({
    where: { id: targetMembership.id },
    data: { roleId: newRole.id }
  });

  return true;
};
