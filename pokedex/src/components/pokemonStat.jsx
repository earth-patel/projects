import { statMap } from "../app/utils/utils";

export const PokemonStat = ({ stats }) => {
  const getStatName = (stat) => statMap[stat]?.name || stat;

  const getStatBackgroundColor = (stat) =>
    statMap[stat]?.color || "transparent";

  const totalBaseStat = stats.reduce(
    (total, statObj) => total + statObj.base_stat,
    0
  );

  return (
    <>
      <h4>Stats</h4>
      <div className="row center">
        {stats.map((statObj, index) => (
          <div className="current-pokemon-stats-container column" key={index}>
            <div
              className="current-pokemon-stats-name"
              style={{
                backgroundColor: getStatBackgroundColor(statObj.stat.name),
              }}
            >
              {getStatName(statObj.stat.name)}
            </div>
            <h5>{statObj.base_stat}</h5>
          </div>
        ))}
        <div
          className="current-pokemon-stats-container column"
          style={{ backgroundColor: "#88AAEA" }}
        >
          <div
            className="current-pokemon-stats-name"
            style={{ backgroundColor: getStatBackgroundColor("TOT") }}
          >
            {getStatName("TOT")}
          </div>
          <h5>{totalBaseStat}</h5>
        </div>
      </div>
    </>
  );
};
