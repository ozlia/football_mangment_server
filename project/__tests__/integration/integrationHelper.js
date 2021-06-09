const DButils = require('../../routes/utils/DButils');
const guest_utils = require('../../routes/utils/guest_utils');

let tested_ref = {
    username: "ref",
    firstname: "ref",
    lastname: "Suban",
    country: "NaorLand",
    password: "Naor",
    email: "Naor@naor.com",
    profile_picture: "Naor.com/imgpath",
  };
  var league_id = "271";

async function make_test_referee(){
    await guest_utils.insertUser(
        tested_ref.username,
        tested_ref.firstname,
        tested_ref.lastname,
        tested_ref.country,
        tested_ref.password,
        tested_ref.email,
        tested_ref.profile_picture
      );
      const user= await DButils.execQuery(
        `SELECT user_id,username FROM dbo.users WHERE username='${tested_ref.username}'`
      );
      tested_ref.id = user[0].user_id;
      await DButils.execQuery(
        `INSERT INTO roles (user_id, role_name) VALUES
                  ('${tested_ref.id}', 'referee')`
      );

      // await DButils.execQuery(
      //   `INSERT INTO league (league_id, league_name) VALUES
      //             ('${league_id}', 'testLeague')`
      // );
      await DButils.execQuery(
        `INSERT INTO league_referees (user_id, league_id) VALUES
                  ('${tested_ref.id}', '${league_id}')`
      );
      return user;
}

async function clean_test_referee_data(){
      await DButils.execQuery(
        `DELETE FROM league_referees WHERE user_id = '${tested_ref.id}'`
      );
    await DButils.execQuery(
        `DELETE FROM dbo.roles WHERE user_id='${tested_ref.id}'`
      );
      // await DButils.execQuery(
      //   `DELETE FROM league WHERE league_id = '${league_id}'`
      // );
      await DButils.execQuery(`DELETE FROM users WHERE user_id = '${tested_ref.id}'`);

}
exports.make_test_referee=make_test_referee;
exports.clean_test_referee_data=clean_test_referee_data;
