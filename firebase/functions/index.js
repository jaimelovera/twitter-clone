const functions = require("firebase-functions");
const app = require("express")();
const { db } = require("./util/firebase");

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
  getUserDetails,
  markNotificationsRead,
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
app.get("/user/:handle", getUserDetails);
app.post("/notifications", FBAuth, markNotificationsRead);

/* This app function will be a container for all of our cloud functions.
   It will add "/api" to all of our api routes */
exports.api = functions.https.onRequest(app);

exports.createNotificationOnLike = functions.firestore
  .document("likes/{id}")
  .onCreate((snapshot) => {
    db.doc(`/tweets/${snapshot.data().tweetId}`)
      .get()
      .then((doc) => {
        if (doc.exists) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            recipient: doc.data().handle,
            sender: snapshot.data().handle,
            read: false,
            tweetId: doc.id,
            type: "like",
            createdAt: new Date().toISOString(),
          });
        }
      })
      .then(() => {
        return;
      })
      .catch((err) => {
        console.error(err);
        return;
      });
  });

exports.deleteNotificationOnUnlike = functions.firestore
  .document("likes/{id}")
  .onDelete((snapshot) => {
    db.doc(`/notifications/${snapshot.id}`)
      .delete()
      .then(() => {
        return;
      })
      .catch((err) => {
        console.error(err);
        return;
      });
  });

exports.createNotificationOnComment = functions.firestore
  .document("comments/{id}")
  .onCreate((snapshot) => {
    db.doc(`/tweets/${snapshot.data().tweetId}`)
      .get()
      .then((doc) => {
        if (doc.exists) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            recipient: doc.data().handle,
            sender: snapshot.data().handle,
            read: false,
            tweetId: doc.id,
            type: "comment",
            createdAt: new Date().toISOString(),
          });
        }
      })
      .then(() => {
        return;
      })
      .catch((err) => {
        console.error(err);
        return;
      });
  });
