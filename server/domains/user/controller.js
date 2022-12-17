const hashData = require("./../../util/hashData");
const verifyHashedData = require("./../../util/verifyHashedData");
const User = require("./model");
const mongoCollections = require("../../config/mongoCollections");
const userCollection = mongoCollections.users;
const events = mongoCollections.events;
const event = require("./events");

const createNewUser = async (data) => {
  let today = new Date();
  let { name, email, password, dateOfBirth, gender } = data;
  try {
    if (!name || !password||!email || !dateOfBirth|| !gender) {
      throw Error('Input should be supplied for all fileds');
  }
  if(new Date(dateOfBirth)>=today){
    throw Error("Date of Birth should be in the past");
  }
  
  if (typeof (name) != 'string') {
      throw Error('name should be a string');
  }

  if (typeof (password) != 'string') {
      throw Error('password should be a string');
  }

  if (name.length === 0) {
      throw Error('name cannot be a empty string');
  }
  if (password.length === 0) {
      throw Error('password cannot be a empty string');
  }

  if (name.trim().length === 0) {
      throw Error('name cannot be just empty spaces');
  }

  if (password.trim().length === 0) {
      throw Error('password cannot be just empty spaces');
  }

  if (name.length < 4) {
      throw Error('name should contain at least 4 characters');
  }

  if (!/^[a-zA-Z ]*$/.test(name)) {
    throw Error("Invalid name entered");
  }

  if (password.length < 6) {
      throw Error('password should contain at least 6 characters');
  }

  if (/\s/.test(password)) {
      throw Error('password has white spaces');
  }

  if (!new Date(dateOfBirth).getTime()) {
    throw Error("Invalid date of birth entered");
  }
  const singupVlidation = (email)=>{
    // Define list of valid domains as an array
    let domain_list = ['stevens.edu'];
    let domain = email.substring(email.lastIndexOf("@") +1);
    // Check if the domain is present in the array of valid domains
    if (domain_list.includes(domain)) {
        return true;
    } else {
        return false;
    }
}
if(singupVlidation(email)===false){
  throw Error('Email should contain @stevens.edu');
}


  email=email.toLowerCase();
    const existingUser = await User.find({ email });

    if (existingUser.length) {
      throw Error("User with the provided email already exists");
    } else {

      const hashedPassword = await hashData(password);
      const newUser = new User({
        name:name.toLowerCase(),
        email:email.toLowerCase(),
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
  email = email.toLowerCase()
  try {
    if (!email || !password) {
      throw Error('Input should be supplied for all fileds');
  }

  if (typeof (email) != 'string') {
      throw Error('email should be a string');
  }

  if (typeof (password) != 'string') {
      throw Error('password should be a string');
  }

  if (email.length === 0) {
      throw Error('email cannot be a empty string');
  }
  if (password.length === 0) {
      throw Error('password cannot be a empty string');
  }

  if (email.trim().length === 0) {
      throw Error('email cannot be just empty spaces');
  }

  if (password.trim().length === 0) {
      throw Error('password cannot be just empty spaces');
  }

  if (password.length < 8) {
      throw Error('password should contain at least 6 characters');
  }

  if (/\s/.test(password)) {
      throw Error('password has white spaces');
  }
if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      throw Error("Invalid email entered");
}
  const singupVlidation = (email)=>{
    // Define list of valid domains as an array
    let domain_list = ['stevens.edu'];
    let domain = email.substring(email.lastIndexOf("@") +1);
    // Check if the domain is present in the array of valid domains
    if (domain_list.includes(domain)) {
        return true;
    } else {
        return false;
    }
}
if(singupVlidation(email)===false){
  throw Error('Email should contain @stevens.edu');
}

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
  let rsvp=[];
  let host=[];
  try {
    const fetchedUsers = await User.find({ email });
    if (!fetchedUsers.length) {
      throw Error("Invalid credentials entered!");
    }
    const eventCollection = await event();
    for (i=0;i< fetchedUsers.rsvp_d.length;i++){
      const get_event = await event.get(fetchedUsers.rsvp_d[i]);
      rsvp.push(get_event)
    }
    for (i=0;i< fetchedUsers.is_host.length;i++){
      const get_host = await event.get(fetchedUsers.is_host[i]);
      host.push(get_host)
    }

    return {data:fetchedUsers,rsvp_data:rsvp,host_data:host};
  } catch (error) {
    throw error;
  }
};
module.exports = { createNewUser, authenticateUser, getAllUsers, getUserByEmail };
