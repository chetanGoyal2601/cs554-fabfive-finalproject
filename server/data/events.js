const mongoCollections = require("../config/mongoCollections");
const events = mongoCollections.events;
const { ObjectId } = require("mongodb");
const validations = require("./validation");
const user = require("./users");
const {createChat} = require('./chat');

const Months = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  May: 4,
  June: 5,
  Jul: 6,
  Aug: 7,
  Sep: 8,
  Oct: 9,
  Nov: 10,
  Dec: 11,
};

async function createEvent(
  title,
  description,
  time,
  capacity,
  address,
  address2,
  userId,
  image
) {
  title = validations.checkString(title, "Title");
  description = validations.checkString(description, "Description");
  address = validations.checkString(address, "Address");
  address2 = validations.checkAddress2(address2, "Address 2");
  time = validations.checkString(time, "Date & Time");
  // image = validations.checkString(image, "Image Name");
  capacity = validations.checkNumber(capacity, "Capacity");
  // userId = validations.checkId(userId, "User ID");
  const eventCollection = await events();

  let splitTime = time.slice(0, -7).split(" ");
  let inputDate = splitTime[4].split(":");

  let eventDate = new Date(
    parseInt(splitTime[3]),
    Months[splitTime[2]],
    parseInt(splitTime[1]),
    parseInt(inputDate[0]),
    parseInt(inputDate[1]),
    0
  );

  eventDate.setHours(eventDate.getHours() - 5);
  time = eventDate.toString().slice(0, 21);

  if (eventDate < new Date())
    throw {
      message: "Error : Date cannot be older than today's date",
      code: 500,
    };

  let newEvent = {
    title,
    description,
    time,
    eventDate,
    capacity,
    seatsAvailable: capacity,
    address,
    address2,
    image,
    rsvps: [],
    host: userId,
    ratings: [],
  };

  const insertInfo = await eventCollection.insertOne(newEvent);

  if (!insertInfo.acknowledged || !insertInfo.insertedId)
    throw { message: "Error : Could not add event successfully", code: 500 };

  const newId = insertInfo.insertedId.toString();

  const event = await this.get(newId);
  return event;
}

async function get(id) {
  if (!id)
    throw {
      message: "Error : You must provide an id to search for",
      code: 400,
    };
  id = validations.checkId(id);

  const eventCollection = await events();
  const event = await eventCollection.findOne({ _id: ObjectId(id) });
  if (event === null)
    throw { message: "Error : No event with that id", code: 404 };

  event._id = event._id.toString();
  // event.hostName = await user.getUsername(event.host);

  return event;
}

async function getAll(page) {
  page = validations.checkNumber(page, "Page Number");

  let start = page == 0 ? 0 : page * 20;
  //let end = start + 50 < sweetList.length ? start + 50 : sweetList.length;

  let currentDate = new Date();

  const eventCollection = await events();

  const eventList = await eventCollection
    .find({
      eventDate: { $gte: currentDate },
    })
    .sort({ eventDate: 1 })
    .skip(start)
    .limit(20)
    .toArray();

  const eventCount = await eventCollection
    .find({
      eventDate: { $gte: currentDate },
    })
    .toArray();

  const numOfPages = Math.ceil(eventCount.length / 20);

  if (eventList.length == 0) throw { message: "Error : No events", code: 404 };

  for (let indexOne = 0; indexOne < eventList.length; indexOne++) {
    eventList[indexOne]._id = eventList[indexOne]._id.toString();
    //eventList[indexOne].hostName = user.getUsername(eventList[indexOne].host);
  }

  let previous = page <= 0 || page > numOfPages ? null : page - 1;
  let next = page < numOfPages - 1 ? page + 1 : null;
  let data = { results: eventList, numOfPages, previous, next };
  return data;
}

async function setRsvp(eventId, userId) {
  eventId = validations.checkId(eventId, "Event ID");
  // userId = validations.checkId(userId, "User ID");

  const eventCollection = await events();
  const event = await this.get(eventId);
  let seatsAvailable = event.seatsAvailable;

  if (event.eventDate < new Date())
    throw { message: "Error : You're late, Event RSVP expired!", code: 404 };

  if (event.rsvps.includes(userId)) {
    event.rsvps.splice(event.rsvps.indexOf(userId), 1);
    seatsAvailable++;
  } else {
    event.rsvps.push(userId);
    seatsAvailable--;
  }

  let newEvent = {
    title: event.title,
    description: event.description,
    time: event.time,
    capacity: event.capacity,
    seatsAvailable,
    address: event.address,
    address2: event.address2,
    image: event.image,
    rsvps: event.rsvps,
    host: event.host,
    ratings: event.ratings,
    eventDate: event.eventDate,
  };

  const updatedInfo = await eventCollection.updateOne(
    { _id: ObjectId(eventId) },
    { $set: newEvent }
  );

  if (updatedInfo.modifiedCount === 0) {
    throw { message: "Error : Could not update event successfully", code: 500 };
  }
  let chatId = createChat(eventId, newEvent.host, userId);
  let answer = { event: await this.get(eventId), updated: true };
  return answer;
}

async function remove(eventId, userId) {
  eventId = validations.checkId(eventId, "Event ID");
  // userId = validations.checkId(userId, "User ID");

  const eventCollection = await events();
  const event = await this.get(eventId);

  if (event.host != userId)
    throw {
      message: "Error : You are not authorised to delete this event",
      code: 403,
    };
  const deletionInfo = await eventCollection.deleteOne({
    _id: ObjectId(eventId),
  });

  if (deletionInfo.deletedCount === 0) {
    throw `Error : Could not delete event with id of ${eventId}`;
  }

  let answer = { eventId, deleted: true };
  return answer;
}

async function setRating(eventId, rating, userId) {
  let flag = false;
  eventId = validations.checkId(eventId, "Event ID");
  // userId = validations.checkId(userId, "User ID");
  rating = validations.checkFloat(rating, "Rating");

  if (rating < 0 || rating > 5)
    throw {
      message: "Error : Rating can be only between 0 to 5",
      code: 403,
    };

  const eventCollection = await events();
  const event = await this.get(eventId);

  // if (!event.rsvps.includes(userId))
  //   throw {
  //     message: "You are not authorised to rate the Host for this event",
  //     code: 403,
  //   };

  for (let index = 0; index < event.ratings.length; index++) {
    let element = event.ratings[index];
    if (element.userId == userId) {
      event.ratings[index].rating = rating;
      flag = true;
      break;
    }
  }
  if (!flag) {
    let newRating = { userId, rating };
    event.ratings.push(newRating);
  }

  let newEvent = {
    title: event.title,
    description: event.description,
    time: event.time,
    capacity: event.capacity,
    seatsAvailable: event.seatsAvailable,
    address: event.address,
    address2: event.address2,
    image: event.image,
    rsvps: event.rsvps,
    host: event.host,
    ratings: event.ratings,
    eventDate: event.eventDate,
  };

  const updatedInfo = await eventCollection.updateOne(
    { _id: ObjectId(eventId) },
    { $set: newEvent }
  );

  if (updatedInfo.modifiedCount === 0) {
    throw {
      message:
        "Error : Could not update event successfully. New value might be same as old value",
      code: 500,
    };
  }
  let answer = { event: await this.get(eventId), updated: true };
  return answer;
}

module.exports = {
  createEvent,
  get,
  getAll,
  setRsvp,
  remove,
  setRating,
};
