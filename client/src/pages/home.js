import React, { Component } from "react";
import axios from "axios";
import Grid from "@material-ui/core/Grid";

import Tweet from "../components/Tweet";
import Profile from "../components/Profile";

class home extends Component {
  state = {
    tweets: null,
  };
  componentDidMount() {
    axios
      .get("./tweets")
      .then((res) => {
        this.setState({
          tweets: res.data,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    let recentTweetsMarkup = this.state.tweets ? (
      this.state.tweets.map((tweet) => (
        <Tweet key={tweet.tweetId} tweet={tweet} />
      ))
    ) : (
      <p>Loading...</p>
    );

    return (
      <Grid container spacing={10}>
        <Grid item sm={8} xs={12}>
          {recentTweetsMarkup}
        </Grid>
        <Grid item sm={4} xs={12}>
          <Profile />
        </Grid>
      </Grid>
    );
  }
}

export default home;
