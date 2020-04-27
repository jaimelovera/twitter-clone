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

firebase.initializeApp(config);

const db = firebase.firestore();

module.exports = { firebase, db };
