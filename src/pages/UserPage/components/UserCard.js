import { Link } from "react-router-dom";
import { Card } from "react-bootstrap";
import formatDate from "../../../shared/utils/formatDate";
import { useTranslation } from "react-i18next";

const UserCard = ({ item }) => {

  const { t } = useTranslation();

  return (
    <Card id={item._id} className="shadow">
      <Card.Body>
        <Card.Title as={"h4"} className="my-3">
          <span>
            {" "}
            {t('card.user')}{" "}
            <strong>
              <Link className="card-link" to={`/users/${item._id}`}>
                {item.username}
              </Link>{" "}
            </strong>{" "}
            {t('card.added')} {formatDate(item.added)}
          </span>
        </Card.Title>
      </Card.Body>
    </Card>
  );
};

export default UserCard;
