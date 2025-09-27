export const PokemonImage = ({ src, name, className, simulateHeight }) => {
  const handleImageLoad = (e) => {
    e.target.style.height = "auto";
    const renderedHeight = e.target.height;
    e.target.style.height = `${renderedHeight * 3}px`;
  };

  return (
    <img
      src={src}
      alt={name}
      className={className}
      onLoad={simulateHeight ? handleImageLoad : null}
    />
  );
};
