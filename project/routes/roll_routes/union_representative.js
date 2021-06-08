var express = require("express");
var router = express.Router();
const users_utils = require("../utils/users_utils");
const match_utils = require("../utils/match_utils");
const league_utils = require("../utils/league_utils");
const union_representative_utils = require("./../utils/union_rep_utils");

// middleware - verify that the user is union representative
router.use(async function(req,res,next){
    try{
      const user_id = req.session.user_id;
      const is_union_rep = await users_utils.isRole(user_id,'union_rep');
      if(!is_union_rep){
        throw ({ status: 403, message: "User isn't permitted"});
      }
      next();
    }
    catch (error) {
      next(error);
    }
  });
  
router.put("/assign_referee", async (req, res, next) => {
    try{
        const ref_user_id = await users_utils.getUserIdByUsername(req.body.username);
        if(ref_user_id == "not found"){
            throw ({ status: 404, message: "Username was not found"});
        }
        //check if the user to assign referree is already referee
        const is_referee = await users_utils.isRole(ref_user_id,'referee');
        if(is_referee){
            throw ({ status: 412, message: "user is already referee"});
        }
        else{
            await users_utils.assignRole(ref_user_id,"referee")
            res.status(200).send("The role was assigned successfuly");
        }
    }
    catch (error) {
        next(error);
    }
});

router.put("/assign_referee_league", async (req, res, next)=>{
    try{
        const ref_user_id = await users_utils.getUserIdByUsername(req.body.username);
        if(ref_user_id == "not found"){
            throw ({ status: 404, message: "The referee's username was not found"});
        }
        //check if the user to assign referree is already referee
        const is_referee = await users_utils.isRole(ref_user_id,'referee');
        if(!is_referee){
            throw ({ status: 412, message: "To assign referee to a league, The user should be already a referee"});
        }
        else{
            await league_utils.assignRefereeToLeague(ref_user_id, await league_utils.getLeagueId());
            res.status(200).send("The referee was assigned to the league successfuly");
        }
    } 
    catch (error) {
        next(error);
    }
});


router.post("/match", async (req, res, next) => {
    try{
        let match = await union_representative_utils.checkMatchCreationConstraints(
            req.body.home_team_name, req.body.away_team_name, req.body.referee_name, req.body.date);
        // add match (home team, away team, ref, court, date, stage)
        await union_representative_utils.addMatch(match);
        res.status(201).send("match has been created");
    }
    catch (error) {
        next(error);
    }
});


router.get("/matches/:league_id", async (req, res, next) => {
    try{
      const matches = await league_utils.getLeagueMatches(req.params.league_id);
      if(matches.length==0){
        throw({ status: 400, message: "didnt find available data on league" });
      }
      let results = await match_utils.extractRelevantData(matches);
      res.status(200).send(results);
    
    }
    catch(error){
      next(error)
    }
  });

  router.post("/createLeague", async (req, res, next) => {
    try{
      await league_utils.createLeague(req.body.league_id, req.body.league_name);
      res.status(200).send("The league was created succesfuly");
    }
    catch(error){
      next(error)
    }
  });
module.exports = router;
