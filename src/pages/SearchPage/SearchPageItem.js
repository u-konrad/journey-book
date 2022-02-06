import truncateText from "../../shared/utils/truncateText";
import formatDate from "../../shared/utils/formatDate";
import transformImgUrl from "../../shared/utils/transformImgUrl";
import { useHistory, Link } from "react-router-dom";
import { Rating } from "@mui/material";
import CategoryLabel from "../../shared/components/CategoryLabel";
import { Card, Col } from "react-bootstrap";
import { t } from "i18next";

const SearchPageItem = ({ item }) => {
  const history = useHistory();

  const typeString = (type) => {
    switch (type) {
      case "post":
        return t('shared.post')
      case "journey":
        return t('shared.journey')
      case "exp":
        return t('shared.exp2')
      default:
        return "";
    }
  };

  return (
    <Card
      className="rounded shadow mb-2 search-item-card "
      style={{ cursor: "pointer" }}
      onClick={() => history.push(`/${item.itemType}s/${item._id}`)}
    >
      <Card.Body>
        <div className="d-flex">
          <div>
            {!!item.image?.path && (
              <Card.Img
                className="card-pic"
                src={transformImgUrl(item.image.path, "200")}
              />
            )}
          </div>
          <Col className="ps-3 pe-lg-3">
            <div
              style={{ fontSize: "12px" }}
              className="mb-1 d-flex justify-content-between "
            >
              <div className="d-flex flex-column flex-sm-row mb-1">
                <span className="text-muted me-4">
                  {formatDate(item.posted)}
                </span>
                {item.journey?.title && (
                  <span>
                    Part of{" "}
                    <Link
                      className="card-link"
                      onClick={(e) => e.stopPropagation()}
                      to={`/journeys/${item.journey._id}`}
                    >
                      {item.journey.title}
                    </Link>
                  </span>
                )}
              </div>
              <span className="text-end">
                {typeString(item.itemType)} {t('search.by')}{" "}
                <Link
                  className="card-link"
                  to={`/users/${item.author}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  {item.authorName}
                </Link>
              </span>
            </div>
            <div className="d-flex align-items-center mb-2">
              <span>
                {" "}
                {!!item.category && (
                  <CategoryLabel
                    className="p-0 m-0 me-2"
                    category={item.category}
                    style={{ fontSize: "14px" }}
                  />
                )}
              </span>
              {!!item.rating && (
                <Rating
                  name="read-only"
                  size="small"
                  value={item.rating}
                  readOnly
                />
              )}
            </div>

            <Card.Title className="pe-lg-5">{item.title}</Card.Title>
            <Card.Text className="text-muted mb-2" style={{ fontSize: "12px" }}>
              <i className="bi bi-geo-alt-fill"></i>{" "}
              {truncateText(item.location, 50)}
            </Card.Text>
            <Card.Text className="pe-lg-5">
              {truncateText(item.content, 60)}
            </Card.Text>
          </Col>
        </div>
      </Card.Body>
    </Card>
  );
};

export default SearchPageItem;
