export const PokemonDimension = ({ height, weight }) => {
  return (
    <div className="row center">
      <div className="width-100 column center margin-5">
        <h4>Height</h4>
        <div className="pokemon-info-variable-container">{height / 10}m</div>
      </div>
      <div className="width-100 column center margin-5">
        <h4>Weight</h4>
        <div className="pokemon-info-variable-container">{weight / 10}kg</div>
      </div>
    </div>
  );
};
