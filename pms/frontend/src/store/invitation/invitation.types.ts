import { type InvitationApiErrorResponse } from '../../types/api.types';

export interface InvitationInfo {
  id: number;
  email: string;
  organization: { id: number; name: string };
  role: { name: string };
  expiresAt: string;
}

export interface InvitationState {
  invitationInfo: InvitationInfo | null;
  invitationLoading: boolean;
  invitationInfoError: InvitationApiErrorResponse | null;

  sendInviteError: InvitationApiErrorResponse | null;
  sendInviteLoading: boolean;

  acceptInviteLoading: boolean;
  acceptInviteError: InvitationApiErrorResponse | null;
}
