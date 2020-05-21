import React, { Component, Fragment } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import PropTypes from "prop-types";
import TweetDialog from "../tweet/TweetDialog";

// Material-UI Stuff
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import Badge from "@material-ui/core/Badge";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";

// Icons
import NotificationsIcon from "@material-ui/icons/Notifications";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ChatIcon from "@material-ui/icons/Chat";

// Redux
import { connect } from "react-redux";
import { markNotificationsRead } from "../../redux/actions/userActions";

class Notifications extends Component {
  state = {
    anchorEl: null,
  };

  handleOpen = (e) => {
    this.setState({ anchorEl: e.target });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  onMenuOpened = () => {
    let unreadIds = this.props.notifications
      .filter((not) => !not.read)
      .map((not) => not.notificationId);
    this.props.markNotificationsRead(unreadIds);
  };

  render() {
    const notifications = this.props.notifications;
    const anchorEl = this.state.anchorEl;

    dayjs.extend(relativeTime);

    let notificationsIcon;
    if (notifications && notifications.length > 0) {
      let unread = notifications.filter((not) => not.read === false).length;
      unread > 0
        ? (notificationsIcon = (
            <Badge badgeContent={unread} color="secondary">
              <NotificationsIcon />
            </Badge>
          ))
        : (notificationsIcon = <NotificationsIcon />);
    } else {
      notificationsIcon = <NotificationsIcon />;
    }

    let notificationsMarkup =
      notifications && notifications.length > 0 ? (
        notifications.map((not) => {
          const verb = not.type === "like" ? "liked" : "commented on";
          const time = dayjs(not.createdAt).fromNow();
          const iconColor = not.read ? "primary" : "secondary";
          const icon =
            not.type === "like" ? (
              <FavoriteIcon color={iconColor} style={{ marginRight: 10 }} />
            ) : (
              <ChatIcon color={iconColor} style={{ marginRight: 10 }} />
            );
          return (
            <MenuItem style={{ backgroundColor: "transparent", padding: 0 }}>
              <TweetDialog
                tweetId={not.tweetId}
                handle={not.recipient}
                square
                noTooltip
                style={{ width: "100%", padding: "10px 15px 10px 15px" }}
                handleCloseOuter={this.handleClose}
              >
                <Grid container direction="row">
                  <Grid item xs={1}>
                    <Typography>{icon}</Typography>
                  </Grid>
                  <Grid item xs={11}>
                    <Grid container direction="column">
                      <Grid item>
                        <Typography
                          style={{
                            fontSize: "1em",
                            textAlign: "left",
                            padding: 0,
                            margin: 0,
                            paddingLeft: 15,
                          }}
                          spacing={0}
                        >
                          <strong>{not.sender}</strong>
                          <br />
                          <span style={{ fontSize: "0.75em" }}>
                            {verb} your tweet
                          </span>
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography
                          style={{
                            fontSize: "0.75em",
                            textAlign: "left",
                            paddingLeft: 15,
                          }}
                        >
                          <i>{time}</i>
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </TweetDialog>
            </MenuItem>
          );
        })
      ) : (
        <MenuItem onClick={this.handleClose}>
          You have no new notifications
        </MenuItem>
      );

    return (
      <Fragment>
        <Tooltip placement="top" title="Notifications">
          <IconButton
            aria-owns={anchorEl ? "simple-menu" : undefined}
            aria-haspopup="true"
            onClick={this.handleOpen}
          >
            {notificationsIcon}
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
          onEntered={this.onMenuOpened}
          getContentAnchorEl={null}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          transformOrigin={{ vertical: "top", horizontal: "center" }}
          style={{ maxHeight: 540 }}
        >
          {notificationsMarkup}
        </Menu>
      </Fragment>
    );
  }
}

Notifications.propTypes = {
  markNotificationsRead: PropTypes.func.isRequired,
  notifications: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  notifications: state.user.notifications,
});

export default connect(mapStateToProps, { markNotificationsRead })(
  Notifications
);
