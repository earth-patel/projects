type ErrorProps = {
  error?: string;
};

const Error = ({ error }: ErrorProps) => {
  if (!error) return null;
  return <div className="error">{error}</div>;
};

export default Error;
