import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import MyButton from "../../util/MyButton";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import LikeButton from "./LikeButton";
import Comments from "./Comments";
import CommentForm from "./CommentForm";
import ResponsiveDialog from "../../util/ResponsiveDialog";

//Material-UI Stuff
import DialogContent from "@material-ui/core/DialogContent";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

// Icons
import CloseIcon from "@material-ui/icons/Close";
import ChatIcon from "@material-ui/icons/Chat";

// Redux stuff
import { connect } from "react-redux";
import { getTweet, clearErrors } from "../../redux/actions/dataActions";

const styles = (theme) => ({
  ...theme.spreadThis,
  profileImage: {
    height: 100,
    width: 100,
    borderRadius: "50%",
    margin: "15px 15px 0 15px",
    objectFit: "cover",
  },
  dialogContent: {
    padding: 24,
  },
  closeButton: {},
  spinnerDiv: {
    textAlign: "center",
    marginTop: 50,
    marginBottom: 50,
  },
  tweetContent: {
    paddingTop: 15,
  },
});

class TweetDialog extends Component {
  state = {
    open: false,
    oldPath: "",
    newPath: "",
  };

  componentDidMount() {
    if (this.props.openDialog) {
      this.handleOpen();
    }
  }

  handleOpen = () => {
    let oldPath = window.location.pathname;
    const { handle, tweetId } = this.props;
    const newPath = `/users/${handle}/tweet/${tweetId}`;

    window.history.pushState(null, null, newPath);
    this.setState({ open: true, oldPath, newPath });
    this.props.getTweet(this.props.tweetId);
  };

  handleClose = () => {
    window.history.pushState(null, null, this.state.oldPath);
    this.setState({ open: false });
    this.props.clearErrors();
  };

  render() {
    const {
      classes,
      tweet: {
        tweetId,
        body,
        createdAt,
        likeCount,
        commentCount,
        userImage,
        handle,
        comments,
      },
      ui: { loading },
    } = this.props;

    const dialogMarkup = loading ? (
      <div className={classes.spinnerDiv}>
        <CircularProgress size={200} thickness={1} />
      </div>
    ) : (
      <Grid container direction="column">
        <Grid container direction="row">
          <Grid item xs={12} sm={3}>
            <img
              src={userImage}
              alt="Profile"
              className={classes.profileImage}
            />
          </Grid>
          <Grid item xs={12} sm={9} className={classes.tweetContent}>
            <Typography
              component={Link}
              color="primary"
              variant="h5"
              to={`/users/${handle}`}
            >
              @{handle}
            </Typography>
            <hr className={classes.invisibleSeparator} />
            <Typography variant="body2" color="textSecondary">
              {dayjs(createdAt).format("h:mm a, MMM DD YYYY")}
            </Typography>
            <hr className={classes.invisibleSeparator} />
            <Typography variant="body1" style={{ wordBreak: "break-word" }}>
              <span>{body}</span>
            </Typography>
            <LikeButton tweetId={tweetId} />
            {likeCount}
            <MyButton disabled>
              <ChatIcon color="primary" />
            </MyButton>
            {commentCount}
          </Grid>
        </Grid>
        <hr className={classes.invisibleSeparator} />
        <CommentForm tweetId={tweetId} />
        <Comments comments={comments} />
      </Grid>
    );

    return (
      <Fragment>
        <MyButton
          onClick={this.handleOpen}
          tip={this.props.tip}
          noTooltip={this.props.noTooltip}
          square={this.props.square}
          btnClassName={this.props.btnClassName}
        >
          {this.props.children}
        </MyButton>
        <ResponsiveDialog
          open={this.state.open}
          onClose={this.handleClose}
          fullWidth
          maxWidth="sm"
        >
          <Grid container alignItems="flex-end" justify="flex-end">
            <Grid item>
              <MyButton
                tip="Close"
                onClick={this.handleClose}
                tipClassName={classes.closeButton}
              >
                <CloseIcon />
              </MyButton>
            </Grid>
          </Grid>
          <DialogContent className={classes.dialogContent}>
            {dialogMarkup}
            <hr className={classes.invisibleSeparator} />
          </DialogContent>
        </ResponsiveDialog>
      </Fragment>
    );
  }
}

TweetDialog.propTypes = {
  clearErrors: PropTypes.func.isRequired,
  getTweet: PropTypes.func.isRequired,
  tweetId: PropTypes.string.isRequired,
  handle: PropTypes.string.isRequired,
  tweet: PropTypes.object.isRequired,
  ui: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  tweet: state.data.tweet,
  ui: state.ui,
});

const mapActionsToProps = {
  getTweet,
  clearErrors,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(TweetDialog));
