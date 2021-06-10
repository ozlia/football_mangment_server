const request = require('supertest');
const app = require("../../main.js");
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
describe("GET /alive", ()=> {

    describe("checking server is alive", () => {
        test("alve checker", async()=> {
        const res = await request(app.app).get("/alive").send();
        expect(res.text).toBe("I'm alive");
        })
    })
})

afterAll(async () => {
    await DButils.execQuery(`DELETE FROM users WHERE username = 'KingMessi'`);
    await DButils.pool.close();
    app.app.server.close();
  });
  
