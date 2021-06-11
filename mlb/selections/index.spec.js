const { index } = require("./index");
const nock = require("nock");
const MockDate = require("mockdate");

const MOCK_RESPONSE = require("../../mockSelectionsResponse.json");

describe("/mlb/selections endpoint", () => {
  beforeAll(() => {
    MockDate.set("2021-06-11");
  });

  describe("when API returns a successful response", () => {
    const scope = nock("https://sqsjqh3sf0.execute-api.us-east-1.amazonaws.com")
      .get("/dev/mlb/fixtures")
      .reply(200, MOCK_RESPONSE);
    let statusCode, body;

    beforeAll(async () => {
      ({ statusCode, body } = await index());
      body = JSON.parse(body);
    });

    test("returns a 200 status code", () => {
      expect(statusCode).toBe(200);
    });

    test("returns an array of selections", () => {
      expect(body.length).toBe(3);
      expect(Object.keys(body[0])).toEqual(["selection", "logo", "date"]);
    });

    describe("selections", () => {
      describe("home selection", () => {
        test("returns selection date", () => {
          expect(body[0].date).toEqual("12-06-2021 @ 00:10");
        });

        test("returns selection logo", () => {
          expect(body[0].logo).toEqual("NYM.png");
        });

        test("returns selection name", () => {
          expect(body[0].selection).toEqual("New York Mets");
        });
      });

      describe("away selection", () => {
        test("returns selection date", () => {
          expect(body[2].date).toEqual("12-06-2021 @ 00:10");
        });

        test("returns selection logo", () => {
          expect(body[2].logo).toEqual("CWS.png");
        });

        test("returns selection name", () => {
          expect(body[2].selection).toEqual("Chicago White Sox");
        });
      });
    });
  });

  describe("when API returns a unsuccessful response", () => {
    const scope = nock("https://sqsjqh3sf0.execute-api.us-east-1.amazonaws.com")
      .get("/dev/mlb/fixtures")
      .reply(200, []);
    let statusCode, body;

    beforeAll(async () => {
      ({ statusCode, body } = await index());
      body = JSON.parse(body);
    });

    test("returns a 404 status code", () => {
      expect(statusCode).toBe(404);
    });

    test("returns 'No MLB fixtures today' message", () => {
      expect(body.message).toEqual("No MLB selections today");
    });
  });
});
