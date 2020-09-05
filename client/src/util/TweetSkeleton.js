import React, { Fragment } from "react";
import PropTypes from "prop-types";

// Material-UI Stuff
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CircularProgress from "@material-ui/core/CircularProgress";

import withStyles from "@material-ui/core/styles/withStyles";

const styles = (theme) => ({
  ...theme.spreadThis,
  card: {
    display: "flex",
    marginBottom: 20,
  },
  cardContent: {
    width: "100%",
    flexDirection: "column",
    padding: 20,
  },
  cover: {
    height: 60,
    width: 60,
    margin: "30px 0 0 25px",
  },
  handle: {
    width: 60,
    height: 20,
    backgroundColor: theme.palette.primary.main,
    opacity: 0.4,
    marginBottom: 6,
  },
  date: {
    height: 14,
    width: 100,
    backgroundColor: "rgba(0,0,0,0.1)",
    marginBottom: 8,
  },
  fullLine: {
    height: 15,
    width: "90%",
    backgroundColor: "rgba(0,0,0,0.15)",
    marginBottom: 8,
  },
  halfLine: {
    height: 15,
    width: "50%",
    backgroundColor: "rgba(0,0,0,0.15)",
    marginBottom: 8,
  },
});

const TweetSkeleton = (props) => {
  const { classes } = props;

  const content = Array.from({ length: 5 }).map((iem, index) => (
    <Card className={classes.card} key={index}>
      <CardMedia className={classes.cover}>
        <CircularProgress size={60} thickness={1} />
      </CardMedia>
      <CardContent className={classes.cardContent}>
        <div className={classes.handle} />
        <div className={classes.date} />
        <div className={classes.fullLine} />
        <div className={classes.fullLine} />
        <div className={classes.halfLine} />
      </CardContent>
    </Card>
  ));

  return <Fragment>{content}</Fragment>;
};

TweetSkeleton.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TweetSkeleton);
