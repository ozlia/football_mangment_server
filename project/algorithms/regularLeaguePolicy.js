const league_utils = require("../routes/utils/league_utils");
const match_utils = require("../routes/utils/match_utils");

async function genrateLeagueMatches(league_id, season_name){
    let teams = await league_utils.getTeamsBySeasonID(await league_utils.getSeasonID());
    let team_pairs = createPairs(teams);
    let fixture_list = fixture_devide(team_pairs);
    await addMatches(fixture_list, league_id, season_name);
}

function createPairs(teams) {
    let pairs = [];
    let home_bol = true;
    for (let i = 0; i < teams.length; i++) {
        for (let j = i+1; j < teams.length; j++) {
            if (home_bol)
                pairs.push({"home_team": teams[i], "away_team": teams[j]});
            else{
                pairs.push({"home_team": teams[j], "away_team": teams[i]});
            }
            home_bol = !home_bol;
        }
    }
    return pairs;
}

function fixture_devide(pairs) {
    let fixtures = [];
    let placed_matches = new Set();
    while(pairs.length > placed_matches.size){
        let current_fixture = [];
        fixture_scheduled_team = new Set();
        pairs.forEach(pair => {
            if (placed_matches.has(pair) || fixture_scheduled_team.has(pair.home_team.name) || fixture_scheduled_team.has(pair.away_team.name)){
                return;
            }
            current_fixture.push(pair);
            fixture_scheduled_team.add(pair.home_team.name);
            fixture_scheduled_team.add(pair.away_team.name);
            placed_matches.add(pair);
        });
        fixtures.push(current_fixture);
    }
    return fixtures;
}

async function addmatches(fixture_list, league_id, season_name) {
    const referees = await league_utils.getLeagueRefs(league_id);
    if (referees.length < Math.floor( fixture_list[0].length/2)){
        throw({status: 404, message: "not enough referees for the league"});
    }
    let start_season_date = new Date();
    let match_date = new Date();
    for (let i = 0; i < fixture_list.length; i++){
        match_date.setDate(start_season_date.getDate() + (i*7));
        const match_string = date_to_string(match_date); 
        for (let j = 0; j < fixture_list[i].length; j++){
            const match = fixture_list[i][j];
            await match_utils.addMatch({
                home_team: match.home_team.name,
                away_team: match.away_team.name,
                league_id: league_id,
                season: season_name,
                stage: await league_utils.getCurrentStage(),
                court: match.home_team.venue_id,
                referee_name: referees[j].username,
                date: match_string,
                score: NaN
             })
        };
    };
}
function get_full_format(num){
    if (num < 10) { 
        num = '0' + num; 
    }
    return num
}
function date_to_string(date) {
    let month = get_full_format(date.getUTCMonth());
    let day = get_full_format(date.getUTCDay());
    return date.getFullYear() + '-' + month + "-" + day + "T" + date.getUTCHours() + ":" + date.getUTCMinutes() + ":" + date.getUTCSeconds();

    
}

exports.genrateLeagueMatches = genrateLeagueMatches;
exports.createPairs = createPairs; // temp for testing
exports.fixture_devide = fixture_devide; // temp for testing
exports.addmatches = addmatches; // temp for testing