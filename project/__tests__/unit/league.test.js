const team_utils = require("../../routes/utils/team_utils");
const team_name = "AGF";
const league_id= 271;

let tested_ref = {
  username: "refaelo",
  firstname: "refaelo",
  lastname: "Suban",
  country: "NaorLand",
  password: "Naor",
  email: "Naor@naor.com",
  profile_picture: "Naor.com/imgpath",
};


const teams = [{
  id: 293,
  team_logo: "logo.jpg",
  team_name: team_name
},
{
  id: 3422,
  team_logo: "logo1.jpg",
  team_name: team_name
}]
const tested_match = {
  home_team: "league_test_home_team",
  away_team: "league_test_away_team",
  league: "271",
  season: "2020-2021",
  stage: "Stages level",
  court: "23",
  referee_name: "rafael",
  date: "12-07-2021",
  score: "2-0",
};
const DButils = require("../../routes/utils/DButils");
const league_utils = require("../../routes/utils/league_utils");
const axios = require("axios");
const integrationHelper = require('../../integrationHelper');
jest.mock("axios");

describe("testing league_utils", () => {
  afterAll(async () => {
    await integrationHelper.clean_test_referee_data();
    await DButils.pool.close();
  });
  beforeAll(async () => {
    jest.setTimeout(30000);
    const user = await integrationHelper.make_test_referee(false);
    if (!user) {
      throw "this shouldnt happen but it did. something wrong with make_test_referee";
    }
    tested_ref.id = user[0].user_id;
  });
  beforeEach(async () => {
    jest.setTimeout(10000);
  });
  test("testing assignRefereeToLeague", async () => {

    await league_utils.assignRefereeToLeague(
      tested_ref.id,
      league_id
    );
    const referee_in_league = await DButils.execQuery(
      `DELETE FROM league_referees 
                OUTPUT DELETED.*
                WHERE user_id=${tested_ref.id}`
    );
    expect(referee_in_league).toBeDefined();
  });

  test("testing getleaguesOfTeam", async () => {
    axios.get.mockImplementation(() =>
      Promise.resolve({
        data: {
          data: [{
              league_id: league_id
          }]
        },
      })
    );
    const leagues = await league_utils.getleaguesOfTeam("");
    expect(leagues[0]).toBe(league_id);
  });

  test("testing getTeamByLeague", async () => {
    jest.spyOn(team_utils, 'getTeamsByName').mockImplementation(() =>  Promise.resolve(teams));
    const team_return = await league_utils.getTeamByLeague(
      team_name,
      league_id
      );
      expect(team_return).toEqual(teams[0]);
  });

  test ("getLeagueDetails no stubs", async() => {
    const league_details = await league_utils.getLeagueDetails() 
    // expect(league_details.match).toBeDefined();
    expect(league_details).toBeDefined();

    });
  });



