const DButils = require("../../routes/utils/DButils");
const referee_utils = require("../../routes/utils/referee_utils");
const users_utils = require("../../routes/utils/users_utils");
const guest_utils = require("../../routes/utils/guest_utils");

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
    await guest_utils.insertUser(
      tested_ref.username,
      tested_ref.firstname,
      tested_ref.lastname,
      tested_ref.country,
      tested_ref.password,
      tested_ref.email,
      tested_ref.profile_picture
    );
    const user = await DButils.execQuery(
      `SELECT user_id,username FROM dbo.users WHERE username='${tested_ref.username}'`
    );
    if (!user) {
      throw "this shouldnt happen but it did. something wrong with insertUser";
    }
    user_id = user[0].user_id;
    tested_ref.id = user_id;
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
      `DELETE FROM dbo.roles WHERE user_id='${user_id}'`
    );
    await DButils.execQuery(
      `DELETE FROM league_referees WHERE user_id = '${user_id}'`
    );
    await DButils.execQuery(
      `DELETE FROM league WHERE league_id = '${league_id}'`
    );
    await DButils.execQuery(`DELETE FROM users WHERE user_id = '${user_id}'`);
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
