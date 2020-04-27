const functions = require("firebase-functions");

const app = require("express")();

const FBAuth = require("./util/fbAuth");

const { getAllTweets, postOneTweet } = require("./handlers/tweets");
const { signup, login } = require("./handlers/users");

// Tweets routes.
app.get("/tweets", getAllTweets);
app.post("/tweet", FBAuth, postOneTweet);

// Users routes
app.post("/signup", signup);
app.post("/login", login);

/* This app function will be a container for all of our cloud functions.
   It will add "/api" to all of our api routes */
exports.api = functions.https.onRequest(app);
