import React, { Component } from "react";
import MyButton from "../util/MyButton";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

//Icons
import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";

// Redux
import { connect } from "react-redux";
import { likeTweet, unlikeTweet } from "../redux/actions/dataActions";

export class LikeButton extends Component {
  likedTweet = () => {
    if (
      this.props.user.likes &&
      this.props.user.likes.find((like) => like.tweetId === this.props.tweetId)
    ) {
      return true;
    } else {
      return false;
    }
  };

  likeTweet = () => {
    this.props.likeTweet(this.props.tweetId);
  };

  unlikeTweet = () => {
    this.props.unlikeTweet(this.props.tweetId);
  };

  render() {
    const { authenticated } = this.props.user;

    const likeButton = !authenticated ? (
      <Link to="/login">
        <MyButton tip="Like">
          <FavoriteBorder color="primary" />
        </MyButton>
      </Link>
    ) : this.likedTweet() ? (
      <MyButton tip="Undo Like" onClick={this.unlikeTweet}>
        <FavoriteIcon color="primary" />
      </MyButton>
    ) : (
      <MyButton tip="Like" onClick={this.likeTweet}>
        <FavoriteBorder color="primary" />
      </MyButton>
    );

    return likeButton;
  }
}

LikeButton.propTypes = {
  user: PropTypes.object.isRequired,
  tweetId: PropTypes.string.isRequired,
  likeTweet: PropTypes.func.isRequired,
  unlikeTweet: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
});

const mapActionsToProps = {
  likeTweet,
  unlikeTweet,
};

export default connect(mapStateToProps, mapActionsToProps)(LikeButton);
