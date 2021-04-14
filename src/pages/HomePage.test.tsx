import React from "react";
import HomePage from "./HomePage";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

test("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(
    <Router>
      <HomePage />
    </Router>,
    div
  );
});

test("shows welcome message", () => {
  render(
    <Router>
      <HomePage />
    </Router>
  );

  expect(screen.getByText("Join Twitter today.")).toBeInTheDocument();
});
