const db = require("../util/admin");

exports.getAllTweets = (req, res) => {
  db.collection("tweets")
    .orderBy("createdAt", "desc")
    .get()
    .then((data) => {
      let tweets = [];
      data.forEach((doc) => {
        tweets.push({
          tweetID: doc.id,
          userHandle: doc.data().userHandle,
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

exports.postOneTweet = (req, res) => {
  const newTweet = {
    userHandle: req.user.userHandle,
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
