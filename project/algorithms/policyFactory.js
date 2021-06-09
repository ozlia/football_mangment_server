let Policy = require("./policy");
let ReagularClassPolicy = require("./regularLeaguePolicy");

var policies = {"reagular Season": ReagularClassPolicy.genrateLeagueMatches, "policy": Policy.genrateLeagueMatches};

function getPolicy(policy_name) {
    return policies[policy_name];
}

exports.getPolicy = getPolicy;