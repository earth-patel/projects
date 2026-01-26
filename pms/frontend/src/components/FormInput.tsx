import { forwardRef } from 'react';

import Error from './Error';

type FormInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
};

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ error, ...props }, ref) => {
    return (
      <>
        <input ref={ref} {...props} />
        <Error error={error} />
      </>
    );
  }
);

export default FormInput;
