const axios = require("axios");
const DButils = require("./DButils");
const match_utils = require("./match_utils");
const team_utils = require("./team_utils");
const policyFectory = require("../../algorithms/policyFactory");
const LEAGUE_ID = 271;
const LEAGUE_NAME = "SUPER LEAGUE";
const api_domain = "https://soccer.sportmonks.com/api/v2.0";
const CURRENT_SEASON = "2021/2022";
const CURRENT_TEAMS = [
  85, 86, 293, 390,
  939, 1020, 1789, 2356,
  2394, 2447, 2905, 7466
];
const CURRENT_STAGES = [
  'Conference League Play-offs - Final',
  'Championship Round', 'Relegation Round',
  'Regular Season'
];
const SEASON_ID = 18334;
let schedulingPolilcy;

async function getSeasonID(){
  return SEASON_ID;
}

async function getSeasonName(){
  return CURRENT_SEASON;
}

async function getCurrentStage(){
  return CURRENT_STAGES[CURRENT_STAGES.length-1];
}

async function getLeagueDetails() {
  let current_fixture = await match_utils.getCurrentFixture(LEAGUE_ID);
  return {
    league_name: LEAGUE_NAME,
    season_name: CURRENT_SEASON,
    stage_name: await getCurrentStage(),
    match: current_fixture[0]
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

async function getTeamByLeague(team_name, league_id) {
  let team = await team_utils.getTeamsByName(team_name);
  if (team.length > 0 && CURRENT_TEAMS.includes(team[0].id)){
    return team[0];
  }
  throw({status: 404, message: team_name + " was not found"});
}

async function createLeague(league_id, league_name) {
  try{
    await DButils.execQuery(
      `INSERT INTO league VALUES('${league_id}','${league_name}')`
    );
  }
  catch (error){
    throw ({status: 400, message: "somthing went horiblly wrong"})
  }
}

async function getLeagueRefs(league_id) {
  try{
    let ref_names = await DButils.execQuery(
      `SELECT username FROM users join league_referees on users.user_id = league_referees.user_id where league_id = '${league_id}'`
    );
    return ref_names;
  }
  catch (error){
    throw ({status: 400, message: "somthing went horiblly wrong"})
  }
}

async function getTeamsBySeasonID(season_id) {
  return await team_utils.getTeamsBySeasonId(season_id);
}


async function setPolicy(league_id ,policy_name) {
  try{
    schedulingPolilcy = policyFectory.getPolicy(policy_name);
    await DButils.execQuery(
      `INSERT INTO scheduling_policy VALUES('${league_id}','${policy_name}')`
    );
  }
  catch (error){
    throw ({status: 400, message: "somthing went horiblly wrong"})
  }
}

async function runSchedulingPolicy(league_id) {
  try{
    if (schedulingPolilcy == undefined){
      schedulingPolilcy = await getPolicy(league_id);
      if (schedulingPolilcy == null)
        throw({ status: 404, message: "no scheduling policy was set"});
    }
    await schedulingPolilcy(league_id, CURRENT_SEASON);
  }
  catch(error){
    throw(error);
  }
}

async function getPolicy(league_id) {
  let policy_name = await DButils.execQuery(
    `SELECT policy_name from scheduling_policy where league_id = '${league_id}'`
  );
  if (policy_name.length == 0){
    return null;
  }
  return policyFectory.getPolicy(policy_name[0].policy_name);
  
}

exports.getLeagueDetails = getLeagueDetails;
exports.getLeagueId= getLeagueId;
exports.assignRefereeToLeague = assignRefereeToLeague;
exports.getleaguesOfTeam = getleaguesOfTeam;
exports.getLeagueMatches = getLeagueMatches;
exports.getLeagueTeams = getLeagueTeams;
exports.getSeasonID = getSeasonID;
exports.getSeasonName = getSeasonName;
exports.getCurrentStage = getCurrentStage;
exports.getTeamByLeague = getTeamByLeague;
exports.createLeague = createLeague;
exports.setPolicy = setPolicy;
exports.runSchedulingPolicy = runSchedulingPolicy;
exports.getLeagueRefs = getLeagueRefs;
exports.getTeamsBySeasonID = getTeamsBySeasonID;

