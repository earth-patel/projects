import { memo, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { pokemonSelector } from "./app/features/store";
import { fetchPokemonList } from "./app/features/pokemonSlice";
import { PokemonList } from "./components/pokemonList";
import { PokemonDetail } from "./components/pokemonDetail";
import { SearchBar } from "./components/searchBar";

const MemoizedSearchBar = memo(SearchBar);

function App() {
  const { limit, offset, loading } = useSelector(pokemonSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchPokemonList());
  }, [dispatch]);

  const onScrollHandler = useCallback(() => {
    if (loading) return;

    const container = document.getElementById("app-container");
    const { scrollTop, scrollHeight, clientHeight } = container;

    if (scrollTop + 100 >= scrollHeight - clientHeight) {
      dispatch(fetchPokemonList({ limit, offset }));
    }
  }, [loading, dispatch, limit, offset]);

  return (
    <div id="app-container" onScroll={onScrollHandler}>
      <div id="pokemon-list" className="column">
        <MemoizedSearchBar />
        <PokemonList />
      </div>
      <PokemonDetail />
    </div>
  );
}

export default App;
