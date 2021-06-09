const league_utils = require("./league_utils");
const match_utils = require("./match_utils");
const team_utils = require("./team_utils");
const referee_utils = require("./referee_utils");

// make sure no games are set in this day
async function verifyTeamsFreeOnMatchDate(home_team_name,away_team_name,date){
    let number_of_home_team_matches = await team_utils.teamMatchesOnDay(home_team_name, date);
    let number_of_away_team_matches = await team_utils.teamMatchesOnDay(away_team_name, date);
    if (number_of_home_team_matches.length > 0 || number_of_away_team_matches.length > 0){
        throw({status:400, message: "invalid match day"});
    }

}

// make sure ref is in league //todo maybe should ask league for all his refree or get ref by his name
async function verifyRefInLeague(ref_name){
    let ref_league = (await referee_utils.getRefLeague(ref_name));
    if (ref_league == 0 || ref_league[0].league_id != league_id){
        throw({status: 404, message: "referee is not in this league"});
    }
}


async function checkMatchCreationConstraints(home_team_name, away_team_name, ref_name, date) {
    
        
        try{
            let league_id = await league_utils.getLeagueId();
            
            // make sure both teams are in said league
            let ht = await league_utils.getTeamByLeague(home_team_name, league_id);
            let at = await league_utils.getTeamByLeague(away_team_name, league_id);

            await verifyTeamsFreeOnMatchDate(home_team_name,away_team_name,date);
            await verifyRefInLeague(ref_name);
    
            
            // check court of home team
            let match_court = ht.venue_id
            return {
                home_team: home_team_name,
                away_team: away_team_name,
                league_id: league_id,
                season: await league_utils.getSeasonName(),
                stage: await league_utils.getCurrentStage(),
                court: match_court,
                referee_name: ref_name,
                date: date,
                score: NaN
            }
    }
    catch(error){
        throw(error);
    }
}

async function addMatch(match) {
    await match_utils.addMatch({
        home_team: match.home_team,
        away_team: match.away_team,
        league_id: match.league_id,
        season: match.season,
        stage: match.stage,
        court: match.court,
        referee_name: match.referee_name,
        date: match.date,
        score: NaN
     })
     
}

exports.checkMatchCreationConstraints = checkMatchCreationConstraints;
exports.addMatch = addMatch;