type ErrorProps = {
  error?: string;
};

const Error = ({ error }: ErrorProps) => {
  if (!error) return <br />;
  return <div className="error">{error}</div>;
};

export default Error;
