import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import formatDate from "../../../shared/utils/formatDate";
import { useContext } from "react";
import { useSelector } from "react-redux";
import { AuthContext } from "../../../shared/context/auth-context";
import { useHistory } from "react-router";
import ActionButtons from "../../../shared/components/ActionButtons";
import truncateText from "../../../shared/utils/truncateText";
import transformImgUrl from "../../../shared/utils/transformImgUrl";
import { useTranslation } from "react-i18next";

const maxChars = 400;

const PostCard = ({ item, onAddFav, onRemoveFav, onDelete }) => {
  const { userId, token } = useContext(AuthContext);
  const history = useHistory();
  const { t } = useTranslation();

  const arrayName =
    "fav" + item.itemType[0].toUpperCase() + item.itemType.slice(1) + "s";
  const favArray = useSelector((state) => state.fav[arrayName]);

  const isAuthor = userId === item.author;
  const itemIsFavorite = favArray.includes(item._id);

  let thumbImg = transformImgUrl(item.image?.path, "800");
  let truncatedContent = truncateText(item.content, maxChars);

  return (
    <Card id={item._id} className="shadow">
      <div className="user-page__card-header  d-flex justify-content-between  px-4">
        <span className="me-3">{formatDate(item.posted)}</span>
        {item.journey?.title && (
          <div className="me-1">
            {t('card.partOf')}{" "}
            <Link className="card-link" to={`/journeys/${item.journey._id}`}>
              {item.journey.title}
            </Link>
          </div>
        )}
        <span>
        {t('card.author')}{" "}
          <Link className="card-link" to={`/users/${item.author}`}>
            {item.authorName}
          </Link>
        </span>
      </div>

      <Card.Body className="mb-3 pt-0 px-4">
        {item.image?.path && (
          <div
            className="d-flex mb-3 rounded align-items-center"
            style={{ width: "100%", maxHeight: "35vh", overflow: "hidden" }}
          >
            <Card.Img className="w-100" src={thumbImg} />
          </div>
        )}
        <Card.Title as={"h2"}>{item.title}</Card.Title>
        <Card.Text className="text-muted" style={{ fontSize: "14px" }}>
          {!!item.location && (
            <span>
              <i className="bi bi-geo-alt-fill"></i> {item.location}
            </span>
          )}
        </Card.Text>
        <Card.Text style={{ fontSize: "14px" }} className="pe-3 pe-sm-5 mt-4">
          {truncatedContent}
        </Card.Text>
      </Card.Body>

      <Card.Footer className="user-page__card-footer px-4">
        <div className="d-flex justify-content-between align-items-center">
          {" "}
          <Button
            size="sm"
            variant="outline-dark"
            onClick={() => history.push(`/${item.itemType}s/${item._id}`)}
          >
           {t('card.details')}
          </Button>
          {token && (
            <ActionButtons
              item={item}
              isLoggedIn={!!token}
              isAuthor={isAuthor}
              itemIsFavorite={itemIsFavorite}
              onAddFav={onAddFav}
              onRemoveFav={onRemoveFav}
              onDelete={onDelete}
            />
          )}
        </div>
      </Card.Footer>
    </Card>
  );
};

export default PostCard;
