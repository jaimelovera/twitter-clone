import {
  SET_TWEETS,
  LOADING_DATA,
  LIKE_TWEET,
  UNLIKE_TWEET,
  DELETE_TWEET,
  LOADING_UI,
  POST_TWEET,
  SET_ERRORS,
  CLEAR_ERRORS,
  SET_TWEET,
  STOP_LOADING_UI,
  SUBMIT_COMMENT,
  DELETE_COMMENT,
} from "../types";
import axios from "axios";

// Get all tweets
export const getTweets = () => (dispatch) => {
  dispatch({ type: LOADING_DATA });
  axios
    .get("/tweets")
    .then((res) => {
      dispatch({ type: SET_TWEETS, payload: res.data });
    })
    .catch((err) => {
      dispatch({ type: SET_TWEETS, payload: [] });
    });
};

// Get a single tweet with all details.
export const getTweet = (tweetId) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .get(`/tweet/${tweetId}`)
    .then((res) => {
      dispatch({ type: SET_TWEET, payload: res.data });
      dispatch({ type: STOP_LOADING_UI });
    })
    .catch((err) => console.log(err));
};

// Post a tweet
export const postTweet = (newTweet) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .post("/tweet", newTweet)
    .then((res) => {
      dispatch({ type: POST_TWEET, payload: res.data });
      dispatch(clearErrors());
    })
    .catch((err) => {
      dispatch({ type: SET_ERRORS, payload: err.response.data });
    });
};

// Like a tweets
export const likeTweet = (tweetId) => (dispatch) => {
  axios
    .get(`/tweet/${tweetId}/like`)
    .then((res) => {
      dispatch({
        type: LIKE_TWEET,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

// Unlike a tweet
export const unlikeTweet = (tweetId) => (dispatch) => {
  axios
    .get(`/tweet/${tweetId}/unlike`)
    .then((res) => {
      dispatch({
        type: UNLIKE_TWEET,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

// Submit a comment
export const submitComment = (tweetId, commentData) => (dispatch) => {
  axios
    .post(`/tweet/${tweetId}/comment`, commentData)
    .then((res) => {
      dispatch({
        type: SUBMIT_COMMENT,
        payload: res.data,
      });
      dispatch(clearErrors());
    })
    .catch((err) => {
      dispatch({ type: SET_ERRORS, payload: err.response.data });
    });
};

// Delete a tweet
export const deleteTweet = (tweetId) => (dispatch) => {
  axios
    .delete(`/tweet/${tweetId}`)
    .then(() => {
      dispatch({ type: DELETE_TWEET, payload: tweetId });
    })
    .catch((err) => console.log(err));
};

// Delete a comment
export const deleteComment = (commentId) => (dispatch) => {
  axios
    .delete(`/comment/${commentId}`)
    .then(() => {
      dispatch({ type: DELETE_COMMENT, payload: commentId });
    })
    .catch((err) => console.log(err));
};

export const getUserData = (handle) => (dispatch) => {
  dispatch({ type: LOADING_DATA });
  axios
    .get(`/user/${handle}`)
    .then((res) => {
      dispatch({ type: SET_TWEETS, payload: res.data.tweets });
    })
    .catch(() => {
      dispatch({ type: SET_TWEETS, payload: null });
    });
};

export const clearErrors = () => (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
