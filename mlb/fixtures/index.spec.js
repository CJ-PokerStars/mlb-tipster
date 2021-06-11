const { index } = require("./index");
const nock = require("nock");
const MockDate = require("mockdate");

const MOCK_RESPONSE = require("../../mockFixturesResponse.json");

describe("/mlb/fixtures endpoint", () => {
  beforeAll(() => {
    MockDate.set("2021-06-09");
  });

  describe("when API returns a successful response", () => {
    const scope = nock("https://bdfed.stitch.mlbinfra.com")
      .get(
        "/bdfed/transform-mlb-schedule?stitch_env=prod&sortTemplate=5&sportId=1&startDate=2021-06-09&endDate=2021-06-09&gameType=E&&gameType=S&&gameType=R&&gameType=F&&gameType=D&&gameType=L&&gameType=W&&gameType=A&language=en&leagueId=104&&leagueId=103"
      )
      .reply(200, MOCK_RESPONSE);
    let statusCode, body;

    beforeAll(async () => {
      ({ statusCode, body } = await index());
      body = JSON.parse(body);
    });

    test("returns a 200 status code", () => {
      expect(statusCode).toBe(200);
    });

    test("returns response body with array of games", () => {
      expect(body).toBeInstanceOf(Array);
      expect(body.length).toBe(2);
      expect(Object.keys(body[0])).toEqual([
        "gameString",
        "date",
        "home",
        "away",
      ]);
    });

    describe("games", () => {
      test("return correct team data", () => {
        expect(body[0].home).toEqual({
          abbreviation: "TEX",
          division: "American League West",
          id: 140,
          name: "Texas Rangers",
          probablePitcher: {
            era: "2.13",
            name: "Kyle Gibson",
          },
          stats: {
            divisionRecords: [
              {
                division: {
                  id: 200,
                  link: "/api/v1/divisions/200",
                  name: "American League West",
                },
                losses: 14,
                pct: ".364",
                wins: 8,
              },
              {
                division: {
                  id: 201,
                  link: "/api/v1/divisions/201",
                  name: "American League East",
                },
                losses: 10,
                pct: ".524",
                wins: 11,
              },
              {
                division: {
                  id: 202,
                  link: "/api/v1/divisions/202",
                  name: "American League Central",
                },
                losses: 6,
                pct: ".400",
                wins: 4,
              },
            ],
            leagueRecord: { losses: 39, pct: ".381", wins: 24 },
            overallRecords: [
              { losses: 16, pct: ".484", type: "home", wins: 15 },
              { losses: 23, pct: ".281", type: "away", wins: 9 },
            ],
            runDifferential: -54,
            streak: { streakCode: "W1", streakNumber: 1, streakType: "wins" },
            team: { id: 140 },
            winningPercentage: ".381",
          },
        });
        expect(body[0].away).toEqual({
          abbreviation: "SF",
          division: "National League West",
          id: 137,
          name: "San Francisco Giants",
          probablePitcher: {
            era: "1.56",
            name: "Zack Littell",
          },
          stats: {
            divisionRecords: [
              {
                division: {
                  id: 203,
                  link: "/api/v1/divisions/203",
                  name: "National League West",
                },
                losses: 11,
                pct: ".593",
                wins: 16,
              },
              {
                division: {
                  id: 204,
                  link: "/api/v1/divisions/204",
                  name: "National League East",
                },
                losses: 4,
                pct: ".600",
                wins: 6,
              },
              {
                division: {
                  id: 205,
                  link: "/api/v1/divisions/205",
                  name: "National League Central",
                },
                losses: 4,
                pct: ".733",
                wins: 11,
              },
            ],
            leagueRecord: { losses: 23, pct: ".623", wins: 38 },
            overallRecords: [
              { losses: 9, pct: ".667", type: "home", wins: 18 },
              { losses: 14, pct: ".588", type: "away", wins: 20 },
            ],
            runDifferential: 74,
            streak: { streakCode: "L1", streakNumber: 1, streakType: "losses" },
            team: { id: 137 },
            winningPercentage: ".623",
          },
        });
      });

      test("returns response body with a gameSting", () => {
        expect(body[0].gameString).toEqual(
          "San Francisco Giants @ Texas Rangers"
        );
      });

      test("returns response body with a date", () => {
        expect(body[0].date).toEqual("2021-06-09T18:05:00Z");
      });
    });
  });

  describe("when API returns a unsuccessful response", () => {
    const scope = nock("https://bdfed.stitch.mlbinfra.com")
      .get(
        "/bdfed/transform-mlb-schedule?stitch_env=prod&sortTemplate=5&sportId=1&startDate=2021-06-09&endDate=2021-06-09&gameType=E&&gameType=S&&gameType=R&&gameType=F&&gameType=D&&gameType=L&&gameType=W&&gameType=A&language=en&leagueId=104&&leagueId=103"
      )
      .reply(200, {
        dates: [],
      });
    let statusCode, body;

    beforeAll(async () => {
      ({ statusCode, body } = await index());
      body = JSON.parse(body);
    });

    test("returns a 404 status code", () => {
      expect(statusCode).toBe(404);
    });

    test("returns 'No MLB fixtures today' message", () => {
      expect(body.message).toEqual("No MLB fixtures today");
    });
  });
});
