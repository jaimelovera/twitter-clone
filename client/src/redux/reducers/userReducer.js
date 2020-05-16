import {
  SET_USER,
  SET_AUTHENTICATED,
  SET_UNAUTHENTICATED,
  LOADING_USER,
  LIKE_TWEET,
  UNLIKE_TWEET,
} from "../types";

const initialState = {
  authenticated: false,
  loading: false,
  credentials: {},
  likes: [],
  notifications: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_AUTHENTICATED:
      return {
        authenticated: true,
        ...state,
      };
    case SET_UNAUTHENTICATED:
      return initialState;
    case SET_USER:
      return {
        authenticated: true,
        ...action.payload,
      };
    case LOADING_USER:
      return {
        ...state,
        loading: false,
      };
    case LIKE_TWEET:
      return {
        ...state,
        likes: [
          ...state.likes,
          {
            handle: state.credentials.handle,
            tweetId: action.payload.tweetId,
          },
        ],
      };
    case UNLIKE_TWEET:
      return {
        ...state,
        likes: state.likes.filter(
          (like) => like.tweetId !== action.payload.tweetId
        ),
      };
    default:
      return state;
  }
}
