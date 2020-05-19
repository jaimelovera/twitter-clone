const functions = require("firebase-functions");
const app = require("express")();
const { db, config } = require("./util/firebase");
const { admin } = require("./util/admin");
const FBAuth = require("./util/fbAuth");

const cors = require("cors")({ origin: true });
app.use(cors);

const {
  getAllTweets,
  postOneTweet,
  getTweet,
  commentOnTweet,
  likeTweet,
  unlikeTweet,
  deleteTweet,
  deleteComment,
} = require("./handlers/tweets");
const {
  signup,
  login,
  uploadImage,
  addUserDetails,
  getAuthenticatedUser,
  getUserDetails,
  markNotificationsRead,
  deleteAccount,
} = require("./handlers/users");

// Tweets routes.
app.get("/tweets", getAllTweets);
app.post("/tweet", FBAuth, postOneTweet);
app.get("/tweet/:tweetId", getTweet);
app.delete("/tweet/:tweetId", FBAuth, deleteTweet);
app.get("/tweet/:tweetId/like", FBAuth, likeTweet);
app.get("/tweet/:tweetId/unlike", FBAuth, unlikeTweet);
app.post("/tweet/:tweetId/comment", FBAuth, commentOnTweet);
app.delete("/comment/:commentId", FBAuth, deleteComment);

// Users routes
app.post("/signup", signup);
app.post("/login", login);
app.post("/user/image", FBAuth, uploadImage);
app.post("/user", FBAuth, addUserDetails);
app.get("/user", FBAuth, getAuthenticatedUser);
app.get("/user/:handle", getUserDetails);
app.post("/notifications", FBAuth, markNotificationsRead);
app.post("/user/delete/:uid", FBAuth, deleteAccount);

/* This app function will be a container for all of our cloud functions.
   It will add "/api" to all of our api routes */
exports.api = functions.https.onRequest(app);

// Database triggers to upadate collections when certain fields are changed.

// When a post is liked, create a notification for the posts author.
exports.createNotificationOnLike = functions.firestore
  .document("likes/{id}")
  .onCreate((snapshot) => {
    return db
      .doc(`/tweets/${snapshot.data().tweetId}`)
      .get()
      .then((doc) => {
        if (doc.exists && doc.data().handle !== snapshot.data().handle) {
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
      .catch((err) => {
        console.error(err);
      });
  });

// When a user removes a like, delete any notification that was created for that like.
exports.deleteNotificationOnUnlike = functions.firestore
  .document("likes/{id}")
  .onDelete((snapshot) => {
    return db
      .doc(`/notifications/${snapshot.id}`)
      .delete()
      .catch((err) => {
        console.error(err);
        return;
      });
  });

// When a comment is created, create a notification for the posts author.
exports.createNotificationOnComment = functions.firestore
  .document("comments/{id}")
  .onCreate((snapshot) => {
    return db
      .doc(`/tweets/${snapshot.data().tweetId}`)
      .get()
      .then((doc) => {
        if (doc.exists && doc.data().handle !== snapshot.data().handle) {
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
      .catch((err) => {
        console.error(err);
        return;
      });
  });

// When a user changes their photo, update all url datapoints of that user.
// And delete the old photo from storage.
exports.onUserImageChange = functions.firestore
  .document("users/{userId}")
  .onUpdate((change) => {
    const oldImage = change.before.data().imageFileName;
    // Check that the image url was changed.
    if (change.before.data().imageUrl !== change.after.data().imageUrl) {
      const batch = db.batch();
      return (
        db
          .collection("tweets")
          .where("handle", "==", change.before.data().handle)
          .get()
          // Update imageUrls in all tweets by this user.
          .then((data) => {
            data.forEach((doc) => {
              const tweet = db.doc(`/tweets/${doc.id}`);
              batch.update(tweet, { userImage: change.after.data().imageUrl });
            });
            return db
              .collection("comments")
              .where("handle", "==", change.before.data().handle)
              .get();
          })
          // Update imageUrls in all comments by this user.
          .then((data) => {
            data.forEach((doc) => {
              const comment = db.doc(`/comments/${doc.id}`);
              batch.update(comment, {
                userImage: change.after.data().imageUrl,
              });
            });
            return batch.commit();
          })
          // Delete old image from storage.
          .then(() => {
            if (oldImage) {
              admin
                .storage()
                .bucket(config.storageBucket)
                .file(oldImage)
                .delete();
            }
          })
          .catch((err) => {
            console.error(err);
          })
      );
    } else {
      return true;
    }
  });

// When a post is deleted, delete all datapoints that were attributed to the post.
exports.onTweetDelete = functions.firestore
  .document("tweets/{tweetId}")
  .onDelete((snapshot, context) => {
    const tweetId = context.params.tweetId;
    const batch = db.batch();
    return db
      .collection("comments")
      .where("tweetId", "==", tweetId)
      .get()
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/comments/${doc.id}`));
        });
        return db.collection("likes").where("tweetId", "==", tweetId).get();
      })
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/likes/${doc.id}`));
        });
        return db
          .collection("notifications")
          .where("tweetId", "==", tweetId)
          .get();
      })
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/notifications/${doc.id}`));
        });
        return batch.commit();
      })
      .catch((err) => {
        console.error(err);
      });
  });
