import truncateText from "../../shared/utils/truncateText";
import transformImgUrl from "../../shared/utils/transformImgUrl";
import formatDate from "../../shared/utils/formatDate";
import { Link, useHistory } from "react-router-dom";
import { Card } from "react-bootstrap";
import CategoryLabel from "../../shared/components/CategoryLabel";
import { Rating } from "@mui/material";
import { useTranslation } from "react-i18next";

const ItemCard = ({ item }) => {
  const history = useHistory();
  const { t } = useTranslation();

  return (
    <div
      className="home-page__post-card rounded"
      onClick={() => history.push(`/${item.itemType}s/${item._id}`)}
    >
      {item.image?.path && (
        <div
          style={{
            maxHeight: "250px",
            maxWidth: "100%",
            overflow: "hidden",
          }}
        >
          <img
            style={{
              height: "250px",
              width: "100%",
              objectFit: "cover",
            }}
            alt={item.title.split(" ")[0]}
            src={transformImgUrl(item.image.path, "400")}
          ></img>
        </div>
      )}
      <div className="mt-2">
        {item.itemType === "exp" && (
          <div className="d-flex justify-content-between  mb-1">
            <div>
              {" "}
              {!!item.category && (
                <CategoryLabel
                  style={{ fontSize: "14px" }}
                  className="p-0 "
                  category={item.category}
                />
              )}
            </div>
            <Rating
              size="small"
              name="read-only"
              value={item.rating}
              readOnly
            />
          </div>
        )}
        <p className="home-page__card-title mb-0" style={{ height: "40px" }}>
          {truncateText(item.title, 50)}
        </p>
        {!item.image?.path && (
          <div style={{ fontSize: "14px" }}>
            {truncateText(item.content, 300)}
          </div>
        )}
      </div>
      <div
        style={{ fontSize: "14px"}}
        className="d-flex justify-content-between"
      >
        <span>
          {t("shared.postedBy")}{" "}
          <Link
            className="card-link"
            onClick={(e) => {
              e.stopPropagation();
            }}
            to={`/users/${item.author}`}
          >
            {item.authorName}
          </Link>
        </span>{" "}
      </div>
    </div>
  );
};

export default ItemCard;
