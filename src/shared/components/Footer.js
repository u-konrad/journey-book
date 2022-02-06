import React from "react";
import { Container} from "react-bootstrap";

const Footer = () => {
  return (
    <footer className="d-flex align-items-center">
      <Container
        className="px-lg-5 px-sm-3 d-flex justify-content-end "
        fluid="xl"
      >
        <span > &copy;2021 JourneyBook</span>
      </Container>
    </footer>
  );
};

export default Footer;
