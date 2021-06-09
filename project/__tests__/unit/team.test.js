const DButils = require("../../routes/utils/DButils");
const team_utils = require("../../routes/utils/team_utils");
let tested_match = {
    match_id: -1,
    home_team: "team_test_home_team",
    away_team: "team_test_away_team",
    league: "271",
    season: "2020-2021",
    stage: "Stages level",
    court: "23",
    referee_name: "rafi",
    date: "12-07-2021",
    score: "2-0",
  };


describe("testing teams utils", () => {
    beforeAll(async () => {
        // jest.setTimeout(10000);
        const inserted_match_id = await DButils.execQuery(
            `INSERT INTO match (home_team, away_team, league, season, stage, court, referee_name, date, score) 
            OUTPUT INSERTED.match_id
            VALUES
            ('${tested_match.home_team}','${tested_match.away_team}','${tested_match.league}',
             '${tested_match.season}','${tested_match.stage}', '${tested_match.court}', 
             '${tested_match.referee_name}','${tested_match.date}','${tested_match.score}')`
        );
        tested_match.match_id = inserted_match_id[0].match_id;
    });
      
    afterAll(async () => {
    await DButils.execQuery(
        `DELETE FROM match WHERE match_id='${tested_match.match_id}'`
    );
    await DButils.pool.close();
    // Promise.resolve();
    });
    
    test('testing teamMatchesOneDay', async () => {
        const matchesFound = await team_utils.teamMatchesOnDay(tested_match.home_team,tested_match.date);
        expect(matchesFound.length).toBe(1);
        expect(matchesFound[0].match_id).toEqual(tested_match.match_id);
    });
    

    test('testing teamSeasonMatches', async () => {
    const matchesFound = await team_utils.teamSeasonMatches(tested_match.home_team,tested_match.season);
    console.log(tested_match.match_id);
    expect(matchesFound.length).toBe(1);
    expect(matchesFound[0].season).toEqual(tested_match.season);
    });
});
