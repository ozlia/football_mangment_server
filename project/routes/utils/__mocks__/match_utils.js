// const getCurrentFixture = jest.fn( (league_id) => getCurrentFixture(league_id));

async function getCurrentFixture(league_id){
  console.log('mock works');
  return Promise.resolve([{
    match_id: 1,
    home_team: 'The Bunnies',
    away_team: 'The Bunnies',
    season: '2020/2021',
    fixture: 'someFixture',
    court: 'someCourt',
    referee_name: 'Liad Oz',
    date: '2020/11/24',
    score: '0-1'
  }]);
}
// async function addMatch(match){
//     await DButils.execQuery(
//         `INSERT INTO match (home_team, away_team, league, season, fixture, court, referee_name, date, score) VALUES
//          ('${match.home_team}','${match.away_team}','${match.league_id}', '${match.season}',
//         '${match.fixture}', '${match.court}', '${match.referee_name}', '${match.date}', NULL)`
//       );    
// }

// function extractRelevantData(matches){
//   let results = [];
//   matches.map(match=>results.push({
    
//     "match_id": match.match_id,
//     "home_team": match.home_team,
//     "away_team": match.away_team,
//     "court": match.court,
//     "season": match.season,
//     "referee_name": match.referee_name,
//     "date": match.date,
//     "eventlog": [],
//     "score": match.score
//   }))
//   return results;
// }


// function prePostMatches(all_matches){
//   let matches = extractRelevantData(all_matches);
//   let post_played = [];
//   let pre_played = [];

//   matches.map(function(match) {
//     if(match.score !=  null){
//       post_played.push(match);
//     }
//     else{
//       pre_played.push(match);
//     }

//   });
//   const results = {  pre_played_matches: pre_played, post_played_match: post_played};

//   return results;
// }


// exports.extractRelevantData = extractRelevantData;
// exports.addMatch = addMatch;
// exports.getCurrentFixture = getCurrentFixture;
exports.getCurrentFixture = getCurrentFixture;
// exports.prePostMatches = prePostMatches;
