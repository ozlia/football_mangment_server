const tested_ref = {
  referee_id: 40, //also a referee
  league_id: 271,
};
const tested_match = {
  home_team: "league_test_home_team",
  away_team: "league_test_away_team",
  league: "271",
  season: "2020-2021",
  stage: "Stages level",
  court: "23",
  referee_name: "rafi",
  date: "12-07-2021",
  score: "2-0",
};
const DButils = require("../../routes/utils/DButils");
const league_utils = require("../../routes/utils/league_utils");
const axios = require("axios");
jest.mock("axios");

describe("testing league_utils", () => {
  afterAll(async () => {
    await DButils.pool.close();
  });

  test("testing assignRefereeToLeague", async () => {
    await league_utils.assignRefereeToLeague(
      tested_ref.referee_id,
      tested_ref.league_id
    );
    const referee_in_league = await DButils.execQuery(
      `DELETE FROM league_referees 
                OUTPUT DELETED.*
                WHERE user_id=${tested_ref.referee_id}`
    );
    expect(referee_in_league).toBeDefined();
  });

  test("testing getleaguesOfTeam", async () => {
    axios.get.mockImplementation(() =>
      Promise.resolve({
        data: {
          data: [{
              league_id: tested_ref.league_id
          }]
        },
      })
    );
    const leagues = await league_utils.getleaguesOfTeam("");
    expect(leagues[0]).toBe(tested_ref.league_id);
  });
});