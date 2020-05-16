import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import PropTypes from "prop-types";
import MyButton from "../util/MyButton";
import DeleteTweet from "./DeleteTweet";
import TweetDialog from "./TweetDialog";

// Material-UI Stuff
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";

//Icons
import ChatIcon from "@material-ui/icons/Chat";
import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";

// Redux
import { connect } from "react-redux";
import { likeTweet, unlikeTweet } from "../redux/actions/dataActions";

const styles = {
  card: {
    position: "relative",
    display: "flex",
    marginBottom: 20,
  },
  image: {
    maxWidth: 125,
    maxHeight: 200,
  },
  content: {
    padding: 25,
  },
};

class Tweet extends Component {
  likedTweet = () => {
    if (
      this.props.user.likes &&
      this.props.user.likes.find(
        (like) => like.tweetId === this.props.tweet.tweetId
      )
    ) {
      return true;
    } else {
      return false;
    }
  };

  likeTweet = () => {
    this.props.likeTweet(this.props.tweet.tweetId);
  };

  unlikeTweet = () => {
    this.props.unlikeTweet(this.props.tweet.tweetId);
  };

  render() {
    dayjs.extend(relativeTime);
    const {
      classes,
      tweet: {
        body,
        createdAt,
        userImage,
        handle,
        tweetId,
        likeCount,
        commentCount,
      },
      user: {
        authenticated,
        credentials: { handle: userHandle },
      },
    } = this.props;

    const likeButton = !authenticated ? (
      <MyButton tip="Like">
        <Link to="/login">
          <FavoriteBorder color="primary" />
        </Link>
      </MyButton>
    ) : this.likedTweet() ? (
      <MyButton tip="Undo Like" onClick={this.unlikeTweet}>
        <FavoriteIcon color="primary" />
      </MyButton>
    ) : (
      <MyButton tip="Like" onClick={this.likeTweet}>
        <FavoriteBorder color="primary" />
      </MyButton>
    );

    const deleteButton =
      authenticated && handle === userHandle ? (
        <DeleteTweet tweetId={tweetId} />
      ) : null;

    return (
      <Card className={classes.card}>
        <CardMedia
          image={userImage}
          component="img"
          title="Profile Image"
          className={classes.image}
        />
        <CardContent className={classes.content}>
          <Typography
            variant="h5"
            component={Link}
            to={`/users/${handle}`}
            color="primary"
          >
            {handle}
          </Typography>
          {deleteButton}
          <Typography variant="body2" color="textSecondary">
            {dayjs(createdAt).fromNow()}
          </Typography>
          <Typography variant="body1">{body}</Typography>
          {likeButton}
          <span>{likeCount} Likes</span>
          <MyButton tip="comments">
            <ChatIcon color="primary" />
          </MyButton>
          <span>{commentCount} comments</span>
          <TweetDialog tweetId={tweetId} handle={handle} />
        </CardContent>
      </Card>
    );
  }
}

Tweet.propTypes = {
  likeTweet: PropTypes.func.isRequired,
  unlikeTweet: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  tweet: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
});

const mapActionsToProps = {
  likeTweet,
  unlikeTweet,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(Tweet));
