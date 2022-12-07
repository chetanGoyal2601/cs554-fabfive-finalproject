const hashData = require("./../../util/hashData");
const verifyHashedData = require("./../../util/verifyHashedData");
const User = require("./model");
const mongoCollections = require("../../config/mongoCollections");
const userCollection = mongoCollections.users;

const createNewUser = async (data) => {
  try {
    const { name, email, password, dateOfBirth, gender } = data;


    const existingUser = await User.find({ email });

    if (existingUser.length) {
      throw Error("User with the provided email already exists");
    } else {

      const hashedPassword = await hashData(password);
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        dateOfBirth,
        gender,
        rating: 0,
        is_host: false,
        rsvp_d: [],
        currently_hosted: [],
        past_hosted: [],
        reviews: [],
        comments: [],
        reviews_upvoted: [],
        reviews_downvoted: [],
        comments_upvoted: [],
        comments_downvoted: [],
        all_chats: [],
        verified: false,
      });

      const createdUser = await newUser.save();
      return createdUser;
    }
  } catch (error) {
    throw error;
  }
};

const authenticateUser = async (email, password) => {
  try {
    const fetchedUsers = await User.find({ email });
    if (!fetchedUsers.length) {
      throw Error("Invalid credentials entered!");
    } else {
      if (!fetchedUsers[0].verified) {
        throw Error("Email hasn't been verified yet. Check your inbox.");
      } else {
        const hashedPassword = fetchedUsers[0].password;
        const passwordMatch = await verifyHashedData(password, hashedPassword);

        if (!passwordMatch) {
          throw Error("Invalid credentials entered!");
        } else {
          return fetchedUsers;
        }
      }
    }
  } catch (error) {
    throw error;
  }
};

async function getAllUsers() {
  let allUsers = await User.find({});
  return allUsers;
}

const getUserByEmail = async (email) => {
  try {
    const fetchedUsers = await User.find({ email });
    if (!fetchedUsers.length) {
      throw Error("Invalid credentials entered!");
    }
    return fetchedUsers;
  } catch (error) {
    throw error;
  }
};
module.exports = { createNewUser, authenticateUser, getAllUsers, getUserByEmail };
