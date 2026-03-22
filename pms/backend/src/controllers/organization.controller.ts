import { type Response } from 'express';

import { AuthRequest } from '../dtos/auth.dto';
import { Prisma } from '../../generated/prisma/client';
import {
  createOrganizationService,
  getOrganizationMembers,
  getUserOrganizations,
  removeOrganizationMember
} from '../services/organization.service';
import { createErrorResponse, sendErrorResponse } from '../utils/response.util';

/* ---------- CONTROLLERS ---------- */
export const listUserOrganizations = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const organizations = await getUserOrganizations(req.user.userId);
    return res.status(200).json(organizations);
  } catch (error) {
    console.error('Error listing user organizations:', error);
    return sendErrorResponse(res);
  }
};

export const createOrganization = async (req: AuthRequest, res: Response) => {
  try {
    const { organizationName } = req.body;

    if (!organizationName) {
      return sendErrorResponse(
        res,
        createErrorResponse(400, 'Organization name is required', {
          name: 'Organization name is required'
        })
      );
    }

    await createOrganizationService({
      name: organizationName,
      userId: req.user.userId
    });
    return res
      .status(201)
      .json({ message: 'Organization created successfully' });
  } catch (error) {
    // Handle unique constraint violation for organization name
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return sendErrorResponse(
        res,
        createErrorResponse(400, 'Organization name already in use', {
          general: 'Organization name already in use'
        })
      );
    }

    console.error('Error creating organization:', error);
    return sendErrorResponse(res);
  }
};

export const listOrganizationMembers = async (
  req: AuthRequest,
  res: Response
) => {
  const organizationId = Number(req.params.organizationId);

  try {
    const members = await getOrganizationMembers(organizationId);
    return res.status(200).json(members);
  } catch (error) {
    console.error('Error listing organization members:', error);
    return sendErrorResponse(res);
  }
};

export const removeMember = async (req: AuthRequest, res: Response) => {
  const organizationId = Number(req.params.organizationId);
  const targetUserId = Number(req.params.userId);

  if (isNaN(targetUserId)) {
    return sendErrorResponse(
      res,
      createErrorResponse(400, 'Invalid user ID', {
        general: 'Invalid user ID'
      })
    );
  }

  try {
    const result = await removeOrganizationMember({
      organizationId,
      targetUserId,
      requestingUserId: req.user.userId
    });

    if (result === 'CANNOT_REMOVE_SELF') {
      return sendErrorResponse(
        res,
        createErrorResponse(400, 'Cannot remove yourself', {
          general: 'You cannot remove yourself from the organization'
        })
      );
    }
    if (result === 'MEMBER_NOT_FOUND') {
      return sendErrorResponse(
        res,
        createErrorResponse(404, 'Member not found', {
          general: 'Member not found in this organization'
        })
      );
    }
    if (result === 'CANNOT_REMOVE_OWNER') {
      return sendErrorResponse(
        res,
        createErrorResponse(400, 'Cannot remove owner', {
          general: 'The organization owner cannot be removed'
        })
      );
    }
    if (result === 'INSUFFICIENT_PERMISSIONS') {
      return sendErrorResponse(
        res,
        createErrorResponse(403, 'Insufficient permissions', {
          general: 'Admins can only remove members, not other admins'
        })
      );
    }

    return res.status(200).json({ message: 'Member removed successfully' });
  } catch (error) {
    console.error('Error removing member:', error);
    return sendErrorResponse(res);
  }
};
