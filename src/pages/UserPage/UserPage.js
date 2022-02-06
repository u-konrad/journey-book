import { Fragment, useReducer, useEffect, useContext, useState } from "react";
import { useParams } from "react-router";
import "./UserPage.css";
import { Switch, useRouteMatch, Route } from "react-router-dom";
import useHttp from "../../shared/hooks/http-hook";
import CardList from "./components/CardList";
import { AuthContext } from "../../shared/context/auth-context";
import { useSelector } from "react-redux";
import EditPageModal from "./components/EditPageModal";
import { Row, Col } from "react-bootstrap";
import transformImgUrl from "../../shared/utils/transformImgUrl";
import ControlPanel from "./components/ControlPanel";
import UserPanel from "./components/UserPanel";
import { Fab } from "@mui/material";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { BsArrowUp } from "react-icons/bs";
import { useTranslation } from "react-i18next";

const initialState = {
  blogTitle: "",
  blogDesc: "",
  username: "",
  image: null,
  profileImage: null,
  postNum: 0,
  expNum: 0,
  journeyNum: 0,
};

function reducer(state, action) {
  switch (action.type) {
    case "loadedUser":
      return { ...action.payload };
    case "updatedUser":
      return { ...state, ...action.payload };
    default:
      return { ...initialState };
  }
}

const UserPage = () => {
  const [userData, dispatch] = useReducer(reducer, initialState);
  const { path, url } = useRouteMatch();
  const { fetchData, addFav, removeFav } = useHttp();
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { t } = useTranslation();

  const params = useParams();
  const { userId } = params;
  const { userId: loggedInUserId, token } = useContext(AuthContext);
  const isAuthor = userId === loggedInUserId;

  const favUsers = useSelector((state) => state.fav.favUsers);
  const userIsFavorite = !isAuthor && favUsers.includes(userId);

  const addFavHandler = () => {
    addFav({ token, itemId: userId, type: "user" });
  };

  const removeFavHandler = () => {
    removeFav({ token, itemId: userId, type: "user" });
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetchData(`users/${userId}/data`);

        dispatch({
          type: "loadedUser",
          payload: {
            ...response.user,
          },
        });
      } catch (err) {}
    };
    fetchUserData();
  }, [userId, fetchData]);

  const controlPanelProps = {
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
  };

  return (
    <Fragment>
      <EditPageModal
        show={showModal}
        blogTitle={userData.blogTitle}
        blogDesc={userData.blogDesc}
        image={userData.image}
        onClose={() => {
          setShowModal(false);
        }}
        onSubmit={(updated) => {
          setShowModal(false);
          if (updated) {
            dispatch({
              type: "updatedUser",
              payload: { ...updated },
            });
          }
        }}
      />

      <div
        className="user-page__hero"
        style={{
          backgroundImage: `url(${
            transformImgUrl(userData.image?.path, "1920") ||
            "https://images.unsplash.com/photo-1476820865390-c52aeebb9891?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyODAyNjV8MHwxfHNlYXJjaHw4fHxqb3VybmV5fGVufDB8fHx8MTY0Mzk4OTE2NA&ixlib=rb-1.2.1&q=80&w=1920&h=600"
          }`,
        }}
      ></div>

      <div>
        <div className=" position-relative" style={{ height: "60vh" }}>
          <h1 className="user-page__title shadow card p-3 px-4 rounded position-absolute">
            {userData.blogTitle}
          </h1>
        </div>
        <ControlPanel {...controlPanelProps} />
      </div>

      <Row className="mb-5">
        <UserPanel {...{ userData, isAuthor }} />

        <Col lg={7}>
          <Switch>
            <Route path={path} exact>
              <CardList
                api={`users/${userId}/latest`}
                searchQuery={searchQuery}
              />
            </Route>
            <Route path={`${path}/posts`}>
              <CardList
                api={`users/${userId}/items?type=post`}
                searchQuery={searchQuery}
              />
            </Route>
            <Route path={`${path}/journeys`}>
              <CardList
                api={`users/${userId}/items?type=journey`}
                searchQuery={searchQuery}
              />
            </Route>
            <Route path={`${path}/experiences`}>
              <CardList
                api={`users/${userId}/items?type=exp`}
                searchQuery={searchQuery}
              />
            </Route>
            {isAuthor && (
              <Switch>
                <Route path={`${path}/favorites`} exact>
                  <CardList
                    api={`users/${userId}/latest/favorites`}
                    searchQuery={searchQuery}
                    favList
                  />
                </Route>
                <Route path={`${path}/favorites/users`}>
                  <CardList
                    api={`users/${userId}/items?type=user&fav=1`}
                    searchQuery={searchQuery}
                    favList
                  />
                </Route>
                <Route path={`${path}/favorites/posts`}>
                  <CardList
                    api={`users/${userId}/items?type=post&fav=1`}
                    searchQuery={searchQuery}
                    favList
                  />
                </Route>
                <Route path={`${path}/favorites/journeys`}>
                  <CardList
                    api={`users/${userId}/items?type=journey&fav=1`}
                    searchQuery={searchQuery}
                    favList
                  />
                </Route>
                <Route path={`${path}/favorites/experiences`}>
                  <CardList
                    api={`users/${userId}/items?type=exp&fav=1`}
                    searchQuery={searchQuery}
                    favList
                  />
                </Route>
              </Switch>
            )}
          </Switch>
        </Col>
      </Row>
      <OverlayTrigger
        placement="bottom"
        delay={{ show: 200, hide: 200 }}
        overlay={<Tooltip id="button-tooltip">{t("user.fab-tooltip")}</Tooltip>}
      >
        <Fab
          className="position-fixed"
          style={{ bottom: "10%", right: "5%" }}
          aria-label="navigate"
          href="#control"
        >
          <BsArrowUp style={{ fontSize: "24px" }} />
        </Fab>
      </OverlayTrigger>
    </Fragment>
  );
};

export default UserPage;
