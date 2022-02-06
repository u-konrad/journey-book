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

const maxChars = 240;

const JourneyCard = ({ item, onAddFav, onRemoveFav, onDelete }) => {
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

  const bodyColor = 'var(--clr-card-bg)';

  return (
    <Card id={item._id} className="shadow">
 
      {item.image && (
        <div
          className="d-flex align-items-center"
          style={{ width: "100%", maxHeight: "40vh", overflow: "hidden" }}
        >
          <img src={thumbImg} style={{ width: "100%" }} alt='' />
        </div>
      )}
      <Card.Body style={{ backgroundColor: bodyColor }} className="px-3 px-sm-5 pt-4">
        <Card.Title className=" display-5 ">
          <strong>{item.title}</strong>
        </Card.Title>
        <span className="text-muted"><small>{item.when}</small></span>
        <Card.Text className="my-3 pe-3 pe-sm-5">{truncatedContent}</Card.Text>
        <Button
          className="my-2"
          variant="outline-dark"
          onClick={() => history.push(`/journeys/${item._id}`)}
        >
         {t('card.details')}
        </Button>
      </Card.Body>
      <Card.Footer className="user-page__card-footer px-3 px-sm-5">
        <div
          style={{fontSize:'14px'}}
          className="d-flex justify-content-between align-items-center text-muted "
        >
          <div><span className="me-3">{formatDate(item.posted)}</span>
          <span>
          {t('card.author')}{" "}
            <Link className="card-link" to={`/users/${item.author}`}>{item.authorName}</Link>
          </span></div>

          {token && (
            <ActionButtons
            isLoggedIn={!!token}
              item={item}
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

export default JourneyCard;
