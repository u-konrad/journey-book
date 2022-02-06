import "./JourneyPage.css";
import ActionButtons from "../../shared/components/ActionButtons";
import { useSelector } from "react-redux";

import formatDate from "../../shared/utils/formatDate";
import { Rating } from "@mui/material";
import CategoryLabel from "../../shared/components/CategoryLabel";
import { Fragment } from "react";

const JourneyPageItem = ({
  item,
  isAuthor,
  addFavHandler,
  removeFavHandler,
  deleteHandler,
  locationClickHandler,
  isLoggedIn
}) => {
  let content;

  const arrayName =
    "fav" + item.itemType[0].toUpperCase() + item.itemType.slice(1) + "s";
  const favArray = useSelector((state) => state.fav[arrayName]);

  const itemIsFavorite = favArray.includes(item._id);

  if (item.itemType === "post") {
    content = (
      <div id={item._id} className="my-4 py-3 border-bottom">
        <p style={{ fontSize: "14px" }}>{formatDate(item.posted)}</p>
        <div className="d-flex">
          <h2 className="me-auto align-items-end">{item.title}</h2>
          <ActionButtons
            item={item}
            isLoggedIn={isLoggedIn}

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
            <span
              className="journey-page__location-link"
              onClick={() => {
                locationClickHandler(item);
              }}
            >
              {" "}
              {item.location}
            </span>
          </p>
        )}
        <img
          className="w-100 my-3"
          src={item.image?.path}
          style={{
            maxHeight: "55vh",
            overflow: "hidden",
            objectFit: "cover",
          }}
          alt=''
        />
        <p
          className="my-4"
          style={{ fontSize: "18px", whiteSpace: "pre-line" }}
        >
          {item.content}
        </p>
      </div>
    );
  } else if (item.itemType === "exp") {
    content = (
      <div
        id={item._id}
        style={{ backgroundColor: "var(--clr-bg-2)" }}
        className="my-4 p-4 card shadow rounded"
      >
        <div className="d-flex justify-content-between mb-4 pb-2 border-bottom">
          {!!item.category && (
            <CategoryLabel className="lead" category={item.category} />
          )}
          <Rating name="read-only" value={item.rating} readOnly />
        </div>

        <p style={{ fontSize: "14px" }}>{formatDate(item.posted)}</p>
        <div className="d-flex">
          <h2 className="me-auto align-items-end">{item.title}</h2>
          <ActionButtons
            item={item}
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
            <span
              className="journey-page__location-link"
              onClick={() => {
                locationClickHandler(item);
              }}
            >
              {" "}
              {item.location}
            </span>
          </p>
        )}
        <img
          className="w-100 my-3"
          src={item.image?.path}
          style={{
            maxHeight: "50vh",
            overflow: "hidden",
            objectFit: "cover",
          }}
          alt=''
        />
        <p className="my-4 pe-4" style={{ whiteSpace: "pre-line" }}>
          {item.content}
        </p>
      </div>
    );
  }

  return <Fragment>{content}</Fragment>;
};

export default JourneyPageItem;
