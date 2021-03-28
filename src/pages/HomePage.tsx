import React from "react";
import { Button as BootstrapButton } from "reactstrap";
import styled from "styled-components";

const Button = styled(BootstrapButton)`
  max-width: 380px;
  @media only screen and (min-width: 576px) {
    width: 100%;
    margin-right: ${(props) => props.isLeft && "16px !important"};
  }
  @media only screen and (min-width: 992px) {
    width: auto%;
    margin-right: ${(props) => props.isLeft && "0 !important"};
  }
`;

function HomePage() {
  return (
    <div
      className="d-flex flex-column align-items-stretch"
      style={{ minHeight: "690px" }}
    >
      <div className="d-flex flex-column flex-lg-row-reverse align-items stretch flex-grow-1 flex-shrink-1">
        <div
          className="d-flex flex-column justify-content-center align-items-stretch p-3 m-auto"
          style={{ minWidth: "45vw", maxWidth: "600px" }}
        >
          <div
            className="d-flex flex-column w-100 align-items-stretch"
            style={{ padding: "20px" }}
          >
            <div className="align-self-start" style={{ paddingBottom: "12px" }}>
              Logo
            </div>
            <h1
              className="display-5 fw-bold text-break"
              style={{ marginBottom: "40px", marginTop: "40px" }}
            >
              Happening now
            </h1>
            <h2 className="h4 fw-bold text-break mb-4">Join Twitter today.</h2>
            <div className="d-flex flex-column flex-sm-row flex-lg-column align-items-stretch">
              <Button
                isLeft={true}
                className="mb-3"
                style={{ maxWidth: "380px" }}
              >
                Sign up
              </Button>
              <Button className="mb-3" style={{ maxWidth: "380px" }}>
                Log in
              </Button>
            </div>
          </div>
        </div>
        <div
          className="d-flex flex-grow-1 flex-shrink-1 bg-primary"
          style={{ minHeight: "45vh" }}
        ></div>
      </div>
      <nav
        className="d-flex flex-wrap align-items-stretch justify-content-center flex-shrink-0"
        style={{ padding: "12px 16px" }}
      >
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <a
            key={n}
            href="#1"
            className="my-1 text-break"
            style={{ paddingLeft: "16px" }}
          >
            <small>link{n}</small>
          </a>
        ))}
      </nav>
    </div>
  );
}

export default HomePage;
