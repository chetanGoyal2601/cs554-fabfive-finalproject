const express = require("express");
const router = express.Router();
const data = require("../data");
const postData = data.posts;
const { ObjectId } = require("mongodb");
const xss = require("xss");
const { posts } = require("../data");

// to fetch all posts
router.route("/discussions/:id").get(async (req, res) => {
  let userId = null;
  let currentUserName = "x";
  let isUserLoggedIn = false;
  const output = [];

  try {
    if (checkUserLoggedIn(req)) {
      //console.log("Hello");
      userId = "639ce8ccb015176a157f9bb0"; //req.session.user;
      isUserLoggedIn = true;
      idValidation(userId);
    }
    let eventId = req.params.id;
    //idValidation(eventId);
    const postDataList = await postData.getAllPostsForEvent(eventId);
    for (const i in postDataList) {
      output.push({
        _id: postDataList[i]._id,
        userId: userId,
        userName: postDataList[i].username,
        currentUserName: currentUserName,
        text: postDataList[i].text,
        totalLikes: postDataList[i].totalLikes,
        postUserId: postDataList[i].userId,
        likes: postDataList[i].likes,
        comments: postDataList[i].commentListForEachPost,
      });
    }
    //console.log(eventId);
    //console.log(output);
    res.status(200).json({
      title: "Posts",
      postList: output,
      isUserLoggedIn: isUserLoggedIn,
    });
  } catch (e) {
    res.status(e.code || 500).json({
      title: "Discussion",
      error: e.message || "Internal server error occured while getting posts",
      isUserLoggedIn: isUserLoggedIn,
    });
  }
});

// to create a new post
router.route("/discussions/:id").post(async (req, res) => {
  let userId = "639ce8ccb015176a157f9bb0"; //req.session.user;
  const postInfo = req.body.data.newPost.text;
  const eventId = req.params.id;
  //console.log(eventId);
  //console.log(req.body);
  try {
    if (!checkUserLoggedIn(req)) {
      return res.status(200).redirect("/login");
    }
    idValidation(userId); // ObjectIdValidation and if the user exists in db or not
    textValidation(postInfo);
  } catch (e) {
    return res
      .status(e.code || 500)
      .json({ ErrorMessage: e.message || "Internal server error occured" });
  }

  try {
    const p = await postData.createPost(userId, eventId, postInfo);
    p.userId = userId;
    //console.log(p);
    p.userName = p.username;
    p.comments = p.commentListForEachPost;
    p.postUserId = p.userId;
    res.status(200).json(p); //.redirect("/discussions");
  } catch (e) {
    return res.status(e.code || 500).json({
      ErrorMessage:
        e.message || "Internal server error occured while creating post",
    });
  }
});

//to delete a post
router.route("/discussions/deletePost").delete(async (req, res) => {
  //console.log(req.body);
  const postId = req.body.postId;
  try {
    if (!checkUserLoggedIn(req)) {
      return res.status(200).redirect("/login");
    }
    idValidation(postId);
    await postData.deletePost(postId);
    res.status(200).json({ Success: "True" }); //.redirect("/discussions");
  } catch (e) {
    return res
      .status(e.code || 500)
      .json({ ErrorMessage: e.message || "Internal server error occured" });
  }
});

//to edit a post
router.route("/discussions/editPost").patch(async (req, res) => {
  try {
    if (!checkUserLoggedIn(req)) {
      return res.status(200).redirect("/login");
    }
    //console.log(req.body);
    const newPostText = req.body.data.editedPost;
    const postId = req.body.data.postId;
    textValidation(newPostText);
    idValidation(postId);
    let p = await postData.editPost(postId, newPostText);
    res.status(200).json({ Success: true }); //.redirect("/discussions");
  } catch (e) {
    return res
      .status(e.code || 500)
      .json({ ErrorMessage: e.message || "Internal server error occured" });
  }
});

// to like a post
router.route("/discussions/like").patch(async (req, res) => {
  let userId = "639ce8ccb015176a157f9bb0"; //req.session.user;
  //console.log(req.body);
  let postId = req.body.data.postId;
  try {
    idValidation(postId);
    if (!checkUserLoggedIn(req)) {
      return res.status(200).redirect("/login");
    }
    idValidation(userId);
    //console.log("Hello");
    await postData.increaseLike(userId, postId);
    //console.log("Helloooooooo");
    return res.status(200).json({ Success: "True" }); //.redirect("/discussions");
  } catch (e) {
    res
      .status(e.code || 500)
      .json({ ErrorMessage: e.message || "Error Ocurred while liking!" });
  }
});

// to unlike a post
router.route("/discussions/disLike").patch(async (req, res) => {
  let userId = "639ce8ccb015176a157f9bb0"; //req.session.user;
  //console.log(req.body);
  let postId = req.body.data.postId;
  try {
    idValidation(postId);
    if (!checkUserLoggedIn(req)) {
      return res.status(200).redirect("/login");
    }
    idValidation(userId);
    await postData.decreaseLike(userId, postId);
    res.status(200).json({ Success: "True" }); //.redirect("/discussions");
  } catch (e) {
    res.status(e.code || 500).json({
      ErrorMessage:
        e.message || "Internal server error occured while disliking!",
    });
  }
});

//to create a new comment
router.route("/discussions/comment").put(async (req, res) => {
  //console.log(req.body);
  let userId = "639ce8ccb015176a157f9bb0"; //req.session.user;
  let postId = req.body.data.postId;
  const commentInfo = req.body.data.newComment.text;

  try {
    idValidation(postId);
    if (!checkUserLoggedIn(req)) {
      return res.status(200).redirect("/login");
    }
    idValidation(userId);
    textValidation(commentInfo);

    let newComment = await postData.createCommentOnPost(
      userId,
      postId,
      commentInfo
    );
    res.status(200).json(newComment); //.redirect("/discussions");
  } catch (e) {
    res.status(e.code || 500).json({
      ErrorMessage:
        e.message || "Internal server error occured while disliking!",
    });
  }
});

//to check if text is string type
function textValidation(text) {
  if (!text)
    throw { code: 400, message: "You must provide a text in the post!" };
  if (typeof text !== "string")
    throw { code: 400, message: "Post should be a string!" };
  if (text.trim().length === 0)
    throw { code: 400, message: "Post can not be empty" };
}

//to check if id is string type and can be converted to object
function idValidation(id) {
  if (!id) throw { code: 400, message: "You must provide an id to search for" };
  if (typeof id !== "string")
    throw { code: 400, message: "Id must be a string" };
  if (id.trim().length === 0)
    throw { code: 400, message: "Id cannot be an empty string or just spaces" };
  id = id.trim();
  if (!ObjectId.isValid(id)) throw { code: 400, message: "invalid object ID" };
}

function checkUserLoggedIn(req) {
  //   if (req.session.user) {
  //     return true;
  //   }
  return true;
  //return false;
}

module.exports = router;
