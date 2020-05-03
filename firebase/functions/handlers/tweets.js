const { db } = require("../util/firebase");

exports.getAllTweets = (req, res) => {
  db.collection("tweets")
    .orderBy("createdAt", "desc")
    .get()
    .then((data) => {
      let tweets = [];
      data.forEach((doc) => {
        tweets.push({
          tweetId: doc.id,
          handle: doc.data().handle,
          body: doc.data().body,
          createdAt: doc.data().createdAt,
          likeCount: doc.data().likeCount,
          commentCount: doc.data().commentCount,
          userImage: doc.data().userImage,
        });
      });
      return res.json(tweets);
    })
    .catch((err) => console.log(err));
};

// Post a tweet
exports.postOneTweet = (req, res) => {
  if (req.body.body.trim() === "") {
    return res.status(400).json({ body: "Body must not be empty" });
  }

  const newTweet = {
    handle: req.user.handle,
    body: req.body.body,
    userImage: req.user.imageUrl,
    createdAt: new Date().toISOString(),
    likeCount: 0,
    commentCount: 0,
  };

  db.collection("tweets")
    .add(newTweet)
    .then((doc) => {
      const resTweet = newTweet;
      resTweet.tweetId = doc.id;
      res.json(resTweet);
    })
    .catch((err) => {
      res.status(500).json({ error: "something went wrong" });
      console.log(err);
    });
};

// Get one tweet.
exports.getTweet = (req, res) => {
  let tweetData = {};
  db.doc(`/tweets/${req.params.tweetId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Tweet not found" });
      }
      tweetData = doc.data();
      tweetData.tweetId = doc.id;
      return db
        .collection("comments")
        .orderBy("createdAt", "desc")
        .where("tweetId", "==", req.params.tweetId)
        .get();
    })
    .then((data) => {
      tweetData.comments = [];
      data.forEach((doc) => {
        tweetData.comments.push(doc.data());
      });
      return res.json(tweetData);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

// Comment on a tweet
exports.commentOnTweet = (req, res) => {
  if (req.body.body.trim() === "") {
    return res.status(400).json({ comment: "Must not be empty" });
  }

  const newComment = {
    body: req.body.body,
    createdAt: new Date().toISOString(),
    tweetId: req.params.tweetId,
    handle: req.user.handle,
    userImage: req.user.imageUrl,
  };

  db.doc(`/tweets/${req.params.tweetId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Tweet not found" });
      }
      return doc.ref.update({ commentCount: doc.data().commentCount + 1 });
    })
    .then(() => {
      return db.collection("comments").add(newComment);
    })
    .then(() => {
      res.json(newComment);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Something went wrong" });
    });
};

// Like a tweet
exports.likeTweet = (req, res) => {
  const likeDocument = db
    .collection("likes")
    .where("handle", "==", req.user.handle)
    .where("tweetId", "==", req.params.tweetId)
    .limit(1);

  const tweetDocument = db.doc(`/tweets/${req.params.tweetId}`);

  let tweetData;

  tweetDocument
    .get()
    .then((doc) => {
      if (doc.exists) {
        tweetData = doc.data();
        tweetData.tweetId = doc.id;
        return likeDocument.get();
      } else {
        return res.status(404).json({ error: "Tweet not found" });
      }
    })
    .then((data) => {
      if (data.empty) {
        return db
          .collection("likes")
          .add({
            tweetId: req.params.tweetId,
            handle: req.user.handle,
          })
          .then(() => {
            tweetData.likeCount++;
            return tweetDocument.update({ likeCount: tweetData.likeCount });
          })
          .then(() => {
            return res.json(tweetData);
          });
      } else {
        return res.status(400).json({ error: "Tweet already liked" });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

// Unlike a tweet
exports.unlikeTweet = (req, res) => {
  const likeDocument = db
    .collection("likes")
    .where("handle", "==", req.user.handle)
    .where("tweetId", "==", req.params.tweetId)
    .limit(1);

  const tweetDocument = db.doc(`/tweets/${req.params.tweetId}`);

  let tweetData;

  tweetDocument
    .get()
    .then((doc) => {
      if (doc.exists) {
        tweetData = doc.data();
        tweetData.tweetId = doc.id;
        return likeDocument.get();
      } else {
        return res.status(404).json({ error: "Tweet not found" });
      }
    })
    .then((data) => {
      if (data.empty) {
        return res.status(400).json({ error: "Tweet not liked" });
      } else {
        return db
          .doc(`/likes/${data.docs[0].id}`)
          .delete()
          .then(() => {
            tweetData.likeCount--;
            return tweetDocument.update({ likeCount: tweetData.likeCount });
          })
          .then(() => {
            return res.json(tweetData);
          });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

// Delete a tweet
exports.deleteTweet = (req, res) => {
  const document = db.doc(`/tweets/${req.params.tweetId}`);
  document
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Tweet not found" });
      }
      if (doc.data().handle !== req.user.handle) {
        return res.status(403).json({ error: "Unauthorized" });
      } else {
        return document.delete();
      }
    })
    .then(() => {
      res.json({ message: "Tweet deleted succesfully" });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};
