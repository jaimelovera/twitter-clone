import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import MyButton from "../../util/MyButton";

// Redux stuff
import { connect } from "react-redux";
import {
  editUserDetails,
  deleteAccount,
} from "../../redux/actions/userActions";

// Material-ui stuff
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

// Icons
import EditIcon from "@material-ui/icons/Edit";

const styles = (theme) => ({
  ...theme.spreadThis,
  button: {
    float: "right",
  },
});

class EditDetails extends Component {
  state = {
    bio: "",
    website: "",
    location: "",
    open: false,
    openDeleteVerify: false,
  };

  mapUserDetailsToState = (credentials) => {
    this.setState({
      bio: credentials.bio ? credentials.bio : "",
      website: credentials.website ? credentials.website : "",
      location: credentials.location ? credentials.location : "",
    });
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleOpen = () => {
    this.setState({ open: true });
    this.mapUserDetailsToState(this.props.credentials);
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleDeleteAccountVerifyOpen = () => {
    this.setState({ openDeleteVerify: true });
  };

  handleDeleteAccountVerifyClose = () => {
    this.setState({ openDeleteVerify: false });
  };

  handleDeleteAccount = () => {
    this.props.deleteAccount(
      this.props.credentials.userId,
      this.props.credentials.handle
    );
  };

  handleSubmit = () => {
    const userDetails = {
      bio: this.state.bio,
      website: this.state.website,
      location: this.state.location,
    };
    this.props.editUserDetails(userDetails);
    this.handleClose();
  };

  componentDidMount() {
    this.mapUserDetailsToState(this.props.credentials);
  }

  render() {
    const { classes } = this.props;
    return (
      <Fragment>
        <MyButton
          tip="Edit Details"
          onClick={this.handleOpen}
          btnClassName={classes.button}
        >
          <EditIcon color="inherit" />
        </MyButton>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Edit your details</DialogTitle>
          <DialogContent>
            <form>
              <TextField
                name="bio"
                type="text"
                label="Bio"
                multiline
                rows="3"
                placeholder="A short bio about yourself"
                className={classes.textField}
                value={this.state.bio}
                onChange={this.handleChange}
                fullWidth
              />
              <TextField
                name="website"
                type="text"
                label="Website"
                placeholder="Your personal website."
                className={classes.textField}
                value={this.state.website}
                onChange={this.handleChange}
                fullWidth
              />
              <TextField
                name="location"
                type="text"
                label="Location"
                placeholder="Your location where you live"
                className={classes.textField}
                value={this.state.location}
                onChange={this.handleChange}
                fullWidth
              />
            </form>
          </DialogContent>
          <DialogActions>
            <Button
              variant="outlined"
              color="secondary"
              onClick={this.handleDeleteAccountVerifyOpen}
            >
              Delete Account
            </Button>
            <Dialog
              open={this.state.openDeleteVerify}
              onClose={this.handleDeleteAccountVerifyClose}
              aria-labelledby="verify-delete-account"
              aria-describedby="verify-user-wants-to-delete-account"
            >
              <DialogTitle id="verify-delete-account" style={{ color: "red" }}>
                {"Delete your account?"}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="verify-user-wants-to-delete-account">
                  This is permanent and can not be reversed.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={this.handleDeleteAccountVerifyClose}
                  color="primary"
                >
                  No
                </Button>
                <Button onClick={this.handleDeleteAccount} color="primary">
                  Yes
                </Button>
              </DialogActions>
            </Dialog>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleSubmit} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Fragment>
    );
  }
}

EditDetails.propTypes = {
  editUserDetails: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  credentials: state.user.credentials,
});

export default connect(mapStateToProps, { editUserDetails, deleteAccount })(
  withStyles(styles)(EditDetails)
);
