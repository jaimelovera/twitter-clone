const functions = require("firebase-functions");
const admin = require("firebase-admin");
const app = require("express")();
const firebase = require("firebase");

const config = {
  apiKey: "AIzaSyD9WKKCwZsfwh_AinuTkGncDKWtGfv-Jew",
  authDomain: "twitter-clone-b442b.firebaseapp.com",
  databaseURL: "https://twitter-clone-b442b.firebaseio.com",
  projectId: "twitter-clone-b442b",
  storageBucket: "twitter-clone-b442b.appspot.com",
  messagingSenderId: "905710086543",
  appId: "1:905710086543:web:db9ca8204cadf1c8e503fa",
};

admin.initializeApp();
firebase.initializeApp(config);

const db = admin.firestore();

app.get("post", (req, res) => {
  db.collection("posts")
    .orderBy("createdAt", "desc")
    .get()
    .then((data) => {
      let posts = [];
      data.forEach((doc) => {
        posts.push({
          postID: doc.id,
          userHandle: doc.data().userHandle,
          body: doc.data().body,
          createdAt: doc.data().createdAt,
          likeCount: doc.data().likeCount,
          commentCount: doc.data().commentCount,
        });
      });
      return res.json(posts);
    })
    .catch((err) => console.log(err));
});

app.post("/post", (req, res) => {
  const newPost = {
    userHandle: req.body.userHandle,
    body: req.body.body,
    createdAt: new Date().toISOString(),
  };
  db.collection("posts")
    .add(newPost)
    .then((doc) => {
      res.json({ message: `document ${doc.id} created succesfully` });
    })
    .catch((err) => {
      res.status(500).json({ error: "something went wrong" });
      console.log(err);
    });
});

// Helper methods
const isEmpty = (string) => {
  if (string.trim() === "") return true;
  else return false;
};
const isEmail = (email) => {
  const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(emailRegEx)) {
    return true;
  } else {
    return false;
  }
};

app.post("/signup", (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    userHandle: req.body.userHandle,
  };

  // Will be filled with all client errors
  let errors = {};

  // Validate data.
  if (isEmpty(newUser.email)) {
    errors.email = "Must not be empty";
  } else if (!isEmail(newUser.email)) {
    errors.email = "Must be a valid email address";
  }
  if (isEmpty(newUser.password)) {
    errors.password = "Must not be empty";
  }
  if (newUser.password !== newUser.confirmPassword) {
    errors.confirmPassword = "Passwords must match";
  }
  if (isEmpty(newUser.userHandle)) {
    errors.userHandle = "Must not be empty";
  }

  // If errors contains any errors return them.
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  // Check that handle and email are not being used already.
  let token, userId;
  db.doc(`/users/${newUser.userHandle}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        return res
          .status(400)
          .json({ userHandle: "this handle is already taken" });
      } else {
        return firebase
          .auth()
          .createUserWithEmailAndPassword(newUser.email, newUser.password);
      }
    })
    .then((data) => {
      userId = data.user.uid;
      return data.user.getIdToken();
    })
    .then((idToken) => {
      const token = idToken;
      const userCredentials = {
        userId: userId,
        userHandle: newUser.userHandle,
        email: newUser.email,
        createdAt: new Date().toISOString(),
      };
      return db.doc(`/users/${newUser.userHandle}`).set(userCredentials);
    })
    .then(() => {
      return res.json({ token });
    })
    .catch((err) => {
      console.log(err);
      if (err.code === "auth/email-already-in-use") {
        return res.status(400).json({ email: "email is already in use" });
      } else {
        return res.status(500).json({ error: err.code });
      }
    });
});

app.post("/login", (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password,
  };

  let errors = {};

  // Validate data.
  if (isEmpty(newUser.email)) {
    errors.email = "Must not be empty";
  } else if (!isEmail(newUser.email)) {
    errors.email = "Must be a valid email address";
  }
  if (isEmpty(newUser.password)) {
    errors.password = "Must not be empty";
  }

  // If errors contains any errors return them.
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then((data) => {
      return data.user.getIdToken();
    })
    .then((token) => {
      return res.json({ token });
    })
    .catch((err) => {
      console.log(err);
      if (err.code === "auth/wrong-password") {
        return res
          .status(403)
          .json({ general: "Password is incorrect, please try again." });
      } else {
        return res.status(500).json({ error: err.code });
      }
    });
});

/*
 This app function will be a container for all of our cloud functions.
 It will add "/api" to all of our api routes, and GET/POST will be explicitly
  stated for each function to avoid having to check everytime.
*/
exports.api = functions.https.onRequest(app);
