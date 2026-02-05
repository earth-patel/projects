import prisma from '../prisma';
import { PermissionAction } from '../types/permission.type';

export const getRoleModulePermission = async (
  roleName: string,
  moduleName: string
) => {
  return prisma.rolePermission.findFirst({
    where: {
      role: { name: roleName },
      module: { name: moduleName }
    }
  });
};

export const hasPermission = async (
  permissionActions: string,
  action: PermissionAction
) => {
  const actions = permissionActions.split(',').map(a => a.trim());
  return actions.includes(action);
};
