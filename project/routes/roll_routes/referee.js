var express = require("express");
var router = express.Router();
const users_utils = require("../utils/users_utils");
const match_utils = require("../utils/match_utils");


router.use(async function(req,res,next){
    try{
      const user_id = req.session.user_id;
      const is_union_rep = await users_utils.isRole(user_id,'referee');
      if(!is_union_rep){
        throw ({ status: 403, message: "User isn't permitted"});
      }
      next();
    }
    catch (error) {
      next(error);
    }
  });


router.put("/add_score", async(req, res, next)=>{
    try{
        await match_utils.updateScore(req.body.match_id, req.body.score);
        res.status(200).send("The score was assigned successfuly")
    }
    catch(error) {
        next(error);
    }
});

router.put("/add_event", async(req, res, next)=>{
    try{
        await match_utils.addEvent(req.body.match_id, req.body.event);
        res.status(200).send("The event was added successfuly")
    }
    catch(error) {
        next(error);
    }
});





module.exports = router;