import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import Tweet from "../components/tweet/Tweet";
import Grid from "@material-ui/core/Grid";
import StaticProfile from "../components/profile/StaticProfile";
import TweetSkeleton from "../util/TweetSkeleton";
import ProfileSkeleton from "../util/ProfileSkeleton";

// Redux stuff
import { connect } from "react-redux";
import { getUserData } from "../redux/actions/dataActions";

class user extends Component {
  state = {
    profile: null,
    tweetIdParam: null,
  };

  getUserData = (handle) => {
    this.props.getUserData(handle);
    axios
      .get(`/user/${handle}`)
      .then((res) => {
        this.setState({ profile: res.data.user, handle });
      })
      .catch((err) => console.log(err));
  };

  componentDidMount() {
    document.body.style.backgroundColor = "rgb(214, 214, 214)";
    const handle = this.props.match.params.handle;
    const tweetId = this.props.match.params.tweetId;
    if (tweetId) {
      this.setState({ tweetIdParam: tweetId });
    }
    this.getUserData(handle);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match !== this.props.match) {
      const tweetId = nextProps.match.params.tweetId;
      if (tweetId) {
        this.setState({ tweetIdParam: tweetId, openDialog: true });
      }

      const currentHandle = this.props.match.params.handle;
      const nextHandle = nextProps.match.params.handle;
      if (currentHandle !== nextHandle) {
        this.setState({ profile: null });
        this.getUserData(nextHandle);
      }
    }
  }

  render() {
    const { tweets, loading } = this.props.data;
    const { tweetIdParam } = this.state;

    let tweetsMarkup = loading ? (
      <TweetSkeleton />
    ) : tweets === null || tweets.length === 0 ? (
      <p>This user has not tweeted yet, check again later!</p>
    ) : !tweetIdParam ? (
      tweets.map((tweet) => (
        <Tweet key={tweet.tweetId} tweet={tweet} userImage={tweet.userImage} />
      ))
    ) : (
      tweets.map((tweet) => {
        if (tweet.tweetId !== tweetIdParam) {
          return (
            <Tweet
              key={tweet.tweetId}
              tweet={tweet}
              userImage={tweet.userImage}
            />
          );
        } else {
          return (
            <Tweet
              key={tweet.tweetId}
              tweet={tweet}
              openDialog
              userImage={tweet.userImage}
            />
          );
        }
      })
    );

    return (
      <Grid container spacing={0}>
        <Grid item xs={12} md={4}>
          {this.state.profile === null ? (
            <ProfileSkeleton />
          ) : (
            <StaticProfile profile={this.state.profile} />
          )}
        </Grid>
        <Grid item xs={12} md={1}>
          <div style={{ width: 20, height: 20 }} />
        </Grid>
        <Grid item xs={12} md={7}>
          {tweetsMarkup}
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
