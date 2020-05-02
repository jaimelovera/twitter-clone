const { db } = require("../util/firebase");

exports.getAllTweets = (req, res) => {
  db.collection("tweets")
    .orderBy("createdAt", "desc")
    .get()
    .then((data) => {
      let tweets = [];
      data.forEach((doc) => {
        tweets.push({
          tweetID: doc.id,
          handle: doc.data().handle,
          body: doc.data().body,
          createdAt: doc.data().createdAt,
          likeCount: doc.data().likeCount,
          commentCount: doc.data().commentCount,
        });
      });
      return res.json(tweets);
    })
    .catch((err) => console.log(err));
};

// Post a tweet
exports.postOneTweet = (req, res) => {
  const newTweet = {
    handle: req.user.handle,
    body: req.body.body,
    createdAt: new Date().toISOString(),
    likeCount: 0,
    commentCount: 0,
  };

  db.collection("tweets")
    .add(newTweet)
    .then((doc) => {
      res.json({ message: `document ${doc.id} created succesfully` });
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
    return res.status(400).json({ error: "Must not be empty" });
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
