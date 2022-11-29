const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const { ObjectId } = require("mongodb");
const bcrypt = require("bcrypt");
const saltRounds = 13;
const validations = require("../data/validation");

async function createUser(username, password, name) {
  username = validations.checkString(username, "Username");
  password = validations.checkString(password, "Password");
  name = validations.checkString(name, "Name");

  const userCollection = await users();
  const user = await userCollection.findOne({
    username: username.toLowerCase(),
  });

  if (user != null) throw { message: "User already exists", code: 400 };

  password = await bcrypt.hash(password, saltRounds);

  let newUserInfo = {
    username: username.toLowerCase(),
    password,
    name,
  };

  const insertInfo = await userCollection.insertOne(newUserInfo);
  if (!insertInfo.acknowledged || !insertInfo.insertedId)
    throw { message: "Could not insert user successfully", code: 500 };

  const newId = insertInfo.insertedId.toString();

  const newUserTemp = await this.get(newId);

  let newUser = {
    _id: newId,
    username: newUserTemp.username,
    name: newUserTemp.name,
  };
  return newUser;
}

async function checkUser(username, password) {
  username = validations.checkString(username, "Username");
  password = validations.checkString(password, "Password");

  const userCollection = await users();
  const user = await userCollection.findOne({
    username: username.toLowerCase(),
  });

  if (user == null)
    throw { message: "Either the username or password is invalid", code: 400 };

  let validated = false;

  validated = await bcrypt.compare(password, user.password);

  if (!validated) {
    throw { message: "Either the username or password is invalid", code: 400 };
  }

  let answer = {
    _id: user._id,
    username: user.username,
    name: user.name,
  };

  return answer;
}

async function get(id) {
  if (!id) throw { message: "You must provide an id to search for", code: 400 };
  id = validations.checkId(id);

  const userCollection = await users();
  const user = await userCollection.findOne({ _id: ObjectId(id) });
  if (user === null) throw { message: "No user with that id", code: 404 };

  user._id = user._id.toString();

  return user;
}

module.exports = {
  createUser,
  checkUser,
  get,
};
