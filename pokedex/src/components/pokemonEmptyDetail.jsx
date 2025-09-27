import pokemonFallbackImage from "../assets/images/no-pokemon-selected-image.png";
import { PokemonImage } from "./pokemonImage";

export const PokemonEmptyDetail = () => {
  return (
    <div className="current-pokemon-container container column center">
      <PokemonImage
        src={pokemonFallbackImage}
        className="current-pokemon-image"
      />
      <div>
        <span className="font-size-18">
          Select a Pokemon
          <br />
          to display here.
        </span>
      </div>
    </div>
  );
};
