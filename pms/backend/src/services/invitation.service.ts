import prisma from '../prisma';
import { sendInvitationEmail } from '../templates/email.template';
import { generateToken } from '../utils/token.util';

const INVITE_EXPIRY_HOURS = 48;

type SendInvitationInput = {
  email: string;
  organizationId: number;
  roleName: string;
  invitedByUserId: number;
};

export const sendInvitation = async ({
  email,
  organizationId,
  roleName,
  invitedByUserId
}: SendInvitationInput) => {
  // Check if role is valid
  const role = await prisma.role.findUnique({ where: { name: roleName } });
  if (!role) return 'INVALID_ROLE';

  // Prevent inviting yourself
  const inviter = await prisma.user.findUnique({
    where: { id: invitedByUserId }
  });
  if (inviter?.email === email) return 'CANNOT_INVITE_SELF';

  // Check if they're already a member of the organization
  const existingUser = await prisma.user.findFirst({ where: { email } });
  if (existingUser) {
    const existingMember = await prisma.organizationUserRole.findFirst({
      where: { userId: existingUser.id, organizationId }
    });
    if (existingMember) return 'ALREADY_MEMBER';
  }

  // Check for a still-valid pending invitation for this email + org
  const existingInvite = await prisma.invitation.findFirst({
    where: {
      email,
      organizationId,
      acceptedAt: null,
      expiresAt: { gt: new Date() }
    }
  });
  if (existingInvite) return 'INVITE_ALREADY_SENT';

  // Create the invitation
  const token = generateToken();

  const invitation = await prisma.invitation.create({
    data: {
      email,
      token,
      organizationId,
      roleId: role.id,
      invitedById: invitedByUserId,
      expiresAt: new Date(Date.now() + INVITE_EXPIRY_HOURS * 60 * 60 * 1000) // 48 hours from now
    },
    include: {
      organization: { select: { name: true } },
      role: { select: { name: true } }
    }
  });

  // Send the invitation email
  sendInvitationEmail(
    email,
    token,
    invitation.organization.name,
    invitation.role.name
  );

  return true;
};

export const getInvitationInfoByToken = async (token: string) => {
  return prisma.invitation.findFirst({
    where: {
      token,
      acceptedAt: null,
      expiresAt: { gt: new Date() }
    },
    select: {
      id: true,
      email: true,
      organization: { select: { id: true, name: true } },
      role: { select: { name: true } },
      expiresAt: true
    }
  });
};

export const acceptInvitationByToken = async (
  token: string,
  userId: number
) => {
  const invitation = await prisma.invitation.findFirst({
    where: {
      token,
      acceptedAt: null,
      expiresAt: { gt: new Date() }
    }
  });

  if (!invitation) return null;

  // Ensure the user accepting the invite has the same email as the invitation
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.email !== invitation.email) return 'EMAIL_MISMATCH';

  // Check if they're already a member of the organization
  const existingMembership = await prisma.organizationUserRole.findFirst({
    where: { userId, organizationId: invitation.organizationId }
  });
  if (existingMembership) return 'ALREADY_MEMBER';

  return prisma.$transaction(async tx => {
    await tx.organizationUserRole.create({
      data: {
        userId,
        organizationId: invitation.organizationId,
        roleId: invitation.roleId
      }
    });

    await tx.invitation.update({
      where: { id: invitation.id },
      data: { acceptedAt: new Date() }
    });

    return true;
  });
};
