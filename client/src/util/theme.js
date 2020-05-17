export default {
  palette: {
    primary: {
      light: "#33C9DC",
      main: "#00BCD4",
      dark: "#008394",
      contrastText: "#FFF",
    },
    secondary: {
      light: "#FF6333",
      main: "#FF3D00",
      dark: "#B22A00",
      contrastText: "#FFF",
    },
  },
  spreadThis: {
    typography: {
      useNextVariants: true,
    },
    form: {
      textAlign: "center",
    },
    logoImage: {
      height: 75,
      width: "auto",
      margin: "10px auto 10px auto",
    },
    pageTitle: {
      margin: "10px auto 10px auto",
      fontSize: "2em",
    },
    textField: {
      margin: "10px auto 10px auto",
    },
    button: {
      margin: "20px auto 20px auto",
      position: "relative",
    },
    customError: {
      color: "red",
      fontSize: "0.8rem",
      marginTop: 10,
    },
    progress: {
      position: "absolute",
    },
    invisibleSeparator: {
      border: "none",
      margin: 4,
    },
    visibleSeparator: {
      width: "100%",
      borderBottom: "1px solid rgba(0,0,0,0.1)",
      marginBottom: 20,
    },
    paper: {
      padding: 20,
    },
    profile: {
      "& .image-wrapper": {
        textAlign: "center",
        position: "relative",
        "& button": {
          position: "absolute",
          top: "80%",
          left: "70%",
        },
      },
      "& .profile-image": {
        height: 200,
        width: 200,
        borderRadius: "50%",
        objectFit: "cover",
      },
      "& .profile-details": {
        textAlign: "center",
        "& span, svg": {
          verticalAlign: "middle",
        },
        "& a": {
          color: "#00BCD4",
        },
      },
      "& hr": {
        border: "none",
        margin: "0 0 10px 0",
      },
      "& svg.button": {
        "&:hover": {
          cursor: "pointer",
        },
      },
    },
    buttons: {
      textAlign: "center",
      "& a": {
        margin: "20px 10px",
      },
    },
  },
};
