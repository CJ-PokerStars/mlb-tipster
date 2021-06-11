"use strict";
const axios = require("axios");
const { mapFixturesToSelections } = require("./mapper");

module.exports.index = async () => {
  const fixtureData = await axios
    .get(
      "https://sqsjqh3sf0.execute-api.us-east-1.amazonaws.com/dev/mlb/fixtures"
    )
    .then((res) => res.data);

  if (!fixtureData.length) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        message: "No MLB selections today",
      }),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(mapFixturesToSelections(fixtureData)),
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
  };
};
