const DButils = require("../../routes/utils/DButils");
const referee_utils = require("../../routes/utils/referee_utils");
const users_utils = require("../../routes/utils/users_utils");
const guest_utils = require("../../routes/utils/guest_utils");
const integrationHelper = require("../../routes/integration/integrationHelper");

let tested_ref = {
  username: "tested_ref_username",
  firstname: "tested_ref_firstname",
  lastname: "tested_ref_lastname",
  country: "tested_ref_country",
  password: "tested_ref_password",
  email: "tested_ref_email",
  profile_picture: "tested_ref_imgpath",
};

var user_id;
var user_name;
var league_id = "999";

describe("Referee testing", () => {
  beforeAll(async () => {
    jest.setTimeout(30000);
    const user = await integrationHelper.make_test_referee();
    if (!user) {
      throw "this shouldnt happen but it did. something wrong with make_test_referee";
    }
    user_id = user[0].user_id;
    tested_ref.id = user_id;
    user_name = user[0].username;
  });

  afterAll(async () => {
    await integrationHelper.clean_test_referee_data();
    await DButils.pool.close();
  });


  test("getRefLeague with stub for getUserIdByName", async () => {
    jest.setTimeout(10000);
      jest
        .spyOn(users_utils, "getUserIdByUsername")
        .mockReturnValue(Promise.resolve(tested_ref.id));
      const refLeague = await referee_utils.getRefLeague(user_name);
      expect(refLeague[0].league_id).toBe(league_id);
  });

  test("getRefLeague no stub", async () => {
    jest.setTimeout(10000);
    const res = await referee_utils.getRefLeague(user_name);
    expect(res[0].league_id).toBe(league_id);
  });
});
