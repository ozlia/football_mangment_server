var express = require("express");
var router = express.Router();
const DButils = require("../routes/utils/DButils");
const bcrypt = require("bcryptjs");
const users_utils = require("../routes/utils/users_utils");
const guest_utils = require("../routes/utils/guest_utils");

router.post("/register", async (req, res, next) => {
  try {
    guest_utils.verifyUsernameUnique(req.body.username);

    //hash the password
    let hash_password = bcrypt.hashSync(
      req.body.password,
      parseInt(process.env.bcrypt_saltRounds)
    );
    req.body.password = hash_password;

    guest_utils.insertUser(req.body.username,req.body.firstname,req.body.lastname,req.body.country,hash_password,req.body.email,req.body.profile_picture);
    
    res.status(201).send("User has been created");
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    let user = await guest_utils.verifyUser(req.body.username, req.body.password);


    // Set cookie
    req.session.user_id = user.user_id;
        
    const roles_list = await users_utils.getUserRoles(user.user_id);
    // return roles
    res.status(200).send(roles_list);
  } catch (error) {
    next(error);
  }
});

router.post("logout", function (req, res) {
  if (!req.session || !req.session.user_id){
    throw { status: 412, message: "no user is logged in" };
  }
  req.session.reset(); 
  res.status(200).send("logout succeeded");
});

module.exports = router;
