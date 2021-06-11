const axios = require("axios");

const pruneTeamRecord = (teamRecord) => {
  const { streak, leagueRecord, runDifferential, winningPercentage } =
    teamRecord;
  return {
    team: {
      id: teamRecord.team.id,
    },
    streak,
    leagueRecord,
    divisionRecords: teamRecord.records.divisionRecords,
    overallRecords: teamRecord.records.overallRecords,
    runDifferential,
    winningPercentage,
  };
};

const getTeamData = async () => {
  const { records } = await axios
    .get(
      "https://statsapi.mlb.com/api/v1/standings?leagueId=103,104&season=2021&standingsTypes=regularSeason"
    )
    .then((res) => res.data);

  return records
    .map((league) => {
      return league.teamRecords;
    })
    .flat()
    .map((teamRecord) => pruneTeamRecord(teamRecord));
};

module.exports = { getTeamData };
