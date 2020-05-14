import {
  SET_TWEETS,
  LIKE_TWEET,
  UNLIKE_TWEET,
  LOADING_DATA,
  DELETE_TWEET,
} from "../types";

const initialState = {
  tweets: [],
  tweet: {},
  loading: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case LOADING_DATA:
      return {
        ...state,
        loading: true,
      };
    case SET_TWEETS:
      return {
        ...state,
        tweets: action.payload,
        loading: false,
      };
    case LIKE_TWEET:
    case UNLIKE_TWEET:
      let index = state.tweets.findIndex(
        (tweet) => tweet.tweetId === action.payload.tweetId
      );
      state.tweets[index] = action.payload;
      return {
        ...state,
      };
    case DELETE_TWEET:
      console.log("hello i am here!");
      let tweetIndex = state.tweets.findIndex(
        (tweet) => tweet.tweetId === action.payload
      );
      state.tweets.splice(tweetIndex, 1);
      return {
        ...state,
      };
    default:
      return state;
  }
}
