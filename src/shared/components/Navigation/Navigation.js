import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import { Offcanvas, Form, Button, Dropdown } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { useContext, Fragment, useRef, useState } from "react";
import { AuthContext } from "../../context/auth-context";
import { useSelector } from "react-redux";
import "./Navigation.css";
import { useTranslation } from "react-i18next";
import LanguageButton from "./LanguageButton";

const Navigation = () => {
  const { isLoggedIn, logout, userId } = useContext(AuthContext);
  const userImg = useSelector((state) => state.user.userImg);
  const userName = useSelector((state) => state.user.userName);
  const history = useHistory();
  const searchRef = useRef();

  const { t } = useTranslation();

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <Navbar collapseOnSelect style={{ zIndex: "99" }} expand={false}>
      <Container fluid="xl" className="px-lg-5 px-sm-3">
        <Navbar.Brand
          style={{ margin: 0, cursor: "pointer" }}
          onClick={() => history.push("/")}
          className="d-flex align-items-center"
        >
          <img
            style={{ width: "35px", height: "35px", marginRight: "0.1rem" }}
            src={`${process.env.REACT_APP_BACKEND_URL}/travel.svg`}
            alt="compass logo"
          />
          <span className="ms-2 my-0 logo lead">
            Journey<strong>Book</strong>
          </span>
        </Navbar.Brand>
        <div className="d-flex align-items-center">
          {userName && (
            <span className="greeting me-3">
              {t("nav.welcome", { userName: userName })}
            </span>
          )}
          <div className="d-flex justify-content-between ">
            {!isLoggedIn && (
              <div className="d-flex justify-content-between">
                <Button
                  className="login-buttons"
                  variant="outline-dark me-2"
                  onClick={() => history.push("/register")}
                >
                  {t("shared.register")}
                </Button>
                <Button
                  variant="dark "
                  className="login-buttons"
                  onClick={() => history.push("/login")}
                >
                  {t("shared.login")}
                </Button>
              </div>
            )}
            {isLoggedIn && (
              <Button
                variant="dark"
                className="login-buttons"
                onClick={logout}
              >
                {t("nav.logout")}
              </Button>
            )}
          </div>
          <LanguageButton/>

          <Navbar.Toggle
            style={{ border: "none", padding: 0 }}
            aria-controls="offcanvasNavbar"
            onClick={handleShow}
          >
            <i className="bi bi-list toggle-icon"></i>
          </Navbar.Toggle>
        </div>

        <Navbar.Offcanvas
          id="offcanvasNavbar"
          aria-labelledby="offcanvasNavbarLabel"
          placement="start"
          show={show}
          onEntered={() => {
            const offcanvas = document.querySelector(".offcanvas-backdrop");
            if (offcanvas) {
              offcanvas.addEventListener("click", handleClose);
            }
          }}
          onExiting={() => {
            const offcanvas = document.querySelector(".offcanvas-backdrop");
            if (offcanvas) {
              offcanvas.removeEventListener("click", handleClose);
            }
          }}
        >
          <Offcanvas.Header onClick={handleClose} closeButton>
            <Offcanvas.Title id="offcanvasNavbarLabel"></Offcanvas.Title>
          </Offcanvas.Header>

          <div
            className="d-flex mx-auto align-items-center"
            style={{
              borderRadius: "50%",
              width: "150px",
              height: "150px",
              overflow: "hidden",
              position: "relative",
              marginTop: "1rem",
            }}
          >
            {!!userImg?.path ? (
              <img
                src={userImg.path}
                style={{ width: "100%" }}
                alt="user head shot"
              />
            ) : (
              <i
                style={{ fontSize: "120px" }}
                className="bi bi-person-circle mx-auto"
              ></i>
            )}
          </div>

          {!!userName && (
            <p className="text-center display-6 my-4">{userName}</p>
          )}

          <Offcanvas.Body>
            <Nav className="lead offcanvas-nav">
              {isLoggedIn ? (
                <Fragment>
                  <Link
                    className="nav-link"
                    onClick={handleClose}
                    to={`/users/${userId}`}
                  >
                    <i className="bi bi-person-circle me-2"></i>                   {t('nav.userPage')}

                  </Link>
                  <Link
                    className="nav-link"
                    onClick={handleClose}
                    to="/profile"
                  >
                    <i className="bi bi-pencil-square me-2"></i>{t('nav.editProfile')}
                  </Link>

                  <Dropdown
                    className="nav-dropdown"
                    title="Add New"
                    id="offcanvasNavbarDropdown"
                  >
                    <Dropdown.Toggle
                      style={{
                        backgroundColor: "transparent",
                        border: "none",
                        color: "black",
                        paddingLeft: 0,
                      }}
                      variant="success"
                      id="dropdown-basic"
                    >
                      <span className="lead">
                        <i className="bi bi-plus-lg me-2"></i> {t('nav.addNew')}
                      </span>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Link
                        className="nav-link"
                        onClick={handleClose}
                        to="/posts/new"
                      >
                        {t('shared.newPost')}
                      </Link>
                      <Link
                        className="nav-link"
                        onClick={handleClose}
                        to="/journeys/new"
                      >
                        {t('shared.newJourney')}
                      </Link>
                      <Link
                        className="nav-link"
                        onClick={handleClose}
                        to="/exps/new"
                      >
                        {t('shared.newExp')}
                      </Link>
                    </Dropdown.Menu>
                  </Dropdown>
                  <br></br>
                  <Button variant="dark" onClick={logout}>
                  {t('nav.logout')}
                  </Button>
                </Fragment>
              ) : (
                <Fragment>
                  <Button
                    variant="outline-dark"
                    onClick={() => {
                      handleClose();
                      history.push("/register");
                    }}
                    className="mb-2"
                  >
                    {t('shared.register')}
                  </Button>
                  <Button
                    variant="dark"
                    onClick={() => {
                      handleClose();
                      history.push("/login");
                    }}
                  >
                    {t('shared.login')}
                  </Button>
                </Fragment>
              )}
              <br></br>
              <Link className="nav-link mb-3" onClick={handleClose} to="/">
                <i className="bi bi-house-door-fill me-3 "></i> {t('nav.home')}
              </Link>
              <Form
                className="input-group"
                onSubmit={(event) => {
                  event.preventDefault();
                  history.push(
                    `/search?query=${searchRef.current.value}&type=journey`
                  );
                }}
              >
                <input
                  className="form-control"
                  ref={searchRef}
                  type="search"
                  placeholder={`${t('shared.search')}...`}
                  aria-label="Search"
                  onClick={(e) => e.stopPropagation()}
                />
                <Button
                  type="submit"
                  onClick={handleClose}
                  variant="outline-dark"
                >
                  {" "}
                  <i className="bi bi-search"></i>
                </Button>
              </Form>
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
};

export default Navigation;
