type FormErrorProps = {
  error?: string;
};

const FormError = ({ error }: FormErrorProps) => {
  if (!error) return <br />;
  return <div className="error">{error}</div>;
};

export default FormError;
