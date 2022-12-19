const mongoConnection = require("../config/mongoConnection");
const mongoCollections = require("../config/mongoCollections");
const commentsMongo = mongoCollections.comments;
const postsMongo = mongoCollections.posts;
const profilesMongo = mongoCollections.profiles;
const fs = require("fs");
const bcrypt = require("bcrypt");

async function main() {
  const db = await mongoConnection.connectToDb();
  await db.dropDatabase();
  let rawData;

  rawData = fs.readFileSync("./json/postsCollection.json");
  const { posts } = JSON.parse(rawData);

  rawData = fs.readFileSync("./json/commentsCollection.json");
  const { comments } = JSON.parse(rawData);

  rawData = fs.readFileSync("./json/profilesCollection.json");
  const { profiles } = JSON.parse(rawData);
  const profilesCollection = await profilesMongo();
  const profilesInsertInfo = await profilesCollection.insertMany(profiles);

  comments[0].userId = profilesInsertInfo.insertedIds["0"];
  comments[1].userId = profilesInsertInfo.insertedIds["1"];
  comments[2].userId = profilesInsertInfo.insertedIds["2"];
  comments[3].userId = profilesInsertInfo.insertedIds["3"];
  comments[4].userId = profilesInsertInfo.insertedIds["4"];
  comments[5].userId = profilesInsertInfo.insertedIds["0"];
  comments[6].userId = profilesInsertInfo.insertedIds["1"];
  comments[7].userId = profilesInsertInfo.insertedIds["2"];
  comments[8].userId = profilesInsertInfo.insertedIds["0"];
  comments[9].userId = profilesInsertInfo.insertedIds["1"];
  comments[10].userId = profilesInsertInfo.insertedIds["1"];
  comments[11].userId = profilesInsertInfo.insertedIds["2"];

  const commentsCollection = await commentsMongo();
  const commentsInsertInfo = await commentsCollection.insertMany(comments); //comment collecn completed

  posts[0].userId = profilesInsertInfo.insertedIds["0"];
  posts[1].userId = profilesInsertInfo.insertedIds["1"];
  posts[2].userId = profilesInsertInfo.insertedIds["2"];
  posts[3].userId = profilesInsertInfo.insertedIds["3"];
  posts[4].userId = profilesInsertInfo.insertedIds["4"];

  posts[0].comments.push(commentsInsertInfo.insertedIds["0"]);
  posts[1].comments.push(commentsInsertInfo.insertedIds["2"]);
  posts[3].comments.push(commentsInsertInfo.insertedIds["1"]);
  posts[4].comments.push(commentsInsertInfo.insertedIds["3"]);
  posts[2].comments.push(commentsInsertInfo.insertedIds["9"]);
  posts[4].comments.push(commentsInsertInfo.insertedIds["10"]);
  posts[1].comments.push(commentsInsertInfo.insertedIds["11"]);
  posts[3].comments.push(commentsInsertInfo.insertedIds["8"]);

  posts[0].likes.push(profilesInsertInfo.insertedIds["2"]);
  posts[1].likes.push(profilesInsertInfo.insertedIds["1"]);
  posts[1].likes.push(profilesInsertInfo.insertedIds["2"]);
  posts[2].likes.push(profilesInsertInfo.insertedIds["3"]);
  posts[3].likes.push(profilesInsertInfo.insertedIds["0"]);
  posts[3].likes.push(profilesInsertInfo.insertedIds["1"]);
  posts[3].likes.push(profilesInsertInfo.insertedIds["2"]);
  posts[4].likes.push(profilesInsertInfo.insertedIds["3"]);
  posts[4].likes.push(profilesInsertInfo.insertedIds["2"]);

  const postsCollection = await postsMongo();
  const postsInsertInfo = await postsCollection.insertMany(posts); //post colln completed

  console.log("Db seeded successfully");
  mongoConnection.closeConnection();
}

main();
