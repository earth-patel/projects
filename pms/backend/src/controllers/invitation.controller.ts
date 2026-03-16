import { type Response } from 'express';

import { AuthRequest } from '../dtos/auth.dto';
import {
  getInvitationInfoByToken,
  sendInvitation
} from '../services/invitation.service';
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

export const getInvitationInfo = async (req: AuthRequest, res: Response) => {
  const { token } = req.query as { token: string };

  if (!token) {
    return sendErrorResponse(
      res,
      createErrorResponse(400, 'Token is required', {
        general: 'Token is required'
      })
    );
  }

  try {
    const inviteInfo = await getInvitationInfoByToken(token);

    if (!inviteInfo) {
      return sendErrorResponse(
        res,
        createErrorResponse(404, 'Invitation not found or expired', {
          general: 'Invitation not found or expired'
        })
      );
    }

    return res.status(200).json({ inviteInfo });
  } catch (error) {
    console.error('Error getting invitation info:', error);
    return sendErrorResponse(res);
  }
};

export const acceptInvitation = async (req: AuthRequest, res: Response) => {
  const { token } = req.body as { token?: string };

  if (!token) {
    return sendErrorResponse(
      res,
      createErrorResponse(400, 'Token is required', {
        general: 'Token is required'
      })
    );
  }

  try {
    const result = await acceptInvitationByToken(token, req.user.userId);

    if (!result) {
      return sendErrorResponse(
        res,
        createErrorResponse(404, 'Invitation not found or expired', {
          general: 'Invitation not found or expired'
        })
      );
    }

    if (result === 'EMAIL_MISMATCH') {
      return sendErrorResponse(
        res,
        createErrorResponse(400, 'Email mismatch', {
          general: 'Your account email does not match the invitation email'
        })
      );
    }

    if (result === 'ALREADY_MEMBER') {
      return sendErrorResponse(
        res,
        createErrorResponse(400, 'Already a member', {
          general: 'You are already a member of this organization'
        })
      );
    }

    return res
      .status(200)
      .json({ message: 'Invitation accepted successfully' });
  } catch (error) {
    console.error('Error accepting invitation:', error);
    return sendErrorResponse(res);
  }
};
