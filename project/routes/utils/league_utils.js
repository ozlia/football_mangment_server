const axios = require("axios");
const DButils = require("./DButils");
const match_utils = require("./match_utils");
const LEAGUE_ID = 271;
const LEAGUE_NAME = "SUPER LEAGUE";
const api_domain = "https://soccer.sportmonks.com/api/v2.0";
const CURRENT_SEASON = "2020/2021";
const CURRENT_TEAMS = [
  390,  939,  211, 2356,
 2650, 1020,  293, 2394,
 1789,   85, 2905, 7466
];

async function getLeagueDetails() {
  let current_fixture = await match_utils.getCurrentFixture(LEAGUE_ID);
  return {
    league_name: LEAGUE_NAME,
    season_name: CURRENT_SEASON,
    stage_name: current_fixture[0].fixture,
    match: current_fixture[0]
    // next game details should come from DB
  };
}

async function getLeagueId() {
  return LEAGUE_ID;
}

async function getLeagueTeams(league_id){
  return CURRENT_TEAMS;
}

async function assignRefereeToLeague(ref_user_id, league_id) {
  try{
    await DButils.execQuery(
      `INSERT INTO league_referees VALUES('${ref_user_id}','${league_id}')`
    );
  }
  catch (error){
    throw ({status: 400, message: "referee already in the league"})
  }
}

async function getleaguesOfTeam(team_id){
  const leagues = await axios.get(`${api_domain}/teams/${team_id}/current`, {
    params: {
      api_token: process.env.api_token,
    },
  });
  league_ids = [];
  leagues.data.data.map(l => league_ids.push(l.league_id));
  return league_ids;
}

async function getLeagueMatches(league_id){
  const matches = await DButils.execQuery(
    `SELECT * FROM match WHERE league = '${league_id}'`
  );
  return matches;
}


exports.getLeagueDetails = getLeagueDetails;
exports.getLeagueId= getLeagueId;
exports.assignRefereeToLeague = assignRefereeToLeague;
exports.getleaguesOfTeam = getleaguesOfTeam;
exports.getLeagueMatches = getLeagueMatches;
exports.getLeagueTeams = getLeagueTeams;
