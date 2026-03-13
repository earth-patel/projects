import { type Response } from 'express';

import { AuthRequest } from '../dtos/auth.dto';
import { sendInvitation } from '../services/invitation.service';
import { createErrorResponse, sendErrorResponse } from '../utils/response.util';

/* ---------- CONTROLLERS ---------- */
export const invite = async (req: AuthRequest, res: Response) => {
  const { email, organizationId, roleName } = req.body as {
    email: string;
    organizationId: number;
    roleName: string;
  };

  if (!email || !organizationId || !roleName) {
    return sendErrorResponse(
      res,
      createErrorResponse(
        400,
        'Email, organizationId, and roleName are required',
        {
          general: 'Email, organizationId, and roleName are required'
        }
      )
    );
  }

  // Only ADMIN and MEMBER roles can be assigned via invitation — OWNER is reserved
  const INVITABLE_ROLES = ['ADMIN', 'MEMBER'];
  if (!INVITABLE_ROLES.includes(roleName)) {
    return sendErrorResponse(
      res,
      createErrorResponse(400, 'Invalid role', {
        general: 'Role must be ADMIN or MEMBER'
      })
    );
  }

  try {
    const result = await sendInvitation({
      email,
      organizationId,
      roleName,
      invitedByUserId: req.user.userId
    });

    if (result === 'INVALID_ROLE') {
      return sendErrorResponse(
        res,
        createErrorResponse(400, 'Invalid role', {
          general: 'Invalid role'
        })
      );
    }

    if (result === 'CANNOT_INVITE_SELF') {
      return sendErrorResponse(
        res,
        createErrorResponse(400, 'You cannot invite yourself', {
          email: 'You cannot invite yourself'
        })
      );
    }

    if (result === 'ALREADY_MEMBER') {
      return sendErrorResponse(
        res,
        createErrorResponse(400, 'User is already a member', {
          email: 'This user is already a member of the organization'
        })
      );
    }

    if (result === 'INVITE_ALREADY_SENT') {
      return sendErrorResponse(
        res,
        createErrorResponse(400, 'Invitation already sent', {
          email: 'A pending invitation has already been sent to this email'
        })
      );
    }

    return res.status(200).json({ message: 'Invitation sent successfully' });
  } catch (error) {
    console.error('Error inviting user:', error);
    return sendErrorResponse(res);
  }
};
