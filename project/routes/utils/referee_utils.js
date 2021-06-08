const DButils = require("./DButils");


async function getRefLeague(id) {
    const league_id = await DButils.execQuery(
      `select league_id from league_referees where user_id='${id}'`
    );
    return league_id;
  }
  exports.getRefLeague = getRefLeague;
  