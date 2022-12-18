const mongoCollections = require("../config/mongoCollections");
const events = mongoCollections.events;
const users = mongoCollections.users;
const { ObjectId } = require("mongodb");
const validations = require("./validation");

async function get(id) {
  if (!id) throw { message: "You must provide an id to search for", code: 400 };
  id = validations.checkId(id);

  const eventCollection = await users();
  const user = await eventCollection.findOne({ _id: ObjectId(id) });
  if (user === null) throw { message: "No user with that id", code: 404 };

  user._id = user._id.toString();

  return user;
}

async function getUsername(id) {
  if (!id) throw { message: "You must provide an id to search for", code: 400 };
  id = validations.checkId(id);

  const user = this.get(id);

  return user.name;
}

async function setRsvp(eventId, userId) {
  eventId = validations.checkId(eventId, "Event ID");
  // userId = validations.checkId(userId, "User ID");

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
    gender: user.gender,
    rating: user.rating,
    is_host: user.is_host,
    rsvp_d: user.rsvp_d,
    currently_hosted: user.currently_hosted,
    past_hosted: user.past_hosted,
    reviews: user.reviews,
    comments: user.comments,
    reviews_upvoted: user.reviews_upvoted,
    reviews_downvoted: user.reviews_downvoted,
    comments_upvoted: user.comments_upvoted,
    comments_downvoted: user.comments_downvoted,
    all_chats: user.all_chats,
    verified: user.verified,
  };

  const updatedInfo = await userCollection.updateOne(
    { _id: ObjectId(userId) },
    { $set: newUser }
  );

  if (updatedInfo.modifiedCount === 0) {
    throw { message: "Could not update user successfully", code: 500 };
  }
  let answer = { user: await this.get(userId), updated: true };
  return answer;
}

async function setCurrentlyHosted(eventId, userId, action) {
  eventId = validations.checkId(eventId, "Event ID");
  // userId = validations.checkId(userId, "User ID");

  const userCollection = await users();
  const user = await this.get(userId);

  if (action == "Delete" && user.is_host.includes(eventId)) {
    user.is_host.splice(user.is_host.indexOf(eventId), 1);
  } else if (action == "Delete" && !user.is_host.includes(eventId))
    throw { message: "The event does not belong to the host", code: 404 };

  if (action == "Add" && !user.is_host.includes(eventId)) {
    user.is_host.push(eventId);
  } else if (action == "Add" && user.is_host.includes(eventId)) {
    throw { message: "The host already has this event", code: 404 };
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
    currently_hosted: user.currently_hosted,
    past_hosted: user.past_hosted,
    reviews: user.reviews,
    comments: user.comments,
    reviews_upvoted: user.reviews_upvoted,
    reviews_downvoted: user.reviews_downvoted,
    comments_upvoted: user.comments_upvoted,
    comments_downvoted: user.comments_downvoted,
    all_chats: user.all_chats,
    verified: user.verified,
  };

  const updatedInfo = await userCollection.updateOne(
    { _id: ObjectId(userId) },
    { $set: newUser }
  );

  if (updatedInfo.modifiedCount === 0) {
    throw { message: "Could not update user successfully", code: 500 };
  }
  let answer = { user: await this.get(userId), updated: true };
  return answer;
}

async function calcAvgRating(userId) {
  //   userId = validations.checkId(userId, "User ID");
  // const user = await this.get(userId);

  let pastHostedRatingAvg = await calcRating([
    ObjectId("6393c8b6631fb11ad69b246f"),
    ObjectId("6393bfecc11b8fef13463e15"),
    ObjectId("6393bfb7193c03e07eae8a5a"),
  ]);
  //   let averageRating = calcRating(user.past_hosted);

  const newUser = {
    name: user.name,
    email: user.email,
    password: user.password,
    dateOfBirth: user.dateOfBirth,
    gender: user.gender,
    rating: averageRating,
    is_host: user.is_host,
    rsvp_d: user.rsvp_d,
    currently_hosted: user.currently_hosted,
    past_hosted: user.past_hosted,
    reviews: user.reviews,
    comments: user.comments,
    reviews_upvoted: user.reviews_upvoted,
    reviews_downvoted: user.reviews_downvoted,
    comments_upvoted: user.comments_upvoted,
    comments_downvoted: user.comments_downvoted,
    all_chats: user.all_chats,
    verified: user.verified,
  };

  const updatedInfo = await userCollection.updateOne(
    { _id: ObjectId(userId) },
    { $set: newUser }
  );

  if (updatedInfo.modifiedCount === 0) {
    throw { message: "Could not update user successfully", code: 500 };
  }
  let answer = { user: await this.get(userId), updated: true };
  return answer;
}

async function calcRating(inputEvents) {
  let eventCollection = await events();
  let allEvents = await eventCollection
    .find({ _id: { $in: inputEvents } })
    .toArray();

  let overallSum = 0;
  for (let index = 0; index < allEvents.length; index++) {
    let sum = 0;
    const ratings = allEvents[index].ratings;
    for (let rating of ratings) {
      sum += rating.rating;
    }
    overallSum = overallSum + sum / ratings.length;
  }
  overallAvg = overallSum / allEvents.length;
  return overallAvg;
}

module.exports = {
  get,
  getUsername,
  setRsvp,
  setCurrentlyHosted,
  calcAvgRating,
  calcRating,
};
