const guest_utils = require("../../routes/utils/guest_utils");
jest.setTimeout(10000);
const tested_user = {
  username: "Naor",
  firstname: "Naor",
  lastname: "Suban",
  country: "NaorLand",
  password: "Naor",
  email: "Naor@naor.com",
  profile_picture: "Naor.com/imgpath",
};
const union_rep_role = "union_rep";
const SQLError = "An SQL error has been thrown during insertUser testing";


const DButils = require("../../routes/utils/DButils");
const users_utils = require("../../routes/utils/users_utils");

describe("testing Authenticaion", () => {
  
  beforeEach(async () => {
    jest.setTimeout(10000);
  });
  afterAll(async () => {
    await DButils.pool.close();
  });
  
  describe("testing Authenticaion - register", () => {
    test("testing verifyUsernameUnique. dbo.users is empty", async () => {
      await expect(() => guest_utils.verifyUsernameUnique("Naor")).not.toThrow();
    });
  
    test("testing insertUser. dbo.users is empty", async () => {
      try {
        await guest_utils.insertUser(
          tested_user.username,
          tested_user.firstname,
          tested_user.lastname,
          tested_user.country,
          tested_user.password,
          tested_user.email,
          tested_user.profile_picture
        );
        const testedUser = await DButils.execQuery(
          `SELECT * FROM users WHERE username = '${tested_user.username}'`
        );
        expect(testedUser).toBeDefined();
      }
        finally {
        await DButils.execQuery(
          `DELETE FROM users WHERE username = '${tested_user.username}'`
        );
      }
    });
  });
  
  describe("testing Authenticaion - login", () => {
    // integration
    // test("testing verifyUser", async () => {
    //   const user = await guest_utils.verifyUser(tested_user.username, tested_user.password);
    //   expect(user).toBeDefined();
    // });
    test("testing getUserRoles", async () => {
      // let mockCallbackFunction = jest.fn()
      jest.spyOn(DButils, 'execQuery').mockImplementation(() =>  Promise.resolve( [{ role_name: union_rep_role }]));
      const role_name_as_list = await users_utils.getUserRoles(
        tested_user.username,
        tested_user.password
        );
        expect(role_name_as_list[0]).toEqual(union_rep_role);
    });
  });
  
});




