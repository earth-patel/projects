import { useDispatch } from "react-redux";
import { getPokemonTypeColor } from "../app/utils/pokemonTypeColors";
import closeIcon from "../assets/images/close-icon.png";

export const PokemonResponsiveBackground = ({
  isMobile,
  setIsMobile,
  types,
}) => {
  const dispatch = useDispatch();

  const closePokemonInfoHandler = () => {
    dispatch(setIsMobile(false));
  };

  return (
    <>
      <div
        className={`current-pokemon-responsive-background ${
          isMobile ? "" : "hide"
        }`}
        style={
          isMobile
            ? {
                background: getPokemonTypeColor(types[0].type.name),
                opacity: "1",
              }
            : {}
        }
      ></div>
      <div
        className={`current-pokemon-responsive-close ${isMobile ? "" : "hide"}`}
        onClick={closePokemonInfoHandler}
      >
        <img src={closeIcon} alt="close-icon" />
      </div>
    </>
  );
};
