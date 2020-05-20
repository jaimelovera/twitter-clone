import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import imageCompression from "browser-image-compression";
import EditDetails from "./EditDetails";
import MyButton from "../../util/MyButton";
import ProfileSkeleton from "../../util/ProfileSkeleton";

// Material-UI Stuff
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import MuiLink from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";

// Redux Stuff.
import { connect } from "react-redux";
import { logoutUser, uploadImage } from "../../redux/actions/userActions";

// Icons
import LocationOn from "@material-ui/icons/LocationOn";
import LinkIcon from "@material-ui/icons/Link";
import CalendarToday from "@material-ui/icons/CalendarToday";
import PhotoCameraIcon from "@material-ui/icons/PhotoCamera";
import KeyboardReturn from "@material-ui/icons/KeyboardReturn";
import NotificationsActiveIcon from "@material-ui/icons/NotificationsActive";

const styles = (theme) => ({
  ...theme.spreadThis,
});

class Profile extends Component {
  // Compress the selected file to a smaller size, then upload to server.
  handleImageChange = (e) => {
    const originalImage = e.target.files[0];
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 500,
    };
    const uploadImage = this.props.uploadImage;
    imageCompression(originalImage, options)
      .then(function (compressedImage) {
        const formData = new FormData();
        formData.append("image", compressedImage, compressedImage.name);
        return uploadImage(formData);
      })
      .catch(function (error) {
        console.log(error.message);
      });
  };

  handleEditPicture = () => {
    const fileInput = document.getElementById("imageInput");
    fileInput.click();
  };

  handleLogout = () => {
    this.props.logoutUser();
  };

  render() {
    const {
      classes,
      user: {
        credentials: { handle, createdAt, imageUrl, bio, website, location },
        loading,
        authenticated,
      },
    } = this.props;

    let profileMarkup = !loading ? (
      authenticated ? (
        <Paper className={classes.paper}>
          <div className={classes.profile}>
            <div className="image-wrapper">
              <img src={imageUrl} alt="profile" className="profile-image" />
              <input
                type="file"
                id="imageInput"
                hidden="hidden"
                onChange={this.handleImageChange}
              />
              <MyButton
                tip="Change Profile Picture"
                onClick={this.handleEditPicture}
                btnClassName="button"
              >
                <PhotoCameraIcon color="inherit" />
              </MyButton>
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
                style={{ textDecoration: "none" }}
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
                backgroundColor: "rgba(0,0,0,0.1)",
                height: 2,
                width: "100%",
                marginTop: 15,
                marginBottom: 2,
              }}
            />
            <MyButton tip="Logout" onClick={this.handleLogout}>
              <KeyboardReturn color="inherit" />
            </MyButton>
            <EditDetails />
          </div>
        </Paper>
      ) : (
        <Paper className={classes.paper} style={{ textAlign: "center" }}>
          <NotificationsActiveIcon style={{ paddingBottom: 10 }} />
          <Typography variant="body2" align="center">
            Log in or sign up to continue
          </Typography>
          <div className={classes.buttons}>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/login"
            >
              Log in
            </Button>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/signup"
            >
              Sign up
            </Button>
          </div>
        </Paper>
      )
    ) : (
      <ProfileSkeleton />
    );

    return profileMarkup;
  }
}

Profile.propTypes = {
  user: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  logoutUser: PropTypes.func.isRequired,
  uploadImage: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
});

const mapActionsToProps = { logoutUser, uploadImage };

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(Profile));
