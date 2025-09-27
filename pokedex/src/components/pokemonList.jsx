import { useSelector } from "react-redux";
import { pokemonSelector } from "../app/features/store";
import { PokemonCard } from "./pokemonCard";

export const PokemonList = () => {
  const { pokemonList } = useSelector(pokemonSelector);

  return (
    <div>
      <div className="pokedex-list-render-container">
        {pokemonList.map((pokemon, index) => (
          <PokemonCard key={index} {...pokemon} />
        ))}
      </div>
    </div>
  );
};
