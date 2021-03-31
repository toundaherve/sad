import React from "react";
import logo from "./logo.svg";
import "./App.css";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom"
import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/" exact>
            <HomePage />
          </Route>
          <Route path="/signup">
            <SignupPage />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
