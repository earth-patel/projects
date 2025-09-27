export const PokemonAbility = ({ abilities }) => {
  return (
    <div className="column">
      <h4>Abilities</h4>
      <div className="row">
        {abilities.map((abilityObj, index) => (
          <div className="pokemon-info-variable-container" key={index}>
            {abilityObj.ability.name.charAt(0).toUpperCase() +
              abilityObj.ability.name.slice(1)}
          </div>
        ))}
      </div>
    </div>
  );
};
