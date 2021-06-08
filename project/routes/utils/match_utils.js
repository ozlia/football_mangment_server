const DButils = require("./DButils");
const eventlog_utils = require("./eventlog_utils");
// const league_utils = require("./league_utils");

async function addMatch(match){
    await DButils.execQuery(
        `INSERT INTO match (home_team, away_team, league, season, stage, court, referee_name, date, score) VALUES
         ('${match.home_team}','${match.away_team}','${match.league_id}', '${match.season}',
        '${match.stage}', '${match.court}', '${match.referee_name}', '${match.date}', NULL)`
      );    
}

/* 
  INPUT: list of matches
  OUTPUT: list of matches with only the relevant data of match that we need. 
*/
async function extractRelevantData(matches){
  let results = [];
  let match_ids = [];
  matches.map(match=>match_ids.push(match.match_id));
  let events = await eventlog_utils.getMatchEvents(match_ids);
  matches.map(match=>results.push({
    
    "match_id": match.match_id,
    "home_team": match.home_team,
    "away_team": match.away_team,
    "court": match.court,
    "season": match.season,
    "referee_name": match.referee_name,
    "date": match.date,
    "eventlog": eventlog_utils.getEventsByMatchId(match.match_id, events),
    "score": match.score
  }))
  return results;
}


async function getCurrentFixture(league_id){
  try{
    const current_stage = await league_utils.getCurrentStage();
    let current_matches = await DButils.execQuery(
      `SELECT * FROM match WHERE stage = '${current_stage}' ORDER BY date ASC`)
      
    return current_matches;
  }
  catch(error){
    throw({status: 400, message: "didnt find available data on league"});
  }
}


async function updateScore(match_id, score){
  try{
    await getMatchById(match_id);
    await DButils.execQuery(
      `UPDATE match 
      SET score = '${score}'
      WHERE match_id = '${match_id}';`
    );
  }
  catch(error){
    throw({status: 404, message: "match_id was not found"});
  }
}

async function getMatchById(match_id){
  let match = await DButils.execQuery(
    `SELECT * FROM match WHERE match_id = '${match_id}'`
  )
  if(match.length == 0){
    throw({status: 404, message: "match_id was not found"});
  }
  return match;
}

/*
INPUT: all matches details
OUTPUT: json file with two lists: pre played matches and post played matches
*/
async function prePostMatches(all_matches){
  let matches = await extractRelevantData(all_matches);
  let post_played = [];
  let pre_played = [];

  matches.map(function(match) {
    if(match.score !=  null){
      post_played.push(match);
    }
    else{
      pre_played.push(match);
    }
  });
  const results = {  pre_played_matches: pre_played, post_played_match: post_played };

  return results;
}

exports.extractRelevantData = extractRelevantData;
exports.addMatch = addMatch;
exports.getCurrentFixture = getCurrentFixture;
exports.prePostMatches = prePostMatches;
exports.updateScore = updateScore;
// exports.addEvent = addEvent;
