const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

const express = require("express");
const app = express();

app.post("/post", (req, res) => {
  const newPost = {
    userHandle: req.body.userHandle,
    body: req.body.body,
    createdAt: new Date().toISOString(),
  };

  admin
    .firestore()
    .collection("posts")
    .add(newPost)
    .then((doc) => {
      res.json({ message: `document ${doc.id} created succesfully` });
    })
    .catch((err) => {
      res.status(500).json({ error: "something went wrong" });
      console.log(err);
    });
});

// This app function will be a container for all of our functions.
// It will add "/api" to all of our api routes.
// GET/POST will be explicitly stated for each function so no need to check.
exports.api = functions.https.onRequest(app);
