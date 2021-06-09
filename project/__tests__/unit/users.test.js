const DButils = require("../../routes/utils/DButils");
const users_utils = require("../../routes/utils/users_utils");
var user_id;
var username;
var match_id1;
var match_id2;

describe("testing Authenticaion", () => {
    beforeAll(async () => {
        jest.setTimeout(10000);
        await DButils.execQuery(
            `INSERT INTO match (home_team, away_team, league, season, stage, court, referee_name, date, score) VALUES
             ('testH2','testA','271', 'testS','testG', 'testc', 'testR', 'testD1', NULL)`
        );
        await DButils.execQuery(
            `INSERT INTO match (home_team, away_team, league, season, stage, court, referee_name, date, score) VALUES
             ('testH1','testA','271', 'testS','testG', 'testc', 'testR', 'testD2', NULL)`
        );
        await DButils.execQuery(
        `INSERT INTO users (username, firstname, lastname, country, password, email, profile_picture) VALUES
            ('testU', 'testF', 'testL', 'testC','testP', 'testE', 'testPR')`
        );
        
        const user = await DButils.execQuery(
            `SELECt user_id FROM users WHERE username = 'testU'`
        );
        user_id = user[0].user_id;
        username = user[0].username;
        const match1 = await DButils.execQuery(
            `SELECt match_id FROM match WHERE home_team = 'testH1'`
        );
        match_id1 = match1[0].match_id;
            
        const match2 = await DButils.execQuery(
            `SELECt match_id FROM match WHERE home_team = 'testH2'`);
        match_id2 = match2[0].match_id;

        await DButils.execQuery( `INSERT INTO roles (user_id, role_name) values
        ('${user_id}','referee')`);
    });
      
    afterAll(async () => {
        await DButils.execQuery( `DELETE FROM roles where user_id = ${user_id}`);        
        await DButils.execQuery(
            `DELETE FROM match WHERE match_id = '${match_id1}'`
        );
        await DButils.execQuery(
            `DELETE FROM match WHERE match_id = '${match_id2}'`
        );
        await DButils.execQuery(
            `DELETE FROM users WHERE user_id = '${user_id}'`
        );
        await DButils.pool.close();
    });
    
    // test.skip('mark match as favorite successfuly for KingMessi', async () => {
    //     try{
    //         await users_utils.markMatchAsFavorite(user_id, match_id1);
    //         await users_utils.markMatchAsFavorite(user_id, match_id2);
    //         const match_ids = await DButils.execQuery(
    //             `select match_id from favorite_matches where user_id='${user_id}'`
    //           );
    //           expect (match_ids.length).toBe(2);
    //         }
    //         catch{
    //           throw("failed")
    //         }
    //           finally{
    //             await DButils.execQuery(
    //                 `DELETE FROM favorite_matches WHERE user_id = '${user_id}'`
    //             );
    //         }
    //   });

    test('get roles test', async () => {
        try{
            expect(async () => {
                await users_utils.getUserRoles(user_id).toBe(['referee']);
                }); 
        }
        catch{  
            throw("get roles test failed");
        }
    }); 
    test ('assignRole test', async () => {
        try{
            expect (async () => 
                await users_utils.assignRole(user_id,'union_rep')).not.toThrow();
        }
        catch{
            throw("assignRole test failed");
        }
    });
    test('getFavoriteMatches test', async () => {
        try{
            await DButils.execQuery(
            `insert into favorite_matches values ('${user_id}',${match_id1})`
            );
            expect ((await users_utils.getFavoriteMatches(user_id)).length).toBe(1);
        }
        catch{
            throw("getFavoriteMatches test failed");
        }
        finally{
            await DButils.execQuery(
                `DELETE FROM favorite_matches WHERE user_id = '${user_id}'`);
        }
    });

    
    test ('getUserIdByUsername test', async () => {
        try{
            expect (async () => 
                await users_utils.getUserIdByUsername(username)).toBe(user_id);
        }
        catch{
            throw("getUserIdByUsername test failed");
        }
    });
    
});
