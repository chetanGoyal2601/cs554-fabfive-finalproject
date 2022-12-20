const mongoCollections = require("../config/mongoCollections");
const events = mongoCollections.events;
const users = mongoCollections.users;
const { ObjectId } = require("mongodb");
const validations = require("./validation");

async function get(id) {
  if (!id)
    throw {
      message: "Error : You must provide an id to search for",
      code: 400,
    };
  id = validations.checkId(id);

  const eventCollection = await users();
  const user = await eventCollection.findOne({ _id: ObjectId(id) });
  if (user === null)
    throw { message: "Error : No user with that id", code: 404 };

  user._id = user._id.toString();

  return user;
}

async function getUsername(id) {
  if (!id)
    throw {
      message: "Error : You must provide an id to search for",
      code: 400,
    };
  id = validations.checkId(id);

  const user = this.get(id);

  return user.name;
}

async function setRsvp(eventId, userId) {
  eventId = validations.checkId(eventId, "Event ID");
  userId = validations.checkId(userId, "User ID");

  const userCollection = await users();
  const user = await this.get(userId);

  if (user.rsvp_d.includes(eventId)) {
    user.rsvp_d.splice(user.rsvp_d.indexOf(eventId), 1);
  } else {
    user.rsvp_d.push(eventId);
  }

  const newUser = {
    name: user.name,
    email: user.email,
    password: user.password,
    dateOfBirth: user.dateOfBirth,
    events: user.events,
    gender: user.gender,
    rating: user.rating,
    is_host: user.is_host,
    rsvp_d: user.rsvp_d,
    reviews: user.reviews,
    comments: user.comments,
    reviews_upvoted: user.reviews_upvoted,
    reviews_downvoted: user.reviews_downvoted,
    comments_upvoted: user.comments_upvoted,
    comments_downvoted: user.comments_downvoted,
    verified: user.verified,
  };

  const updatedInfo = await userCollection.updateOne(
    { _id: ObjectId(userId) },
    { $set: newUser }
  );

  if (updatedInfo.modifiedCount === 0) {
    throw { message: "Error : Could not update user successfully", code: 500 };
  }
  let answer = { user: await this.get(userId), updated: true };
  return answer;
}

async function setCurrentlyHosted(eventId, userId, action) {
  eventId = validations.checkId(eventId, "Event ID");
  userId = validations.checkId(userId, "User ID");

  const userCollection = await users();
  const user = await this.get(userId);

  if (action == "Delete" && user.events.includes(eventId)) {
    user.events.splice(user.events.indexOf(eventId), 1);
  } else if (action == "Delete" && !user.events.includes(eventId))
    throw {
      message: "Error : The event does not belong to the host",
      code: 404,
    };

  if (action == "Add" && !user.events.includes(eventId)) {
    user.events.push(eventId);
  } else if (action == "Add" && user.events.includes(eventId)) {
    throw { message: "Error : The host already has this event", code: 404 };
  }

  const newUser = {
    name: user.name,
    email: user.email,
    password: user.password,
    dateOfBirth: user.dateOfBirth,
    gender: user.gender,
    rating: user.rating,
    is_host: user.is_host,
    rsvp_d: user.rsvp_d,
    reviews: user.reviews,
    comments: user.comments,
    events: user.events,
    reviews_upvoted: user.reviews_upvoted,
    reviews_downvoted: user.reviews_downvoted,
    comments_upvoted: user.comments_upvoted,
    comments_downvoted: user.comments_downvoted,
    verified: user.verified,
  };

  const updatedInfo = await userCollection.updateOne(
    { _id: ObjectId(userId) },
    { $set: newUser }
  );

  if (updatedInfo.modifiedCount === 0) {
    throw { message: "Error : Could not update user successfully", code: 500 };
  }
  let answer = { user: await this.get(userId), updated: true };
  return answer;
}

async function calcAvgRating(userId) {
  userId = validations.checkId(userId, "User ID");
  const user = await this.get(userId);

  // let pastHostedRatingAvg = await calcRating([
  //   ObjectId("6393c8b6631fb11ad69b246f"),
  //   ObjectId("6393bfecc11b8fef13463e15"),
  //   ObjectId("6393bfb7193c03e07eae8a5a"),
  // ]);
  let averageRating = await calcRating(user.events);
  if (isNaN(averageRating)) averageRating = 0;

  const newUser = {
    name: user.name,
    email: user.email,
    password: user.password,
    dateOfBirth: user.dateOfBirth,
    gender: user.gender,
    rating: averageRating,
    is_host: user.is_host,
    rsvp_d: user.rsvp_d,
    events: user.events,
    reviews: user.reviews,
    comments: user.comments,
    reviews_upvoted: user.reviews_upvoted,
    reviews_downvoted: user.reviews_downvoted,
    comments_upvoted: user.comments_upvoted,
    comments_downvoted: user.comments_downvoted,
    verified: user.verified,
  };

  const userCollection = await users();

  const updatedInfo = await userCollection.updateOne(
    { _id: ObjectId(userId) },
    { $set: newUser }
  );

  if (updatedInfo.modifiedCount === 0) {
    if (averageRating != user.rating)
      throw {
        message: "Error : Could not update user successfully",
        code: 500,
      };
  }
  let answer = { user: await this.get(userId), updated: true };
  return answer;
}

async function calcRating(inputEvents) {
  let eventCollection = await events();

  for (let index = 0; index < inputEvents.length; index++) {
    inputEvents[index] = ObjectId(inputEvents[index]);
  }

  let allEvents = await eventCollection
    .find({ _id: { $in: inputEvents } })
    .toArray();

  let overallSum = 0;
  let totalRating = 0;
  for (let index = 0; index < allEvents.length; index++) {
    let sum = 0;
    const ratings = allEvents[index].ratings;
    for (let rating of ratings) {
      totalRating++;
      sum += rating.rating;
    }
    if (isNaN(overallSum)) overallSum = 0;
    overallSum = overallSum + sum;
  }
  overallAvg = overallSum / totalRating;
  return overallAvg;
}

async function removeUsers(eventId, hostId, rsvpdUsers) {
  hostId = validations.checkId(hostId, "Host ID");
  eventId = validations.checkId(eventId, "Event ID");
  const user = await this.get(hostId);

  if (user.events.includes(eventId)) {
    user.events.splice(user.events.indexOf(eventId), 1);
  }

  const newUserHost = {
    name: user.name,
    email: user.email,
    password: user.password,
    dateOfBirth: user.dateOfBirth,
    gender: user.gender,
    rating: user.rating,
    is_host: user.is_host,
    rsvp_d: user.rsvp_d,
    reviews: user.reviews,
    comments: user.comments,
    events: user.events,
    reviews_upvoted: user.reviews_upvoted,
    reviews_downvoted: user.reviews_downvoted,
    comments_upvoted: user.comments_upvoted,
    comments_downvoted: user.comments_downvoted,
    verified: user.verified,
  };

  const userCollection = await users();

  const updatedInfoHost = await userCollection.updateOne(
    { _id: ObjectId(user._id) },
    { $set: newUserHost }
  );
  // let userInfo = await setCurrentlyHosted(eventId, hostId, "Delete");

  for (let index = 0; index < rsvpdUsers.length; index++) {
    rsvpdUsers[index] = validations.checkId(rsvpdUsers[index], "User ID");
    rsvpdUsers[index] = ObjectId(rsvpdUsers[index]);
  }

  let allUsers = await userCollection
    .find({ _id: { $in: rsvpdUsers } })
    .toArray();

  for (let index = 0; index < allUsers.length; index++) {
    let singleUser = allUsers[index];
    let flag = false;
    if (singleUser.rsvp_d.includes(eventId)) {
      singleUser.rsvp_d.splice(singleUser.rsvp_d.indexOf(eventId), 1);
      flag = true;
    }
    if (flag) {
      const newUser = {
        name: singleUser.name,
        email: singleUser.email,
        password: singleUser.password,
        dateOfBirth: singleUser.dateOfBirth,
        gender: singleUser.gender,
        rating: singleUser.rating,
        is_host: singleUser.is_host,
        rsvp_d: singleUser.rsvp_d,
        reviews: singleUser.reviews,
        comments: singleUser.comments,
        events: singleUser.events,
        reviews_upvoted: singleUser.reviews_upvoted,
        reviews_downvoted: singleUser.reviews_downvoted,
        comments_upvoted: singleUser.comments_upvoted,
        comments_downvoted: singleUser.comments_downvoted,
        verified: singleUser.verified,
      };

      const updatedInfo = await userCollection.updateOne(
        { _id: ObjectId(singleUser._id) },
        { $set: newUser }
      );
    }
  }
  let answer = { updated: true };
  return answer;
}

module.exports = {
  get,
  getUsername,
  setRsvp,
  setCurrentlyHosted,
  calcAvgRating,
  calcRating,
  removeUsers,
};
