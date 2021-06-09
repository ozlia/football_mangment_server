const DButils = require("./DButils");
const users_utils = require("./users_utils");


async function getRefLeague(ref_name) {
  let ref_id = await users_utils.getUserIdByUsername(ref_name);
  if (ref_id == "not found"){
      throw({status: 404, message: "referee not found"});    
  }
  const league_id = await DButils.execQuery(
    `SELECT league_id from league_referees where user_id='${ref_id}'`
  );
  return league_id;
  }
  exports.getRefLeague = getRefLeague;
  