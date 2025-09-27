import { FC, ReactNode } from "react";

interface CardProps {
  className?: string;
  children: ReactNode;
}

const Card: FC<CardProps> = ({ className, children }) => {
  const cardClass = className || "";
  return <div className={`card ${cardClass}`}>{children}</div>;
};

export default Card;
