const DButils = require("../../routes/utils/DButils");
const match_utils = require("../../routes/utils/match_utils");
const { addMatch } = require("../../routes/utils/match_utils");
const { extractRelevantData } = require("../../routes/utils/match_utils");
const { prePostMatches } = require("../../routes/utils/match_utils");
const { updateScore } = require("../../routes/utils/match_utils");

var user_id;
var user_id;
var match_id1;
var match_id2;

describe("testing Authenticaion", () => {
  beforeAll(async () => {
    jest.setTimeout(10000);
    await DButils.execQuery(
      `INSERT INTO match (home_team, away_team, league, season, stage, court, referee_name, date, score) VALUES
      ('AGF','AaB','271', '2020-2021','Stages level', '21', 'ref', '12-06-2021', NULL)`
    );
    await DButils.execQuery(
      `INSERT INTO match (home_team, away_team, league, season, stage, court, referee_name, date, score) VALUES
      ('Renders','Maccabi Haifa','271', '2020-2021','Stages level', '23', 'rafi', '12-07-2021', '2-0')`
    );
    // await DButils.execQuery(
    //   `INSERT INTO users (username, firstname, lastname, country, password, email, profile_picture) VALUES
    //   ('naors', 'Naor', 'Suban', 'Israel','Bb123456', 'ns@gmail.com', '/myimage/yay/jps')`
    // );
    
    // const user = await DButils.execQuery(
    //   `SELECt user_id FROM users WHERE username = 'naors'`
    //   );
    //   user_id = user[0].user_id;
      
      const match1 = await DButils.execQuery(
        `SELECt match_id FROM match WHERE home_team = 'AGF'`
        );
        match_id1 = match1[0].match_id;
        
        const match2 = await DButils.execQuery(
          `SELECt match_id FROM match WHERE home_team = 'Renders'`
          );
          match_id2 = match2[0].match_id;
        });
  afterAll(async () => {
    await DButils.execQuery(
      `DELETE FROM match WHERE match_id = '${match_id1}'`
    );
    await DButils.execQuery(
      `DELETE FROM match WHERE match_id = '${match_id2}'`
    );
    // await DButils.execQuery(`DELETE FROM users WHERE user_id = '${user_id}'`);
    await DButils.pool.close();
  });

  test("two plus two is four", () => {
    console.log("tom is a bad guy");
  });
  test("add match test", async () => {
    try {
      await addMatch({
        home_team: "test home team",
        away_team: "test away team",
        league_id: 271,
        season: "20-21",
        stage: "round 1",
        court: 1,
        referee_name: "test ref",
        date: "2021-06-08T16:00:00.000Z",
        score: NaN,
      });
      const tested_match = await DButils.execQuery(
        `select * from match where
      home_team = 'test home team' AND 
      away_team = 'test away team' AND 
      league = 271 AND 
      season = '20-21' AND 
      stage = 'round 1' AND 
      court = 1 AND 
      referee_name = 'test ref' AND 
      date = '2021-06-08T16:00:00.000Z'`
      );
      expect(tested_match.length).toBe(1);
    } catch {
      throw "add match test failed";
    } finally {
      await DButils.execQuery(
        `DELETE FROM match WHERE 
          home_team = 'test home team' AND 
          away_team = 'test away team' AND 
          league = 271 AND 
          season = '20-21' AND 
          stage = 'round 1' AND 
          court = 1 AND 
          referee_name = 'test ref' AND 
          date = '2021-06-08T16:00:00.000Z'`
      );
    }
  });

  test("add match invalid league test", async () => {
    try {
      expect(async () => {
        await addMatch({
          home_team: "test home team",
          away_team: "test away team",
          league_id: 270,
          season: "20-21",
          stage: "round 1",
          court: 1,
          referee_name: "test ref",
          date: "2021-06-08T16:00:00.000Z",
          score: NaN,
        });
      });
    } catch (error) {
      throw error;
    } finally {
      await DButils.execQuery(
        `DELETE FROM match WHERE 
          home_team = 'test home team' AND 
          away_team = 'test away team' AND 
          league = 270 AND 
          season = '20-21' AND 
          stage = 'round 1' AND 
          court = 1 AND 
          referee_name = 'test ref' AND 
          date = '2021-06-08T16:00:00.000Z'`
      );
    }
  });

  test("extractRelevantData empty match_list test", async () => {
    expect(async () => {
      await extractRelevantData([]).toBe([]);
    });
  });

  test("get exists match id  test", async () => {
    try {
      const returnMatch = await match_utils.getMatchById(match_id1);
      expect(returnMatch.length).toBe(1);
    } catch (error) {
      throw "match_id invalid";
    }
  });

  test("prePostMatches test", async () => {
    try {

      const pre_match = await DButils.execQuery(
        `select * from match where match_id = ${match_id1} `
      );
      const post_match = await DButils.execQuery(
        `select * from match where match_id = ${match_id2} `
      );
      expect(async () => {
        await prePostMatches([pre_match, post_match]).toBe({
          pre_played_matches: [pre_match],
          post_played_match: [post_match],
        });
      });
    } catch {
      throw "prePostMatches test failed";
    }
  });

  test("prePostMatches no matches test", async () => {
    try {

      const pre_match = [];
      const post_match = [];
      expect(async () => {
        await prePostMatches([pre_match, post_match]).toBe({
          pre_played_matches: [pre_match],
          post_played_match: [post_match],
        });
      });
    } catch {
      throw "prePostMatches  no match test failed";
    }
  });

  test("updateScore", async() => {
    try {
      const new_score = "2-1"
      match_utils.updateScore(match_id2,new_score);
      expect(async () => {
        await DButils.execQuery(
          `select score from match where match_id = ${match_id2}`).toBe(new_score);
      });
    } catch {
      throw "updateScore test failed";
    }
    finally {
      const old_score = '2-0'
      await DButils.execQuery(
        `update match set score = ${old_score} where match_id = ${match_id2}`);
    }
  });


});