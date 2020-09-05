import React from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";

// Material-UI Stuff
import Paper from "@material-ui/core/Paper";
import CircularProgress from "@material-ui/core/CircularProgress";

// Icons
import LocationOn from "@material-ui/icons/LocationOn";
import LinkIcon from "@material-ui/icons/Link";
import CalendarToday from "@material-ui/icons/CalendarToday";

const styles = (theme) => ({
  ...theme.spreadThis,
  handle: {
    height: 20,
    backgroundColor: theme.palette.primary.main,
    opacity: 0.4,
    width: 60,
    margin: "0 auto 7px auto",
  },
  fullLine: {
    height: 15,
    backgroundColor: "rgba(0,0,0,0.15)",
    width: "100%",
    marginBottom: 10,
  },
  halfLine: {
    height: 15,
    backgroundColor: "rgba(0,0,0,0.15)",
    width: "50%",
    marginBottom: 10,
  },
});

const ProfileSkeleton = (props) => {
  const { classes } = props;
  return (
    <Paper className={classes.paper}>
      <div className={classes.profile}>
        <div className="image-wrapper">
          <CircularProgress size={110} thickness={1} />
        </div>
        <hr
          style={{
            backgroundColor: "rgba(0,0,0,0.1)",
            height: 2,
            width: "100%",
            marginTop: 30,
            marginBottom: 10,
          }}
        />
        <div className="profile-details">
          <div className={classes.handle} />
          <div>
            <LinkIcon color="inherit" />
            {" Website"}
          </div>
          <hr />
          <hr />
          <div className={classes.fullLine} />
          <div className={classes.fullLine} />
          <LocationOn color="inherit" /> <span>Location</span>
          <hr />
          <CalendarToday color="inherit" /> <span>Joined date</span>
          <hr
            style={{
              width: "100%",
              marginTop: 15,
              marginBottom: 2,
            }}
          />
        </div>
      </div>
    </Paper>
  );
};

ProfileSkeleton.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProfileSkeleton);
