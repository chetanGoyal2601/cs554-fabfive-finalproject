const mongoCollections = require("../config/mongoCollections");
const events = mongoCollections.events;
const { ObjectId } = require("mongodb");
const validation = require("./validation");

async function createEvent(
  title,
  description,
  time,
  capacity,
  address,
  address2,
  image
) {
  const eventCollection = await events();

  let newEvent = {
    title,
    description,
    time,
    capacity,
    address,
    address2,
    image,
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
  id = validation.checkId(id);

  const eventCollection = await events();
  const event = await eventCollection.findOne({ _id: ObjectId(id) });
  if (event === null) throw { message: "No event with that id", code: 404 };

  event._id = event._id.toString();

  return event;
}

module.exports = {
  createEvent,
  get,
};
