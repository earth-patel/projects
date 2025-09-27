import { useDispatch, useSelector } from "react-redux";
import { pokemonSelector } from "../app/features/store";
import { filterIdFromSpeciesURL } from "../app/utils/utils";
import { handlePokemonClick } from "../app/utils/utils";

const EvolutionStage = ({ species }) => {
  const dispatch = useDispatch();
  if (!species) return null;

  const pokemonId = filterIdFromSpeciesURL(species.url);

  return (
    <img
      className="current-pokemon-evolution-image"
      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`}
      alt={species.name}
      title={species.name}
      onClick={() => handlePokemonClick(pokemonId, dispatch)}
    />
  );
};

const EvolutionLevel = ({ level }) => (
  <div className="current-pokemon-evolution-level-container font-size-12 bold">
    {level ? `Lv. ${level}` : "?"}
  </div>
);

const EvolutionChain = ({ stage, nextStage }) => {
  if (!stage?.species) return null;

  return (
    <>
      <EvolutionStage
        key={`stage-${stage.species.name}`}
        species={stage.species}
      />
      {nextStage && (
        <>
          <EvolutionLevel
            key={`level-${nextStage.species.name}`}
            level={nextStage.evolution_details[0]?.min_level}
          />
          <EvolutionChain
            stage={nextStage}
            nextStage={nextStage.evolves_to[0]}
          />
        </>
      )}
    </>
  );
};

export const PokemonEvolution = () => {
  const { showEvolutionContainer, pokemonEvolutionData } =
    useSelector(pokemonSelector);

  if (!showEvolutionContainer || !pokemonEvolutionData?.chain?.species)
    return null;

  return (
    <div id="current-pokemon-evolution-chain-container">
      <h4>Evolution</h4>
      <div className="row center">
        <EvolutionChain
          stage={pokemonEvolutionData.chain}
          nextStage={pokemonEvolutionData.chain.evolves_to[0]}
        />
      </div>
    </div>
  );
};
