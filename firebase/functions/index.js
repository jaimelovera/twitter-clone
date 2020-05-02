const functions = require("firebase-functions");
const app = require("express")();

const FBAuth = require("./util/fbAuth");

const {
  getAllTweets,
  postOneTweet,
  getTweet,
  commentOnTweet,
  likeTweet,
  unlikeTweet,
  deleteTweet,
} = require("./handlers/tweets");
const {
  signup,
  login,
  uploadImage,
  addUserDetails,
  getAuthenticatedUser,
} = require("./handlers/users");

// Tweets routes.
app.get("/tweets", getAllTweets);
app.post("/tweet", FBAuth, postOneTweet);
app.get("/tweet/:tweetId", getTweet);
app.delete("/tweet/:tweetId", FBAuth, deleteTweet);
app.get("/tweet/:tweetId/like", FBAuth, likeTweet);
app.get("/tweet/:tweetId/unlike", FBAuth, unlikeTweet);
app.post("/tweet/:tweetId/comment", FBAuth, commentOnTweet);

// Users routes
app.post("/signup", signup);
app.post("/login", login);
app.post("/user/image", FBAuth, uploadImage);
app.post("/user", FBAuth, addUserDetails);
app.get("/user", FBAuth, getAuthenticatedUser);

/* This app function will be a container for all of our cloud functions.
   It will add "/api" to all of our api routes */
exports.api = functions.https.onRequest(app);
