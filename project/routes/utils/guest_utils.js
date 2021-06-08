const DButils = require('./DButils');
const bcrypt = require("bcryptjs");

async function verifyUser(username, password){
    const user = (
        await DButils.execQuery(
          `SELECT * FROM users WHERE username = '${username}'`))[0];
  
      // check if username exists & the password is correct
      if (!user || !bcrypt.compareSync(password, user.password)) {
        throw { status: 401, message: "Username or Password incorrect" };
      }
      return user;
}

async function verifyUsernameUnique(username){
    const users = await DButils.execQuery(
        "SELECT * FROM users"
      );
  
      if (users.find((x) => x.username === username))
        throw { status: 409, message: "Username is already taken" };
}

async function insertUser(username,firstname,lastname,country,password,email,profile_picture){
    try{
        await DButils.execQuery(
            `INSERT INTO dbo.users (username, firstname, lastname, country, password, email, profile_picture) VALUES
             ('${username}', '${firstname}', '${lastname}', '${country}',
              '${password}', '${email}', '${profile_picture}')`
          );
    } catch{
        throw {
            status: 500,
            message: 'Something went wrong when trying to insert new user'
        }
    }
}

exports.insertUser = insertUser;
exports.verifyUser = verifyUser;
exports.verifyUsernameUnique = verifyUsernameUnique;