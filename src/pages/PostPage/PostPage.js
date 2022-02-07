import { Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Fragment, useEffect, useState, useContext, useRef } from "react";
import useHttp from "../../shared/hooks/http-hook";
import LoadingSpinner from "../../shared/components/LoadingSpinner/LoadingSpinner";
import { useHistory, useParams } from "react-router";
import Map from "../../map/Map";
import "./PostPage.css";
import ActionButtons from "../../shared/components/ActionButtons";
import { AuthContext } from "../../shared/context/auth-context";
import { useSelector } from "react-redux";
import CustomModal from "../../shared/components/CustomModal";
import formatDate from "../../shared/utils/formatDate";
import { Rating } from "@mui/material";
import CategoryLabel from "../../shared/components/CategoryLabel";
import { useTranslation } from "react-i18next";

const PostPage = ({ mode }) => {
  const { itemId } = useParams();
  const history = useHistory();
  const { userId, token } = useContext(AuthContext);
  const { t } = useTranslation();

  const [item, setItem] = useState(null);
  const { fetchData, addFav, removeFav, deleteItem } = useHttp();
  const [showModal, setShowModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const arrayName = "fav" + mode[0].toUpperCase() + mode.slice(1) + "s";
  const map = useRef();
  const favArray = useSelector((state) => state.fav[arrayName]) ?? [];

  let isAuthor;
  let itemIsFavorite;
  if (item) {
    isAuthor = userId === item.author;
    itemIsFavorite = favArray.includes(item._id);
  }

  const addFavHandler = (item) => {
    addFav({ token, itemId: item._id, type: item.itemType });
  };

  const removeFavHandler = (item) => {
    removeFav({ token, itemId: item._id, type: item.itemType });
  };

  const deleteHandler = (item) => {
    setItemToDelete(item);
    setShowModal(true);
  };

  const onConfirmDelete = async () => {
    try {
      await deleteItem(item, token);

      history.push("/");
    } catch (err) {}
  };

  const deleteItemModalProps = {
    type: "confirm",
    title: t('modal.deleteItemTitle'),
    text: t('modal.deleteItemText'),
    acceptBtnLabel: t('shared.delete'),
    acceptBtnType: "danger",
    cancelBtnType: "success",
    onAccept: () => {
      setShowModal(false);
      onConfirmDelete(itemToDelete);
    },
    onCancel: () => {
      setShowModal(false);
      setItemToDelete(null);
    },
  };

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await fetchData(`items/${itemId}?type=${mode}`);
        const item = response.item;

        setItem(item);
      } catch (err) {}
    };
    fetchItem();
  }, [fetchData, itemId, mode]);

  const hasCoords =
    !!item && !!item.coordinates && item.coordinates.length === 2;

  return (
    <Fragment>
      {!item ? (
        <LoadingSpinner />
      ) : (
        <Fragment>
          <Col xl={10} xxl={8} className="me-auto ms-auto mb-5 mt-3">
            <div
              style={{
                maxHeight: "60vh",
                overflow: "hidden",
                minHeight: "100px",
              }}
              className="mt-5 mb-3 d-flex justify-content-start align-items-center"
            >
              <img
                style={{ width: "100%" }}
                className="shadow"
                src={item.image.path}
                alt=""
              />{" "}
            </div>
            <p className="mt-3">
              {formatDate(item.posted)}, {t('card.author')} {" "}
              <Link className="card-link" to={`/users/${item.author}`}>
                {item.authorName}
              </Link>
            </p>
            {mode === "exp" && (
              <div className="mb-2 mt-4 d-flex align-items-center">
                <div className="mb-0 me-3 lead">
                  {" "}
                  {!!item.category && (
                    <CategoryLabel
                      className="p-0 m-1"
                      category={item.category}
                    />
                  )}
                </div>
                <Rating
                  name="read-only"
                  size="large"
                  value={item.rating}
                  readOnly
                />
              </div>
            )}
            <h1 className="post-page__title">{item.title}</h1>
            {!!item.journey?.title && (
              <p className="lead mt-4 mb-5">
                Part of{" "}
                <Link
                  className="card-link"
                  to={`/journeys/${item.journey._id}`}
                >
                  {item.journey.title}
                </Link>
              </p>
            )}
            <div className="pb-5 my-5">
              <p style={{ whiteSpace: "pre-line" }} className='lead'>{item.content}</p>
              <ActionButtons
                className="d-flex justify-content-end"
                item={item}
                isLoggedIn={!!token}
                isAuthor={isAuthor}
                itemIsFavorite={itemIsFavorite}
                onAddFav={() => addFavHandler(item)}
                onRemoveFav={() => removeFavHandler(item)}
                onDelete={() => deleteHandler(item)}
              />
            </div>
            {item.location && (
              <p className="text-muted">
                <i className="bi bi-geo-alt-fill"></i>
                <span> {item.location}</span>
              </p>
            )}
            {hasCoords && (
              <Map
                style={{ width: "100%", height: "500px" }}
                markers={[
                  {
                    location: item.location,
                    coordinates: [item.coordinates[0], item.coordinates[1]],
                  },
                ]}
                markerOptions={{ draggable: false }}
                ref={map}
              />
            )}
          </Col>
          <CustomModal show={showModal} {...deleteItemModalProps} />
        </Fragment>
      )}
    </Fragment>
  );
};

export default PostPage;
