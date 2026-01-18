type Props = {
  message?: string;
};

const FormError = ({ message }: Props) => {
  if (!message) return <br />;
  return <div className="error">{message}</div>;
};

export default FormError;
