import { type InvitationApiErrorResponse } from '../../types/api.types';

export interface InvitationState {
  sendInviteError: InvitationApiErrorResponse | null;
  sendInviteLoading: boolean;
}
