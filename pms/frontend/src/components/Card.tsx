interface CardProps {
  title: string;
  subtitle?: string;
  onClick?: () => void;
}

const Card = ({ title, subtitle, onClick }: CardProps) => {
  return (
    <div className="card" onClick={onClick}>
      <h3 className="card-title">{title}</h3>
      {subtitle && <p className="card-subtitle">{subtitle}</p>}
    </div>
  );
};

export default Card;
