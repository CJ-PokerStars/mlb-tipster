"use strict";
const axios = require("axios");
const { format } = require("date-fns");
const { getTeamData } = require("../utils/getTeamData");
const DIVISIONS = require("../../divisions.json");

const { mapFixtureData } = require("./mapper");

const getDivision = (teamId) => {
  const division = DIVISIONS.find((div) => div.teams.includes(teamId));
  return division.name;
};

module.exports.index = async () => {
  const todaysDate = format(new Date(), "yyyy-MM-dd");
  const { dates } = await axios
    .get(
      `https://bdfed.stitch.mlbinfra.com/bdfed/transform-mlb-schedule?stitch_env=prod&sortTemplate=5&sportId=1&startDate=${todaysDate}&endDate=${todaysDate}&gameType=E&&gameType=S&&gameType=R&&gameType=F&&gameType=D&&gameType=L&&gameType=W&&gameType=A&language=en&leagueId=104&&leagueId=103`
    )
    .then((res) => res.data);

  const todaysData = dates.find(({ date }) => date === todaysDate);

  if (!todaysData) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        message: "No MLB fixtures today",
      }),
    };
  }

  const fixtureData = mapFixtureData(todaysData);
  const teamData = await getTeamData();

  const mashedData = fixtureData.map((fix) => {
    const homeTeamData = teamData.find(({ team }) => team.id === fix.home.id);
    const awayTeamData = teamData.find(({ team }) => team.id === fix.away.id);

    fix.home.stats = homeTeamData;
    fix.home.division = getDivision(fix.home.id);
    fix.away.stats = awayTeamData;
    fix.away.division = getDivision(fix.away.id);

    return fix;
  });

  return {
    statusCode: 200,
    body: JSON.stringify(mashedData),
  };
};
