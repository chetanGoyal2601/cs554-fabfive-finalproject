const mongoCollections = require("../config/mongoCollections");
const events = mongoCollections.events;
const { ObjectId } = require("mongodb");
const validations = require("./validation");
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
  image = validations.checkString(image, "Image Name");
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
  };

  const insertInfo = await eventCollection.insertOne(newEvent);

  if (!insertInfo.acknowledged || !insertInfo.insertedId)
    throw { message: "Could not add event successfully", code: 500 };

  const newId = insertInfo.insertedId.toString();

  const event = await this.get(newId);
  return event;
}

async function get(id) {
  if (!id) throw { message: "You must provide an id to search for", code: 400 };
  id = validations.checkId(id);

  const eventCollection = await events();
  const event = await eventCollection.findOne({ _id: ObjectId(id) });
  if (event === null) throw { message: "No event with that id", code: 404 };

  event._id = event._id.toString();

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

  const eventCount = await eventList.length;

  const numOfPages = Math.ceil(eventCount / 20);

  if (eventList.length == 0) throw { message: "No sweets", code: 404 };

  for (let indexOne = 0; indexOne < eventList.length; indexOne++) {
    eventList[indexOne]._id = eventList[indexOne]._id.toString();
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
  };

  const updatedInfo = await eventCollection.updateOne(
    { _id: ObjectId(eventId) },
    { $set: newEvent }
  );

  if (updatedInfo.modifiedCount === 0) {
    throw { message: "Could not update event successfully", code: 500 };
  }
  let answer = { event: await this.get(eventId), updated: true };
  return answer;
}

async function remove(eventId, userId) {
  eventId = validations.checkId(eventId, "Event ID");
  // userId = validations.checkId(userId, "User ID");

  const eventCollection = await events();
  const event = await this.get(eventId);

  if (event.host != userId)
    throw { message: "You are not authorised to delete this event", code: 403 };
  const deletionInfo = await eventCollection.deleteOne({
    _id: ObjectId(eventId),
  });

  if (deletionInfo.deletedCount === 0) {
    throw `Could not delete event with id of ${eventId}`;
  }

  let answer = { eventId, deleted: true };
  return answer;
}

module.exports = {
  createEvent,
  get,
  getAll,
  setRsvp,
  remove,
};
