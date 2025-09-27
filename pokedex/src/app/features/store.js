import { configureStore } from "@reduxjs/toolkit";
import pokemonReducer from "./pokemonSlice";

export const store = configureStore({
    reducer: {
        pokemonSlice: pokemonReducer,
    },
})

export const pokemonSelector = (s => s.pokemonSlice);
