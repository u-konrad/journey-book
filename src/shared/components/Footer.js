import React from "react";
import { Container } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="d-flex align-items-center mt-5">
      <Container
        className="px-lg-5 px-sm-3 w-100 h-100  d-flex flex-column justify-content-between "
        fluid="xl"
      >
        <ul className="d-flex flex-column flex-md-row justify-content-center ps-0 mx-auto text-muted text-center mb-0 lead pt-5 pb-4">
          <li>
            <Link to="/">{t("nav.home")}</Link>
          </li>
          <li>
            <Link to="/search">{t("shared.search")}</Link>
          </li>
          <li>
            <Link to="/login">{t("shared.login")}</Link>
          </li>
          <li>
            <Link to="/register">{t("shared.register")}</Link>
          </li>
        </ul>
        <p className="text-center ">
          <small>&copy;2021 JourneyBook</small>
        </p>
      </Container>
    </footer>
  );
};

export default Footer;
