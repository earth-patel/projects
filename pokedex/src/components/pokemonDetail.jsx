import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { pokemonSelector } from "../app/features/store";
import { setIsMobile } from "../app/features/pokemonSlice";
import { debounce } from "../app/utils/utils";
import { PokemonImage } from "./pokemonImage";
import { PokemonInfo } from "./pokemonInfo";
import { PokemonDescription } from "./pokemonDescription";
import { PokemonDimension } from "./pokemonDimension";
import { PokemonAbility } from "./pokemonAbility";
import { PokemonStat } from "./pokemonStat";
import { PokemonResponsiveBackground } from "./pokmonResponsiveBackground";
import { PokemonEmptyDetail } from "./pokemonEmptyDetail";
import { PokemonEvolution } from "./pokemonEvolution";

export const PokemonDetail = () => {
  const dispatch = useDispatch();
  const { selectedPokemon, isMobile, loadingDescription, loadingChain } =
    useSelector(pokemonSelector);

  const handleResize = useCallback(() => {
    if (isMobile && window.innerWidth < 1100) {
      document.getElementById("app-container").style.overflow = "hidden";
    } else {
      document.getElementById("app-container").style.overflow = "auto";
    }
  }, [isMobile]);

  useEffect(() => {
    handleResize();
    const debouncedResizeHandler = debounce(handleResize, 100);
    window.addEventListener("resize", debouncedResizeHandler);

    // Cleanup
    return () => window.removeEventListener("resize", debouncedResizeHandler);
  }, [handleResize, dispatch, selectedPokemon]);

  if (!selectedPokemon) {
    return <PokemonEmptyDetail />;
  }

  const spriteVersions =
    selectedPokemon.sprites.versions["generation-v"]["black-white"];
  const pokemonImageSrc =
    spriteVersions.animated.front_default || spriteVersions.front_default;

  return (
    <>
      <PokemonResponsiveBackground
        isMobile={isMobile}
        setIsMobile={setIsMobile}
        types={selectedPokemon.types}
      />
      <div
        className="current-pokemon-container container column center"
        style={isMobile ? { display: "flex" } : {}}
      >
        {loadingDescription || loadingChain ? (
          <div>Loading...</div>
        ) : (
          <>
            <PokemonImage
              src={pokemonImageSrc}
              name={selectedPokemon.name}
              className="current-pokemon-image"
              simulateHeight
            />
            <div className="current-pokemon-info">
              <PokemonInfo
                rank={selectedPokemon.id}
                name={selectedPokemon.name}
                types={selectedPokemon.types}
              />
              <PokemonDescription description={selectedPokemon.description} />
              <PokemonDimension
                height={selectedPokemon.height}
                weight={selectedPokemon.weight}
              />
              <PokemonAbility abilities={selectedPokemon.abilities} />
              <PokemonStat stats={selectedPokemon.stats} />
              <PokemonEvolution />
            </div>
          </>
        )}
      </div>
    </>
  );
};
