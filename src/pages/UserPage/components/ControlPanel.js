import { NavLink, useHistory } from "react-router-dom";
import ButtonTooltip from "../../../shared/components/ButtonTooltip";
import FavButton from "../../../shared/components/FavButton";
import { Row, Col, Dropdown, Button } from "react-bootstrap";
import SmallUserPanel from "./SmallUserPanel";
import { useTranslation } from "react-i18next";

const ControlPanel = ({
  setShowModal,
  userData,
  url,
  searchQuery,
  setSearchQuery,
  token,
  isAuthor,
  userIsFavorite,
  removeFavHandler,
  addFavHandler,
}) => {
  const history = useHistory();

  const { t } = useTranslation();

  return (
    <div
      id="control"
      className="user-page__control-panel card shadow p-3 px-sm-5 rounded  h-25 my-5 position-relative "
    >
      {isAuthor && (
        <ButtonTooltip
          onClick={() => setShowModal(true)}
          tooltip={t("user.edit-blog")}
          className="position-absolute user-page__edit-btn"
          style={{ top: "15px", right: "15px" }}
          variant="outline-success"
          size="sm"
        >
          <i className="bi bi-pencil-square"></i>
        </ButtonTooltip>
      )}
      <Row>
        <Col lg={6} className="pt-2">
          <span className="lead mt-3">{userData.blogDesc}</span>

          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-control mt-4"
            type="search"
            placeholder={t("shared.search")}
            aria-label="Search"
          ></input>

          <SmallUserPanel {...{ userData, isAuthor }} />

          <div className="mt-4 d-flex justify-content-between align-items-center flex-wrap">
            <div className="mb-2 ">
              <NavLink className="user-page__btn-tab" to={url} exact>
                {t("user.latest")}
              </NavLink>
              <NavLink className="user-page__btn-tab" to={`${url}/posts`}>
                {t("user.posts")}
              </NavLink>
              <NavLink className="user-page__btn-tab" to={`${url}/journeys`}>
                {t("user.journeys")}
              </NavLink>
              <NavLink className="user-page__btn-tab" to={`${url}/experiences`}>
                {t("user.exps")}
              </NavLink>
            </div>
            {isAuthor && (
              <Dropdown className="d-inline d-lg-none ">
                <Dropdown.Toggle
                  className="user-page__fav-btn"
                  variant="dark"
                  size="sm"
                  id="dropdown-basic"
                >
                  {t("user.favs")}
                </Dropdown.Toggle>

                <Dropdown.Menu style={{ padding: 0 }}>
                  <Button
                    variant="light"
                    size="sm"
                    className="user-page__dropdown-btn"
                    onClick={() => history.push(`${url}/favorites`)}
                  >
                    {t("user.latest")}
                  </Button>
                  <Button
                    variant="light"
                    size="sm"
                    className="user-page__dropdown-btn"
                    onClick={() => history.push(`${url}/favorites/users`)}
                  >
                    {t("user.users")}
                  </Button>
                  <Button
                    variant="light"
                    size="sm"
                    className="user-page__dropdown-btn"
                    onClick={() => history.push(`${url}/favorites/journeys`)}
                  >
                    {t("user.journeys")}
                  </Button>
                  <Button
                    variant="light"
                    size="sm"
                    className="user-page__dropdown-btn"
                    onClick={() => history.push(`${url}/favorites/posts`)}
                  >
                    {t("user.posts")}
                  </Button>
                  <Button
                    variant="light"
                    size="sm"
                    className="user-page__dropdown-btn"
                    onClick={() => history.push(`${url}/favorites/experiences`)}
                  >
                    {t("user.exps")}
                  </Button>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </div>
        </Col>

        <Col
          lg={6}
          className="d-lg-flex d-none flex-column align-items-end justify-content-end"
        >
          {isAuthor && (
            <p className="m-0 align-self-end display-6 text-muted">
                  {t("user.favs")}
            </p>
          )}
          {isAuthor && (
            <div className="mt-4">
              <NavLink
                className="user-page__btn-tab me-4"
                to={`${url}/favorites`}
                exact
              >
                    {t("user.latest")}
              </NavLink>
              <NavLink
                className="user-page__btn-tab me-4"
                to={`${url}/favorites/users`}
              >
                    {t("user.users")}
              </NavLink>
              <NavLink
                className="user-page__btn-tab me-4"
                to={`${url}/favorites/posts`}
              >
                    {t("user.posts")}
              </NavLink>
              <NavLink
                className="user-page__btn-tab me-4"
                to={`${url}/favorites/journeys`}
              >
                    {t("user.journeys")}
              </NavLink>
              <NavLink
                className="user-page__btn-tab me-0"
                to={`${url}/favorites/experiences`}
              >
                    {t("user.exps")}
              </NavLink>
            </div>
          )}
          {!!token && !isAuthor && (
            <div
              className="position-absolute"
              style={{ bottom: "1rem", right: "2rem" }}
            >
              <FavButton
                isFavorite={userIsFavorite}
                removeFavHandler={removeFavHandler}
                addFavHandler={addFavHandler}
                style={{ fontSize: "30px" }}
              />
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default ControlPanel;
