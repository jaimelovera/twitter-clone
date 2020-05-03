// Just a reference file to see my database schema.

let db = {
  users: [
    {
      userId: "rgh589h59v8n985gh59gh",
      email: "jaime@gmail.com",
      handle: "jaime",
      createdAt: "timestamp",
      imageUrl: "image/...ggewhgef.jpeg",
      bio: "Hello, my name is jaime.",
      website: "https://jaimelovera.com",
      location: "California, United States",
    },
  ],
  posts: [
    {
      handle: "user",
      body: "this is a post body",
      createdAt: "2020-04-22T14:48:28.015Z",
      likeCount: 1,
      commentCount: 1,
    },
  ],
  comments: [
    {
      userHandle: "user",
      tweetId: "59gh8bntghkvb45jkg",
      body: "this is the body text!",
      createdAt: "2020-04-22T14:48:28.015Z",
    },
  ],
  notifications: [
    {
      recipient: "user",
      sender: "user2",
      read: "true | false",
      tweetId: "59gh8bntghkvb45jkg",
      type: "like | comment",
      createdAt: "2020-04-22T14:48:28.015Z",
    },
  ],
};

const userDetails = {
  // Redux data
  credentials: {
    userId: "N43KJ5H43KJHREW4J5H3JWMERHB",
    email: "user@gmail.com",
    handle: "user",
    createdAt: "2019-03-15T10:59:52.798Z",
    imageUrl: "image/dsfsdkfghskdfgs/dgfdhfgdh",
    bio: "Hello, my name is user.",
    website: "https://user.com",
    location: "San Diego, CA",
  },
  likes: [
    {
      handle: "user",
      tweetId: "hh7O5oWfWucVzGbHH2pa",
    },
    {
      handle: "user",
      tweetId: "3IOnFoQexRcofs5OhBXO",
    },
  ],
};
