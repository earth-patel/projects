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
  })

  return members.map(m => ({
    id: m.user.id,
    firstName: m.user.firstName,
    lastName: m.user.lastName,
    email: m.user.email,
    role: m.role.name
  }))
}
