import { PokemonType } from "./pokemonType";

export const PokemonInfo = ({ rank, name, types }) => {
  return (
    <>
      <span className="font-size-12 bold">N° {rank}</span>
      <h3>{name.charAt(0).toUpperCase() + name.slice(1)}</h3>
      <div className="row center">
        <div className="row">
          {types.map((typeObj, index) => (
            <PokemonType key={index} type={typeObj.type.name} />
          ))}
        </div>
      </div>
    </>
  );
};
