import React, { Component } from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "mobx-react";
import Main from "./components/Main";
import "./App.css";
import * as stores from "./stores";

class App extends Component {
  render() {
    return (
      <Provider {...stores}>
        <BrowserRouter>
          <MuiThemeProvider>
            <div className="Main">
              <Main />
            </div>
          </MuiThemeProvider>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
