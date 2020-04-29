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
  userDetails: [
    {
      //Redux data
      credentials: {
        userId: "rgh589h59v8n985gh59gh",
        email: "jaime@gmail.com",
        handle: "jaime",
        createdAt: "timestamp",
        imageUrl: "image/...ggewhgef.jpeg",
        bio: "Hello, my name is jaime.",
        website: "https://jaimelovera.com",
        location: "California, United States",
      },
      likes: [
        { handle: "user", postId: "gwregerg45h46h9845yhg" },
        { handle: "user", postId: "gwrefouydo7xo7fou645yhg" },
      ],
    },
  ],
};
