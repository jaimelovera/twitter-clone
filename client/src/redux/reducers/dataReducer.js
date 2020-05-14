import { SET_TWEETS, LIKE_TWEET, UNLIKE_TWEET, LOADING_DATA } from "../types";
import { DialogActions } from "@material-ui/core";

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
    default:
      return state;
  }
}
