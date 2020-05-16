import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import Tweet from "../components/tweet/Tweet";
import Grid from "@material-ui/core/Grid";
import StaticProfile from "../components/profile/StaticProfile";

// Redux stuff
import { connect } from "react-redux";
import { getUserData } from "../redux/actions/dataActions";

class user extends Component {
  state = {
    profile: null,
  };
  componentDidMount() {
    const handle = this.props.match.params.handle;
    this.props.getUserData(handle);
    axios
      .get(`/user/${handle}`)
      .then((res) => {
        this.setState({ profile: res.data.user });
      })
      .catch((err) => console.log(err));
  }
  render() {
    const { tweets, loading } = this.props.data;

    let tweetsMarkup = loading ? (
      <p>Loading data...</p>
    ) : tweets === null ? (
      <p>No tweets from this user</p>
    ) : (
      tweets.map((tweet) => <Tweet key={tweet.tweetId} tweet={tweet} />)
    );

    return (
      <Grid container spacing={10}>
        <Grid item sm={8} xs={12}>
          {tweetsMarkup}
        </Grid>
        <Grid item sm={4} xs={12}>
          {this.state.profile === null ? (
            <p>Loading profile...</p>
          ) : (
            <StaticProfile profile={this.state.profile} />
          )}
        </Grid>
      </Grid>
    );
  }
}

user.propTypes = {
  getUserData: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  data: state.data,
});

export default connect(mapStateToProps, { getUserData })(user);
