import { FC, ReactNode } from "react";

type CardProps = {
  className?: string;
  backgroundColor?: string;
  children: ReactNode;
};

const Card: FC<CardProps> = ({ className, backgroundColor, children }) => {
  return (
    <div className={`card my-4 ${className || ""}`} style={{ backgroundColor }}>
      {children}
    </div>
  );
};

export default Card;
