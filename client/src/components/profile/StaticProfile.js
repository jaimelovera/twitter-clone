import React, { Fragment } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import dayjs from "dayjs";
import { Link } from "react-router-dom";

// Material-UI Stuff
import MuiLink from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

// Icons
import LocationOn from "@material-ui/icons/LocationOn";
import LinkIcon from "@material-ui/icons/Link";
import CalendarToday from "@material-ui/icons/CalendarToday";

const styles = (theme) => ({
  ...theme.spreadThis,
});

const StaticProfile = (props) => {
  const {
    classes,
    profile: { handle, createdAt, imageUrl, bio, website, location },
  } = props;

  return (
    <Paper className={classes.paper}>
      <div className={classes.profile}>
        <div className="image-wrapper">
          <img src={imageUrl} alt="profile" className="profile-image" />
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
          <MuiLink
            component={Link}
            to={`/users/${handle}`}
            color="primary"
            variant="h5"
          >
            @{handle}
          </MuiLink>
          <hr />
          {website && (
            <Fragment>
              <a href={website} target="_blank" rel="noopener noreferrer">
                <LinkIcon color="primary" />
                {" Website"}
              </a>
              <hr />
            </Fragment>
          )}
          <hr />
          {bio && (
            <Typography variant="body2" style={{ wordBreak: "break-word" }}>
              {bio}
            </Typography>
          )}
          <hr />
          {location && (
            <Fragment>
              <LocationOn color="inherit" />{" "}
              <span style={{ wordBreak: "break-word" }}>{location}</span>
              <hr />
            </Fragment>
          )}
          <CalendarToday color="inherit" />{" "}
          <span>Joined {dayjs(createdAt).format("MMM YYYY")}</span>
        </div>
        <hr
          style={{
            width: "100%",
            marginTop: 15,
            marginBottom: 2,
          }}
        />
      </div>
    </Paper>
  );
};

StaticProfile.propTypes = {
  profile: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(StaticProfile);
