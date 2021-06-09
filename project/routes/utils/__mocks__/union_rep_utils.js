async function verifyTeamsFreeOnMatchDate(home_team_name,away_team_name,date){
    return Promise.resolve(true);
}

async function verifyRefInLeague(ref_name){
    return Promise.resolve(true);
}


exports.verifyTeamsFreeOnMatchDate = verifyTeamsFreeOnMatchDate;
exports.verifyRefInLeague = verifyRefInLeague;