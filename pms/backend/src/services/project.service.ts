import prisma from '../prisma';

export const listProjects = async (organizationId: number) => {
  return prisma.project.findMany({
    where: { organizationId, status: 1 },
    select: {
      id: true,
      name: true,
      description: true,
      createdBy: { select: { id: true, firstName: true, lastName: true } },
      createdAt: true,
      _count: { select: { tasks: { where: { status: 1 } } } }
    },
    orderBy: { createdAt: 'desc' }
  });
};

export const createProject = async ({
  name,
  description,
  organizationId,
  createdById
}: {
  name: string;
  description?: string;
  organizationId: number;
  createdById: number;
}) => {
  const existing = await prisma.project.findFirst({
    where: { organizationId, name, status: 1 }
  })

  if (existing) {
    return 'PROJECT_NAME_TAKEN';
  }

  return prisma.project.create({
    data: {
      name,
      description,
      organizationId,
      createdById
    }
  })
};

export const deleteProject = async ({
  projectId,
  organizationId
}: {
  projectId: number;
  organizationId: number;
}) => {
  const project = await prisma.project.findFirst({
    where: { id: projectId, organizationId, status: 1 }
  });

  if (!project) {
    return 'PROJECT_NOT_FOUND';
  }

  await prisma.project.update({
    where: { id: projectId },
    data: { status: 0 }
  });

  return true;
};
