import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import { ThemeProvider } from "@material-ui/core/styles";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";

// Components
import Navbar from "./components/Navbar";

// Pages
import home from "./pages/home";
import login from "./pages/login";
import signup from "./pages/signup";

const theme = createMuiTheme({
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
  typography: {
    useNextVariants: true,
  },
});

class App extends Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
        <div className="App">
          <Router>
            <Navbar />
            <div className="container">
              <Switch>
                <Route exact path="/" component={home} />
                <Route exact path="/login" component={login} />
                <Route exact path="/signup" component={signup} />
              </Switch>
            </div>
          </Router>
        </div>
      </ThemeProvider>
    );
  }
}

export default App;
