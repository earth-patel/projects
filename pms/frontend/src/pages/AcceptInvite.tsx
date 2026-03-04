const AcceptInvite = () => {
  return (
    <div className="page-center">
      <div className="content-card content-card-sm content-card-centered">
        <div className="mb-3">
          <h2 className="heading">You're Invited 🎉</h2>
        </div>

        <div className="mb-3">
          <div className="title">
            Join <strong>Kreattix</strong> as a <strong>Member</strong>.
          </div>

          <div className="subtitle mt-1">
            Log in or create an account to accept this invitation. Your
            invitation will be waiting after you sign in.
          </div>
        </div>

        <div className="card-actions">
          <button className="btn btn-primary">Log In</button>
          <button className="btn btn-secondary">Register</button>
        </div>
      </div>
    </div>
  );
};

export default AcceptInvite;
