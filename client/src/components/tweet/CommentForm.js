import React, { Component } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";

// Material-UI Stuff
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";

import { connect } from "react-redux";
import { submitComment } from "../../redux/actions/dataActions";
import { SET_ERRORS } from "../../redux/types";

const styles = (theme) => ({
  ...theme.spreadThis,
});

class CommentForm extends Component {
  state = {
    body: "",
    errors: {},
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.ui.errors) {
      this.setState({ errors: nextProps.ui.errors });
    }
    if (!nextProps.ui.errors && !nextProps.ui.loading) {
      this.setState({ body: "" });
    }
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.submitComment(this.props.tweetId, { body: this.state.body });
  };

  render() {
    const { classes, authenticated } = this.props;
    const errors = this.state.errors;
    const commentFormMarkup = authenticated ? (
      <Grid item sm={12} style={{ textAlign: "center" }}>
        <form onSubmit={this.handleSubmit}>
          <TextField
            name="body"
            type="text"
            label="Comment on tweet"
            error={errors.comment ? true : false}
            helperText={errors.comment}
            value={this.state.body}
            onChange={this.handleChange}
            fullWidth
            className={classes.textField}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className={classes.button}
          >
            Submit
          </Button>
        </form>
        <hr className={classes.visibleSeparator} />
      </Grid>
    ) : null;
    return commentFormMarkup;
  }
}

CommentForm.propTypes = {
  submitComment: PropTypes.func.isRequired,
  ui: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  tweetId: PropTypes.object.isRequired,
  authenticated: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  ui: state.ui,
  authenticated: state.user.authenticated,
});

export default connect(mapStateToProps, { submitComment })(
  withStyles(styles)(CommentForm)
);
