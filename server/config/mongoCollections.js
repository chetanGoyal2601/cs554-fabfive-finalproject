const { ObjectId, MongoError, connectToDb } = require("./mongoConnection");

const getCollectionFn = (collection) => {
  let _col = undefined;
  return async () => {
    if (!_col) {
      const db = await connectToDb();
      _col = await db.collection(collection);
    }
    return _col;
  };
};

module.exports = {
  ObjectId,
  MongoError,
  events: getCollectionFn("events"),
  users: getCollectionFn("users"),
  getChats: getCollectionFn("chats"),
  posts: getCollectionFn("posts"),
  comments: getCollectionFn("comments"),
};
