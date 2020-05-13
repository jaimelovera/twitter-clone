import { SET_TWEETS, LOADING_DATA, LIKE_TWEET, UNLIKE_TWEET } from "../types";
import axios from "axios";

// Get all tweets
export const getTweets = () => (dispatch) => {
  dispatch({ type: LOADING_DATA });
  axios
    .get("/tweets")
    .then((res) => {
      dispatch({ type: SET_TWEET, payload: res.data });
    })
    .catch((err) => {
      dispatch({ type: SET_TWEET, payload: [] });
    });
};

// Like a tweets

// Unlike a tweet
