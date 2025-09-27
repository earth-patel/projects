import { getPokemonTypeColor } from "../app/utils/pokemonTypeColors";

export const PokemonType = ({ type }) => {
  const backgroundColor = getPokemonTypeColor(type);
  return (
    <div className="type-container" style={{ backgroundColor }}>
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </div>
  );
};
