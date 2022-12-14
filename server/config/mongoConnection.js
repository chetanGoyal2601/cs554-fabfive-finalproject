const {
  MongoClient,
  ObjectId,
  MongoError
} = require('mongodb');
const mongoConfig = require('./settings').mongoConfig;

let _connection = undefined;
let _db = undefined;

module.exports = {
  ObjectId,
  MongoError,
  connectToDb: async () => {
    if (!_connection) {
      console.log("connecting to mongodb..");
      _connection = await MongoClient.connect(mongoConfig.serverUrl);
      _db = await _connection.db(mongoConfig.database);
    }
    console.log("connected to mongodb !!");
    return _db;
  },
  closeConnection: () => {
    console.log('\nbye');
    _connection.close();
  }
};