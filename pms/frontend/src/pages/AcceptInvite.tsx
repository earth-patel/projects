import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';

import Loading from '../components/Loading';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchInviteInfo } from '../store/invitation/invitation.thunk';

const AcceptInvite = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const token = params.get('token');

  const { user } = useAppSelector(state => state.auth);
  const { invitationInfo, invitationLoading, invitationInfoError } =
    useAppSelector(state => state.invitation);

  useEffect(() => {
    if (!token) return;
    dispatch(fetchInviteInfo(token));
  }, [token, dispatch]);

  if (!token) {
    return (
      <div>
        <h2>Invalid Invitation</h2>
        <p>No invitation token found.</p>
      </div>
    );
  }

  if (invitationLoading) return <Loading />;

  if (invitationInfoError) {
    return (
      <div>
        <h2>Invitation Unavailable</h2>
        <p>
          {invitationInfoError.errors?.general ||
            'This invitation is invalid or has expired.'}
        </p>
        <button onClick={() => navigate('/login')}>Go to Login</button>
      </div>
    );
  }

  if (!invitationInfo) return null;

  return (
    <div className="page-center">
      <div className="content-card content-card-sm content-card-centered">
        <div className="mb-3">
          <h2 className="heading">You're Invited 🎉</h2>
        </div>

        <div className="mb-3">
          <div className="title">
            Join <strong>{invitationInfo.organization.name}</strong> as a{' '}
            <strong>{invitationInfo.role.name}</strong>.
          </div>

          {!user && (
            <div className="subtitle mt-1">
              Log in or create an account to accept this invitation. Your
              invitation will be waiting after you sign in.
            </div>
          )}
        </div>

        <div className="card-actions">
          {!user ? (
            <>
              <button className="btn btn-primary">Log In</button>
              <button className="btn btn-secondary">Register</button>
            </>
          ) : (
            <button className="btn btn-primary">Accept Invitation</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AcceptInvite;
