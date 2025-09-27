import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import {
  fetchAllPokemonList,
  searchPokemonByName,
  fetchPokemonList,
  resetOffSet,
} from "../app/features/pokemonSlice";
import { debounce } from "../app/utils/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

export const SearchBar = () => {
  const dispatch = useDispatch();
  const searchInputRef = useRef();

  useEffect(() => {
    dispatch(fetchAllPokemonList());
  }, [dispatch]);

  const debouncedSearch = debounce((value) => {
    dispatch(searchPokemonByName(value));
  }, 200);

  const onSearchPokemonHandler = () => {
    const value = searchInputRef.current.value.trim();
    if (value) {
      debouncedSearch(value);
    } else {
      dispatch(resetOffSet());
      dispatch(fetchPokemonList({ reset: true }));
    }
  };

  return (
    <form className="between container search-bar-container">
      <input
        type="text"
        placeholder="Search your Pokemon"
        onChange={onSearchPokemonHandler}
        ref={searchInputRef}
      />
      <button className="start-search-button center">
        <FontAwesomeIcon icon={faMagnifyingGlass} />
      </button>
    </form>
  );
};
