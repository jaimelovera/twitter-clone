import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import PropTypes from "prop-types";
import DeleteTweet from "./DeleteTweet";
import TweetDialog from "./TweetDialog";
import LikeButton from "./LikeButton";

// Material-UI Stuff
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";

// Redux
import { connect } from "react-redux";

const styles = {
  card: {
    position: "relative",
    display: "flex",
    marginBottom: 20,
  },
  image: {
    height: 60,
    width: 60,
    borderRadius: "50%",
    margin: "30px 0 0 25px",
  },
  content: {
    padding: 25,
  },
};

class Tweet extends Component {
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

    const deleteButton =
      authenticated && handle === userHandle ? (
        <DeleteTweet tweetId={tweetId} />
      ) : null;

    return (
      <Card className={classes.card}>
        <div style={{ width: 80, height: 80 }}>
          <CardMedia
            image={userImage}
            component="img"
            title="Profile Image"
            className={classes.image}
          />
        </div>
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
          <LikeButton tweetId={tweetId} />
          {likeCount}
          <TweetDialog
            tweetId={tweetId}
            handle={handle}
            openDialog={this.props.openDialog}
          />
          {commentCount}
        </CardContent>
      </Card>
    );
  }
}

Tweet.propTypes = {
  user: PropTypes.object.isRequired,
  tweet: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  openDialog: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps)(withStyles(styles)(Tweet));
