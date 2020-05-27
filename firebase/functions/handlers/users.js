const { admin, db } = require("../util/admin");
const config = require("../util/config");

const firebase = require("firebase");
firebase.initializeApp(config);

const {
  validateSignupData,
  validateLoginData,
  reduceUserDetails,
} = require("../util/validators");

// Sign user up.
exports.signup = (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    handle: req.body.handle,
  };

  // Remove any white space on ends of the email and handle
  newUser.email = newUser.email.trim();
  newUser.handle = newUser.handle.trim();

  const { valid, errors } = validateSignupData(newUser);

  if (!valid) {
    return res.status(400).json(errors);
  }

  const blankProfileImg = "blank-profile-image.png";

  // Check that handle and email are not being used already.
  let token, userId;
  db.doc(`/users/${newUser.handle}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        return res.status(400).json({ handle: "this handle is already taken" });
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
      token = idToken;
      const userCredentials = {
        userId: userId,
        handle: newUser.handle,
        email: newUser.email,
        imageUrl: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${blankProfileImg}?alt=media`,
        createdAt: new Date().toISOString(),
      };
      return db.doc(`/users/${newUser.handle}`).set(userCredentials);
    })
    .then(() => {
      return res.json({ token });
    })
    .catch((err) => {
      console.log(err);
      if (err.code === "auth/email-already-in-use") {
        return res.status(400).json({ email: "email is already in use" });
      } else {
        return res.status(400).json({ general: err.message });
      }
    });
};

// Delete logedin users account
// Deletes all accociated collections of user and updates other users tweet count info.
// This only deletes the auth account, and then a trigger deletes the rest.
exports.deleteAccount = (req, res) => {
  if (req.user.uid === req.params.uid) {
    admin
      .auth()
      .deleteUser(req.params.uid)
      .then(() => {
        return res.json({ message: "Successfully deleted user" });
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json({ error: err.code });
      });
  } else {
    return res
      .status(500)
      .json({ message: "Not authorized to delete this account" });
  }
};

// Log user in.
exports.login = (req, res) => {
  console.error(config);
  const user = {
    email: req.body.email,
    password: req.body.password,
  };

  const { valid, errors } = validateLoginData(user);

  if (!valid) return res.status(400).json(errors);

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
      console.error(err);
      return res.status(403).json({ general: err.message });
    });
};

// Add user details
exports.addUserDetails = (req, res) => {
  let userDetails = reduceUserDetails(req.body);

  db.doc(`/users/${req.user.handle}`)
    .update(userDetails)
    .then(() => {
      return res.json({ message: "Details added succesfully" });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.code });
    });
};

// Get any user's details
exports.getUserDetails = (req, res) => {
  let userData = {};
  db.doc(`/users/${req.params.handle}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        userData.user = doc.data();
        return db
          .collection("tweets")
          .where("handle", "==", req.params.handle)
          .orderBy("createdAt", "desc")
          .get();
      } else {
        return res.status(404).json({ error: "User not found" });
      }
    })
    .then((data) => {
      userData.tweets = [];
      data.forEach((doc) => {
        userData.tweets.push({
          body: doc.data().body,
          createdAt: doc.data().createdAt,
          handle: doc.data().handle,
          userImage: doc.data().userImage,
          likeCount: doc.data().likeCount,
          commentCount: doc.data().commentCount,
          tweetId: doc.id,
        });
      });
      return res.json(userData);
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

// Get own user details.
exports.getAuthenticatedUser = (req, res) => {
  let userData = {};
  db.doc(`/users/${req.user.handle}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        userData.credentials = doc.data();
        return db
          .collection("likes")
          .where("handle", "==", req.user.handle)
          .get();
      }
    })
    .then((data) => {
      userData.likes = [];
      data.forEach((doc) => {
        userData.likes.push(doc.data());
      });
      return db
        .collection("notifications")
        .where("recipient", "==", req.user.handle)
        .orderBy("createdAt", "desc")
        .limit(15)
        .get();
    })
    .then((data) => {
      userData.notifications = [];
      data.forEach((doc) => {
        userData.notifications.push({
          recipient: doc.data().recipient,
          sender: doc.data().sender,
          read: doc.data().read,
          tweetId: doc.data().tweetId,
          type: doc.data().type,
          createdAt: doc.data().createdAt,
          notificationId: doc.id,
        });
      });
      return res.json(userData);
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

// Upload a profile image for user.
exports.uploadImage = (req, res) => {
  const oldImage = req.user.imageUrls;
  const BusBoy = require("busboy");
  const path = require("path");
  const os = require("os");
  const fs = require("fs");

  const busboy = new BusBoy({ headers: req.headers });

  let imageFileName;
  let imageToBeUploaded = {};

  busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
    if (mimetype !== "image/jpeg" && mimetype !== "image/png") {
      return res.status(400).json({ error: "Wrong file type submitted" });
    }
    // Grab file extension type.
    const imageExtension = filename.split(".").pop();
    imageFileName = `${req.user.handle}${Math.floor(
      Math.random() * 100000 + 1
    )}.${imageExtension}`;
    const filepath = path.join(os.tmpdir(), imageFileName);
    imageToBeUploaded = { filepath, mimetype };
    file.pipe(fs.createWriteStream(filepath));
  });
  busboy.on("finish", () => {
    admin
      .storage()
      .bucket(config.storageBucket)
      .upload(imageToBeUploaded.filepath, {
        resumable: false,
        metadata: { contentType: imageToBeUploaded.mimetype },
      })
      .then(() => {
        const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;
        return db
          .doc(`/users/${req.user.handle}`)
          .update({ imageUrl, imageFileName });
      })
      .then(() => {
        return res.json({ message: "Image uploaded succesfully" });
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json({ error: err.code });
      });
  });
  busboy.end(req.rawBody);
};

exports.markNotificationsRead = (req, res) => {
  let batch = db.batch();
  req.body.forEach((notificationId) => {
    const notification = db.doc(`/notifications/${notificationId}`);
    batch.update(notification, { read: true });
  });
  batch
    .commit()
    .then(() => {
      return res.json({ message: "Notifications marked read" });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};
