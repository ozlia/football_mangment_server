const request = require('supertest');
const app = require("../../main.js");
const cookieParser = require('cookie-parser');
const DButils = require("../../routes/utils/DButils");
const reg_user = {
    "username": "KingMessi",
    "firstname": "May",
    "lastname": "Suban",
    "country": "string",
    "password": "my*pass21",
    "email": "Suban@gmail.com",
    "profile picture": "https://res.cloudinary.com/dswkzsdoq/image/upload/v1620738869/20171122_132608_zvrw97.jpg"
  };
app.app.use(cookieParser());
var user_cookie1 = "";


describe("/auth", ()=> {

    describe("/regiser", () => {
        test("basic register", async()=> {
        const res = await request(app.app).post("/auth/register").send(reg_user);
        expect(res.statusCode).toBe(201);
        })
        test("user name exists register", async()=> {
            const res = await request(app.app).post("/auth/register").send(reg_user);
            expect(res.statusCode).toBe(409);
        })
    })
    describe("/login", () => {
        test("basic login", async()=> {
        const res = await request(app.app).post("/auth/login").send({username : reg_user.username, password: reg_user.password});
        user_cookie1 = res.header['set-cookie'][0];
        // user_cookie2 = res.cookies;
        expect(res.statusCode).toBe(200);
        })
        test("user name dosent exists login", async()=> {
            const res = await request(app.app).post("/auth/login").send({username : "wronguser", password: reg_user.password});
            expect(res.statusCode).toBe(401);
        })
        test("user name is union_rep login", async()=> {
            const res = await request(app.app).post("/auth/login").send({username : "Dani_Uni", password: reg_user.password});
            expect(res.body.roles).toEqual(expect.arrayContaining(['union_rep']));
        })
    })
    describe("/logout", () => {
        test("basic logout", async()=> {
        const res = await request(app.app).post("/user/logout").set('Cookie', `${user_cookie1};`)
        .set('Content-Type', 'application/json')
        .send({});
        expect(res.statusCode).toBe(200);
        })
        test("no login logout", async()=> {
            const res = await request(app.app).post("/user/logout").send();
            expect(res.statusCode).toBe(401);
        })
    })
})

afterAll(async () => {
  await DButils.execQuery(`DELETE FROM users WHERE username = 'KingMessi'`);
  await DButils.pool.close();
  app.app.server.close();
});

