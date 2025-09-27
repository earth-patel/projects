import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "https://pokeapi.co/api/v2/pokemon/";
const SPECIES_URL = "https://pokeapi.co/api/v2/pokemon-species/";

const initialState = {
    pokemonList: [],
    allPokemonList: [],
    pokemonData: {},
    pokemonEvolutionData: {},
    selectedPokemon: null,
    limit: 20,
    offset: 0,
    isMobile: false,
    loading: false,
    loadingDescription: false,
    loadingChain: false,
    showEvolutionContainer: false,
};

const fetchData = async (url) => axios.get(url).then(({ data }) => data);

export const fetchPokemonList = createAsyncThunk("fetchPokemonList", async ({ limit = 20, offset = 0, reset = false } = {}) => {
    const data = await fetchData(`${BASE_URL}?offset=${offset}&limit=${limit}`);
    return { data: data.results, reset };
});

export const fetchPokemonDetail = createAsyncThunk("fetchPokemonDetail", (id) => fetchData(`${BASE_URL}${id}`));
export const fetchPokemonDescription = createAsyncThunk("fetchPokemonDescription", (id) => fetchData(`${SPECIES_URL}${id}`));
export const fetchAllPokemonList = createAsyncThunk("fetchAllPokemonList", () => (fetchData(`${BASE_URL}?limit=1000`)));
export const fetchPokemonEvolutionChain = createAsyncThunk("fetchPokemonEvolutionChain", (url) => fetchData(url));

const dressUpPayloadValue = (string) => {
    return string.replace(/\s+/g, ' ').trim().replace(/^./, (char) => char.toUpperCase());
};

const pokemonSlice = createSlice({
    name: "pokemon",
    initialState,
    reducers: {
        setSelectedPokemon: (state, action) => { state.selectedPokemon = action.payload; },
        setIsMobile: (state, action) => { state.isMobile = action.payload; },
        searchPokemonByName: (state, action) => {
            const searchQuery = action.payload.toLowerCase();
            state.pokemonList = state.allPokemonList.filter(({ name }) => name.toLowerCase().includes(searchQuery)).slice(0, 20);
        },
        resetOffSet: (state) => { state.offset = 0; }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPokemonList.pending, (state) => { state.loading = true; })
            .addCase(fetchPokemonList.fulfilled, (state, { payload: { data, reset } }) => {
                state.pokemonList = reset ? data : [...state.pokemonList, ...data];
                state.offset += state.limit;
                state.loading = false;
            })
            .addCase(fetchPokemonList.rejected, (state) => { state.loading = false; })
            .addCase(fetchPokemonDetail.fulfilled, (state, { payload }) => { state.pokemonData[payload.id] = payload; })
            .addCase(fetchPokemonDescription.pending, (state) => { state.loadingDescription = true; })
            .addCase(fetchPokemonDescription.fulfilled, (state, { payload }) => {
                const descriptionEntry = payload.flavor_text_entries.find(entry => entry.language.name === 'en');
                if (descriptionEntry) {
                    state.selectedPokemon.description = dressUpPayloadValue(descriptionEntry.flavor_text);
                }
                state.loadingDescription = false;
            })
            .addCase(fetchPokemonDescription.rejected, (state) => { state.loadingDescription = false; })
            .addCase(fetchAllPokemonList.fulfilled, (state, { payload }) => { state.allPokemonList = payload.results; })
            .addCase(fetchPokemonEvolutionChain.pending, (state) => { state.loadingChain = true; })
            .addCase(fetchPokemonEvolutionChain.fulfilled, (state, { payload }) => {
                state.pokemonEvolutionData = payload;
                if (payload.chain.evolves_to.length != 0) {
                    state.showEvolutionContainer = true;
                } else {
                    state.showEvolutionContainer = false;
                }
                state.loadingChain = false;
            })
            .addCase(fetchPokemonEvolutionChain.rejected, (state) => { state.loadingChain = false; })
    }
});

export const { setSelectedPokemon, setIsMobile, searchPokemonByName, resetOffSet } = pokemonSlice.actions;
export default pokemonSlice.reducer;
