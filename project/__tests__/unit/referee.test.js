const DButils = require("../../routes/utils/DButils");
const referee_utils = require("../../routes/utils/referee_utils");

var user_id;
var user_name;
var league_id = '999';

describe("Referee testing", () => {
    beforeAll(async () => {
        jest.setTimeout(10000);
        await DButils.execQuery(
            `INSERT INTO users (username, firstname, lastname, country, password, email, profile_picture) VALUES
            ('Merfi', 'Rafi', 'Mer', 'Israel','pass', 'r@gmail.com', 'urlImage')`
        );
        const user = await DButils.execQuery(
            `SELECT user_id, username FROM users WHERE username = 'Merfi'`
        );
        user_id = user[0].user_id;
        user_name = user[0].username;
        await DButils.execQuery(
            `INSERT INTO roles (user_id, role_name) VALUES
                ('${user_id}', 'referee')`
        );
        await DButils.execQuery(
            `INSERT INTO league (league_id, league_name) VALUES
                ('${league_id}', 'testLeague')`
        );
        await DButils.execQuery(
            `INSERT INTO league_referees (user_id, league_id) VALUES
                ('${user_id}', '${league_id}')`
        );
    });
      
      afterAll(async () => {
        await DButils.execQuery(
            `DELETE FROM roles WHERE (user_id = '${user_id}' AND role_name = 'referee')`
        );
        await DButils.execQuery(
            `DELETE FROM league_referees WHERE (user_id = '${user_id}' AND league_id = ${league_id})`
        );
        await DButils.execQuery(
            `DELETE FROM league WHERE league_id = '${league_id}'`
        );
        await DButils.execQuery(
            `DELETE FROM users WHERE user_id = '${user_id}'`
        );
        await DButils.pool.close();
      });
    
    test('getRefLeague', async () => {
        try{
            const res = await referee_utils.getRefLeague(user_name);
            expect (res[0].league_id).toBe(league_id);
            }
            catch{
              throw("getRefLeague has failed")
            }
      });
    
});
