import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPokemonDetail } from "../app/features/pokemonSlice";
import { pokemonSelector } from "../app/features/store";
import { filterIdFromSpeciesURL, handlePokemonClick } from "../app/utils/utils";
import { PokemonImage } from "./pokemonImage";
import { PokemonInfo } from "./pokemonInfo";

export const PokemonCard = ({ url }) => {
  const dispatch = useDispatch();
  const { pokemonData } = useSelector(pokemonSelector);
  const pokemonId = filterIdFromSpeciesURL(url);
  const pokemon = pokemonData[pokemonId];

  useEffect(() => {
    if (!pokemon) {
      dispatch(fetchPokemonDetail(pokemonId));
    }
  }, [dispatch, pokemonId, pokemon]);

  if (!pokemon) return null;

  return (
    <div
      className="pokemon-render-result-container container center column"
      onClick={() => handlePokemonClick(pokemonId, dispatch)}
    >
      <PokemonImage
        src={pokemon.sprites?.front_default}
        className="search-pokemon-image"
      />
      <PokemonInfo
        rank={pokemon.id}
        name={pokemon.name}
        types={pokemon.types}
      />
    </div>
  );
};
