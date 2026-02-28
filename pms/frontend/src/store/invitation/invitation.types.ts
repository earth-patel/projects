import { type InvitationApiErrorResponse } from '../../types/api.types';

export interface InvitationState {
  invitationError?: InvitationApiErrorResponse | null;
  invitationLoading?: boolean;
}
