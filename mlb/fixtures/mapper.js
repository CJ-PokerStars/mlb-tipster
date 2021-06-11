const mapPitcherStats = (pitcher) => {
  if (!pitcher) return {};
  const pitchingStats = pitcher.stats.find(
    (stat) =>
      stat.type.displayName === "statsSingleSeason" &&
      stat.group.displayName === "pitching"
  );
  return {
    name: pitcher.fullName,
    era: pitchingStats.stats.era,
  };
};

const mapFixtureData = ({ games }) => {
  return games.map((game) => {
    const { abbreviation, id, name } = game.teams.home.team;
    return {
      gameString: `${game.teams.away.team.name} @ ${game.teams.home.team.name}`,
      date: game.gameDate,
      home: {
        id,
        name,
        abbreviation,
        probablePitcher: mapPitcherStats(game.teams.home.probablePitcher),
      },
      away: {
        id: game.teams.away.team.id,
        name: game.teams.away.team.name,
        abbreviation: game.teams.away.team.abbreviation,
        probablePitcher: mapPitcherStats(game.teams.away.probablePitcher),
      },
    };
  });
};

module.exports = { mapFixtureData };
