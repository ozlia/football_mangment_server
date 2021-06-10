const request = require('supertest');
const app = require("../../main.js");
const cookieParser = require('cookie-parser');
const DButils = require("../../routes/utils/DButils");
app.app.use(cookieParser());
var rep_cookie = "not a real cookie";
var ref_cookie = "not a real cookie";
const ref_name = "testing_ref"
const match = {
    "home_team_name": "AGF",
    "away_team_name": "AaB",
    "date": "2021-09-04T21:52:00",
    "referee_name": "testing_ref"
  };
var ref_id;
jest.setTimeout(10000);


describe("/user/union_representative", ()=> {

    beforeAll(async () => {
        jest.setTimeout(10000);
        await regiserReferee();
        await getURepCookie();
    });

        describe("/unauthorized accses", () => {
            test("send rep no cookie ", async()=> {
            const res = await request(app.app).put("/user/union_representative/assign_referee")
            .set('Cookie', `not a real cookie;`)
            .set('Content-Type', 'application/json').send();
            expect(res.statusCode).toBe(401);
            })
        })

        describe("/assign_referee", () => {
            test("basic assign", async()=> {
            const res = await request(app.app).put("/user/union_representative/assign_referee").set('Cookie', `${rep_cookie};`)
            .set('Content-Type', 'application/json').send({username: ref_name });
            expect(res.statusCode).toBe(200);
            })

            test("user is already a referee", async()=> {
            const res = await request(app.app).put("/user/union_representative/assign_referee").set('Cookie', `${rep_cookie};`)
            .set('Content-Type', 'application/json').send({username: ref_name });
            expect(res.statusCode).toBe(412);
            })
        })
        describe("/createLeague", () => {
            test("basic  league creation", async()=> {
            const res = await request(app.app).post("/user/union_representative/createLeague").set('Cookie', `${rep_cookie};`)
            .set('Content-Type', 'application/json').send({
                "league_id": 100,
                "league_name": "winner"
              });
            expect(res.statusCode).toBe(200);
            })

            test("league creaton with existing id", async()=> {
            const res = await request(app.app).post("/user/union_representative/createLeague").set('Cookie', `${rep_cookie};`)
            .set('Content-Type', 'application/json').send({
                "league_id": 100,
                "league_name": "fail test"
              });
            expect(res.statusCode).toBe(400);
            })
        })

        describe("/match fail", () => {
            test("refree not in league match creation", async()=> {
            const res = await request(app.app).post("/user/union_representative/match").set('Cookie', `${rep_cookie};`)
            .set('Content-Type', 'application/json').send(match);
            expect(res.statusCode).toBe(404);
            })
        })

        describe("/assign reg to superleague", () => {
            test("basic referee league assign", async()=> {
            const res = await request(app.app).put("/user/union_representative/assign_referee_league").set('Cookie', `${rep_cookie};`)
            .set('Content-Type', 'application/json').send({username: ref_name });
            expect(res.statusCode).toBe(200);
            })
        })

        describe("/create match pass", () => {
            test("basic match creation", async()=> {
            const res = await request(app.app).post("/user/union_representative/match").set('Cookie', `${rep_cookie};`)
            .set('Content-Type', 'application/json').send(match);
            expect(res.statusCode).toBe(201);
            })
        })

    afterAll(async () => {
    await DButils.execQuery(`DELETE FROM league_referees WHERE user_id = '${ref_id}'`);    
    await DButils.execQuery(`DELETE FROM roles WHERE user_id = '${ref_id}'`);
    await DButils.execQuery(`DELETE FROM users WHERE username = '${ref_name}'`);
    await DButils.execQuery(`DELETE FROM league WHERE league_id = '100'`);
    await DButils.execQuery(`DELETE FROM match WHERE home_team = 'AGF' AND away_team = 'AaB'`);
    await DButils.pool.close();
    app.server.close();
    });
})



async function regiserReferee(username){
    try{
      let res = await DButils.execQuery(
        `INSERT INTO users (username, firstname, lastname, country, password, email, profile_picture)
         OUTPUT INSERTED.user_id
         VALUES ('${ref_name}', 'testF', 'testL', 'testC','testP', 'testE', 'testPR')`
        );
        ref_id = res[0].user_id;
    }
    catch{
      throw ({message: "create ref for test has a problem"})
    }
}

async function getURepCookie(username){
    try{
        const res = await request(app.app).post("/auth/login").send({username : 'Dani_Uni', password: 'my*pass21'});
        rep_cookie = res.header['set-cookie'][0];
    }
    catch{
      throw ({message: "cookie getter has a problem"})
    }
}
