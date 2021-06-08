const guest_utils = require("../routes/utils/guest_utils");
const newUser = {
  username: "Naor",
  firstname: "Naor",
  lastname: "Suban",
  country: "NaorLand",
  password: "Naor",
  email: "Naor@naor.com",
  profile_picture: "Naor.com/imgpath",
};
const DButils = require("../routes/utils/DButils");

// jest.mock('../routes/utils/match_utils');
// let request = require('supertest');
// let app = require('../main');


afterAll( async () => {
    await DButils.pool.close();
  });

describe("testing Authenticaion - register", () => {
    test("testing verifyUsernameUnique. dbo.users is empty", async () => {
      await expect(() => guest_utils.verifyUsernameUnique("Naor")).not.toThrow();
    });

    test("testing insertUser. dbo.users is empty", async () => {
      try{
        await guest_utils.insertUser(
            newUser.username,
            newUser.firstname,
            newUser.lastname,
            newUser.country,
            newUser.password,
            newUser.email,
            newUser.profile_picture
          );
          const testedUser = await DButils.execQuery(
            `SELECT * FROM users WHERE username = '${newUser.username}'`
          );
          expect(testedUser).toBeDefined();
        }
        catch{
            console.log('An SQL error has been thrown during insertUser testing');
        }
        finally{
            await DButils.execQuery(
                `DELETE FROM users WHERE username = '${newUser.username}'`
              );
        }
      });

});
