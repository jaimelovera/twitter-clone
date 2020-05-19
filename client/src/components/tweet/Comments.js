import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import DeleteComment from "./DeleteComment";

//Material-UI stuff
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

// Redux
import { connect } from "react-redux";

const styles = (theme) => ({
  ...theme.spreadThis,
  commentImage: {
    height: 60,
    width: 60,
    borderRadius: "50%",
    objectFit: "cover",
    margin: "8px 8px 0 8px",
  },
  commentData: {},
});

class Comments extends Component {
  render() {
    const {
      comments,
      classes,
      user: {
        authenticated,
        credentials: { handle: userHandle },
      },
    } = this.props;

    return (
      <Grid container>
        {comments.map((comment, index) => {
          const { body, createdAt, userImage, handle } = comment;
          return (
            <Fragment key={createdAt}>
              {index === 0 && <hr className={classes.visibleSeparator} />}
              <Grid item xs={12}>
                <Grid container>
                  <Grid item xs={4} sm={2}>
                    <img
                      src={userImage}
                      alt="comment"
                      className={classes.commentImage}
                    />
                  </Grid>
                  <Grid item xs={8} sm={10}>
                    <div className={classes.commentData}>
                      <Typography
                        variant="h5"
                        component={Link}
                        to={`/users/${handle}`}
                        color="primary"
                      >
                        {handle}
                      </Typography>

                      {authenticated && handle === userHandle ? (
                        <DeleteComment commentId={comment.commentId} />
                      ) : null}

                      <Typography variant="body2" color="textSecondary">
                        {dayjs(createdAt).format("h:mm a, MMMM DD YYYY")}
                      </Typography>
                      <hr className={classes.invisibleSeparator} />
                      <Typography
                        variant="body1"
                        style={{ wordBreak: "break-word" }}
                      >
                        {body}
                      </Typography>
                    </div>
                  </Grid>
                </Grid>
              </Grid>
              {index !== comments.length - 1 && (
                <hr className={classes.visibleSeparator} />
              )}
            </Fragment>
          );
        })}
      </Grid>
    );
  }
}

Comments.propTypes = {
  user: PropTypes.object.isRequired,
  comments: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps)(withStyles(styles)(Comments));
