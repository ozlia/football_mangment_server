const DButils = require("./project/routes/utils/DButils");
const { addMatch } = require("./project/routes/utils/match_utils");

test('two plus two is four', () => {
    console.log("tom is a bad guy");
  });
test('add match test', async () => {
  try{
  await addMatch({
    home_team: 'test home team',
    away_team: 'test away team',
    league_id: 271,
    season: '20-21',
    stage: 'round 1',
    court: 1,
    referee_name: 'test ref',
    date: "2021-06-08T16:00:00.000Z",
    score: NaN});
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
    )
    expect (tested_match.length).toBe(1);
  }
  catch{
    throw("add match test failed")
  }
    finally{
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

test('add match invalid league test', async () => {
  try{
    expect(async () => {
      await addMatch({
        home_team: 'test home team',
        away_team: 'test away team',
        league_id: 270,
        season: '20-21',
        stage: 'round 1',
        court: 1,
        referee_name: 'test ref',
        date: "2021-06-08T16:00:00.000Z",
        score: NaN});
    }).toThrow();
  }
    catch(error){
      throw("add match invalid league test failed");
    }
    finally{
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

test('extractRelevantData empty match_list test', async () => {
    expect(async () => {
      await extractRelevantData([]).toBe([]);
    });
});

test('prePostMatches test', async () => {
  try{
  await addMatch({
    home_team: 'test home team',
    away_team: 'test away team',
    league_id: 271,
    season: '20-21',
    stage: 'round 1',
    court: 1,
    referee_name: 'test ref',
    date: "2021-06-08T16:00:00.000Z",
    score: NaN});
    await addMatch({
      home_team: 'test home team',
      away_team: 'test away team',
      league_id: 271,
      season: '20-21',
      stage: 'round 1',
      court: 1,
      referee_name: 'test ref',
      date: "2021-06-08T16:00:00.000Z",
      score: '1:0'});
    const pre_match = await DButils.execQuery(
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
    const post_match = await DButils.execQuery(
      `select * from match where
      home_team = 'test home team' AND 
      away_team = 'test away team' AND 
      league = 271 AND 
      season = '20-21' AND 
      stage = 'round 1' AND 
      court = 1 AND 
      referee_name = 'test ref' AND 
      date = '2020-06-08T16:00:00.000Z'`
    );
    expect(async () => {
      await prePostMatches([pre_match,post_match]).toBe(
        {pre_played_matches: [pre_match],
         post_played_match: [post_match]});
        });

  }
  catch{
    throw("prePostMatches test failed")
  }
    finally{
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
        await DButils.execQuery(
          `DELETE FROM match WHERE 
          home_team = 'test home team' AND 
          away_team = 'test away team' AND 
          league = 271 AND 
          season = '20-21' AND 
          stage = 'round 1' AND 
          court = 1 AND 
          referee_name = 'test ref' AND 
          date = '2020-06-08T16:00:00.000Z'`
        );
  }

});