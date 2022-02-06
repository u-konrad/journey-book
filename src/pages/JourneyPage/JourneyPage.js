import { Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Fragment, useEffect, useState, useContext, useRef } from "react";
import useHttp from "../../shared/hooks/http-hook";
import LoadingSpinner from "../../shared/components/LoadingSpinner/LoadingSpinner";
import { useHistory, useParams } from "react-router";
import { Button, Dropdown } from "react-bootstrap";
import Map from "../../map/Map";
import "./JourneyPage.css";
import ActionButtons from "../../shared/components/ActionButtons";
import { AuthContext } from "../../shared/context/auth-context";
import { useSelector, useDispatch } from "react-redux";
import CustomModal from "../../shared/components/CustomModal";
import { setAlertWithTimeout } from "../../store/alert-actions";
import formatDate from "../../shared/utils/formatDate";
import truncateText from "../../shared/utils/truncateText";
import { Fab } from "@mui/material";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { BsArrowUp } from "react-icons/bs";

import useMediaQuery from "@mui/material/useMediaQuery";
import JourneyPageItem from "./JourneyPageItem";
import { useTranslation } from "react-i18next";



const JourneyPage = () => {
  const { journeyId } = useParams();
  const history = useHistory();
  const { userId, token } = useContext(AuthContext);
  const dispatch = useDispatch();
  const [itemsList, setItemsList] = useState([]);
  const { t } = useTranslation();

  const defaultModalText = {
    title: t("modal.deleteItemTitle"),
    text: t("modal.deleteItemText"),
  };

  const [journey, setJourney] = useState(null);
  const { fetchData, addFav, removeFav } = useHttp();
  const [showModal, setShowModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [modalText, setModalText] = useState(defaultModalText);

  const favJourneys = useSelector((state) => state.fav.favJourneys) ?? [];
  const map = useRef();

  let isAuthor;
  let journeyIsFavorite;
  if (journey) {
    isAuthor = userId === journey.author;
    journeyIsFavorite = favJourneys.includes(journey._id);
  }

  let markers;
  if (journey) {
    if (itemsList.length) {
      markers = itemsList
        .filter((item) => !!item?.coordinates?.length)
        .map((item) => {
          return {
            _id: item._id,
            location: item.location,
            coordinates: item.coordinates,
          };
        });
    } else if (journey.location && journey.coordinates) {
      markers = [
        { location: journey.location, coordinates: journey.coordinates },
      ];
    } else {
      markers = [{ location: "Unknown", coordinates: [0, 0] }];
    }
  }

  const addFavHandler = (item) => {
    addFav({ token, itemId: item._id, type: item.itemType });
  };

  const removeFavHandler = (item) => {
    removeFav({ token, itemId: item._id, type: item.itemType });
  };

  const deleteHandler = (item) => {
    setItemToDelete(item);
    if (item.itemType === "journey") {
      setModalText({
        title: t("modal.deleteJourneyTitle"),
        text: t("modal.deleteJourneyText"),
      });
    } else {
      setModalText(defaultModalText);
    }
    setShowModal(true);
  };

  const deleteItem = async (item) => {
    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL +
          `items/${item._id}?type=${item.itemType}`,
        {
          method: "DELETE",
          headers: { Authorization: "Bearer " + token },
        }
      );
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error);
      }

      dispatch(
        setAlertWithTimeout({
          alertType: "success",
          alertText: t("shared.deleteMsg"),
        })
      );
      if (item.itemType !== "journey") {
        setItemsList((prev) =>
          prev.filter((listItem) => listItem._id !== item._id)
        );
      } else {
        history.push("/");
      }
    } catch (err) {
      dispatch(
        setAlertWithTimeout({
          alertType: "danger",
          alertText: err.message,
        })
      );
    }
  };

  const locationClickHandler = (item) => {
    document.getElementById("map").scrollIntoView();
    map.current.jumpTo({ center: item.coordinates, zoom: 10 });
  };

  const itemsToRender = itemsList
    .sort((a, b) => a.posted - b.posted)
    .map((item, index) => {
      return (
        <JourneyPageItem
          key={index}
          isLoggedIn={!!token}
          item={item}
          isAuthor={isAuthor}
          addFavHandler={addFavHandler}
          removeFavHandler={removeFavHandler}
          deleteHandler={deleteHandler}
          locationClickHandler={locationClickHandler}
        />
      );
    });

  useEffect(() => {
    const fetchJourney = async () => {
      try {
        const response = await fetchData(`items/${journeyId}?type=journey`);
        const journey = response.item;

        setItemsList([...journey.posts, ...journey.exps]);
        setJourney(journey);
      } catch (err) {}
    };
    fetchJourney();
  }, [fetchData, journeyId]);

  const deleteItemModalProps = {
    type: "confirm",
    acceptBtnLabel: "Delete",
    acceptBtnType: "danger",
    cancelBtnType: "success",
    onAccept: () => {
      setShowModal(false);
      deleteItem(itemToDelete);
    },
    onCancel: () => {
      setShowModal(false);
      setItemToDelete(null);
    },
  };

  const isBigScreen = useMediaQuery("(min-width:1200px)");
  const titleClasses = isBigScreen
    ? "shadow card p-3 px-4 rounded d-inline"
    : "pt-4 ";

  return (
    <Fragment>
      {!journey ? (
        <LoadingSpinner />
      ) : (
        <Fragment>
          <div className="w-100 mt-5 mb-3 d-flex flex-column justify-content-end position-relative">
            <div
              style={{
                maxHeight: "60vh",
                overflow: "hidden",
                minHeight: "100px",
              }}
              className="ms-auto d-flex justify-content-center align-items-center"
            >
              <img
                style={{ width: "100%", maxWidth: "992px" }}
                className="shadow"
                src={journey.image.path}
                alt=""
              />
            </div>
            <div className="position-relative">
              <h1 className={`journey-page__title ${titleClasses}`}>
                {journey.title}
              </h1>
            </div>
          </div>

          <div className="position-relative">
            <Dropdown className="position-absolute top-0 start-100 dropdown">
              <Dropdown.Toggle
                className="dropdown-btn"
                variant="light"
                id="dropdown-basic"
              >
                {t("user.posts")}
              </Dropdown.Toggle>

              <Dropdown.Menu className="dropdown-menu">
                {itemsList.map((item, index) => {
                  return (
                    <Dropdown.Item key={index} href={`#${item._id}`}>
                      <p
                        style={{
                          fontSize: "10px",
                          fontWeight: "bold",
                          marginBottom: 0,
                        }}
                      >
                        {item.category?.toUpperCase() ?? ""}
                      </p>{" "}
                      {truncateText(item.title, 40)}
                      <p className="text-muted mb-0">
                        {" "}
                        <small>{formatDate(item.posted)}</small>
                      </p>
                    </Dropdown.Item>
                  );
                })}
              </Dropdown.Menu>
            </Dropdown>

            <Col xl={10} xxl={8} className="mb-4">
              <div className="d-flex display-6 mb-4 ">
                <p className="me-auto journey-page__author-note">
                  {t("shared.postedBy")}{" "}
                  <Link className="card-link" to={`/users/${journey.author}`}>
                    {journey.authorName}
                  </Link>
                </p>
              </div>
              <p className="text-muted">{journey.when.toUpperCase()}</p>

              <p
                className="journey-page__intro lead mb-5"
                style={{ whiteSpace: "pre-line" }}
              >
                {journey.content}
              </p>
              <ActionButtons
                className="d-flex justify-content-end"
                item={journey}
                isLoggedIn={!!token}
                isAuthor={isAuthor}
                itemIsFavorite={journeyIsFavorite}
                onAddFav={() => addFavHandler(journey)}
                onRemoveFav={() => removeFavHandler(journey)}
                onDelete={() => {
                  deleteHandler(journey);
                }}
              />
              <hr style={{ width: "100%" }} />
              <div id="map" className="pt-3 mb-5">
                <Map
                  style={{ width: "100%" }}
                  markers={markers}
                  markerOptions={{ draggable: false }}
                  ref={map}
                />
              </div>
            </Col>
          </div>

          <Col xl={10} xxl={8}>
            {itemsToRender}
            <div className="d-flex flex-row mt-5">
              <Button
                size="lg"
                variant="outline-primary"
                className="me-3 btn-add-p"
                onClick={() => history.push(`/posts/new/${journeyId}`)}
              >
                <i className="bi bi-plus"></i>
                {t("journey.addNextPost")}
              </Button>
              <Button
                size="lg"
                variant="outline-success"
                className="btn-add-e"
                onClick={() => history.push(`/exps/new/${journeyId}`)}
              >
                <i className="bi bi-plus"></i>
                {t("journey.addNextExp")}
              </Button>
            </div>
          </Col>

          <CustomModal
            show={showModal}
            {...deleteItemModalProps}
            {...modalText}
          />
          <OverlayTrigger
            placement="bottom"
            delay={{ show: 200, hide: 200 }}
            overlay={<Tooltip id="button-tooltip">Back to top</Tooltip>}
          >
            <Fab
              className="position-fixed"
              style={{ bottom: "10%", right: "5%" }}
              aria-label="navigate"
              href="#"
            >
              <BsArrowUp style={{ fontSize: "24px" }} />
            </Fab>
          </OverlayTrigger>
        </Fragment>
      )}
    </Fragment>
  );
};

export default JourneyPage;
