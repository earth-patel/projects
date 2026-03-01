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
      invitedByUserId,
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
