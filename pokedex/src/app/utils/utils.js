import { fetchPokemonDescription, fetchPokemonEvolutionChain, fetchPokemonDetail, setSelectedPokemon, setIsMobile } from "../features/pokemonSlice";

export const handlePokemonClick = (pokemonId, dispatch) => {
    if (!pokemonId) return;

    dispatch(fetchPokemonDetail(pokemonId)).then(({ payload: pokemon }) => {
        if (pokemon) {
            dispatch(setSelectedPokemon(pokemon));
            dispatch(fetchPokemonDescription(pokemon.id)).then(({ payload }) => {
                if (payload) {
                    dispatch(fetchPokemonEvolutionChain(payload.evolution_chain.url));
                }
            });
        }
    });

    if (window.innerWidth < 1100) {
        dispatch(setIsMobile(true));
    }
};

export const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), delay);
    };
}

export const filterIdFromSpeciesURL = (url) => url.match(/\/(\d+)\/$/)[1];

export const statMap = {
    hp: { name: "HP", color: "#DF2140" },
    attack: { name: "ATK", color: "#FF994D" },
    defense: { name: "DEF", color: "#eecd3d" },
    "special-attack": { name: "SpA", color: "#85DDFF" },
    "special-defense": { name: "SpD", color: "#96da83" },
    speed: { name: "SPD", color: "#FB94A8" },
    TOT: { name: "TOT", color: "#7195DC" },
};
