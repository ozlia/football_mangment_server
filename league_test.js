// const league = require('../routes/utils/league_utils');
// jest.mock('../routes/utils/match_utils');
// let request = require('supertest');
// let app = require('../main'); 
// const DButils = require('../routes/utils/DButils');


// test('Get league details',  async() => {
//     const res = await league.getLeagueDetails();
//     expect(res.league_name).toBe("SUPER LEAGUE");
//     expect(res.season_name).toBe('2020/2021');
//     // expect(res.stage_name instanceof String).toBeTruthy();
//     expect(res.match).toHaveProperty('match_id',' home_team', 'away_team', 'season', 'fixture', 'court', 'referee_name', 'date', 'score');
    
// });


// test('testing supertest', async() => {
//     request(app).get('/league/ summary').expect(200)
// });


// test('testing assignRefereeToLeague', async () =>{
//     const ref_id = 50; 
//     const league_id = 45; 
//     try{
//         await league.assignRefereeToLeague(ref_id,league_id);
//         const referee_in_league = await DButils.execQuery(
//             `SELECT * FROM league_referees WHERE user_id = '${ref_id}' AND league_id = '${league_id}'`
//           );
//         expect(referee_in_league).toBeDefined();
//         expect(referee_in_league.user_id).toEqual(ref_id);
//         expect(referee_in_league.league_id).toEqual(league_id);
//     }
//     catch(error){
//         console.log(error.message);
//     }
//     finally{
//         await DButils.execQuery(
//             `DELETE * FROM league_referees WHERE user_id = '${ref_id}' AND league_id = '${league_id}'`
//           );
//     }

// });
