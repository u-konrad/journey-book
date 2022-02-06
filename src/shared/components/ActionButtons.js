import { Fragment } from "react";
import { useHistory } from "react-router";
import ButtonTooltip from "../../shared/components/ButtonTooltip";
import FavButton from "./FavButton";
import { useTranslation } from "react-i18next";


const ActionButtons = ({
  isLoggedIn,
  isAuthor,
  itemIsFavorite,
  onRemoveFav,
  onAddFav,
  onDelete,
  item,
  className = "d-inline",
  size='sm'
}) => {
  const history = useHistory();
  const { t } = useTranslation();


  let content;
  if (isAuthor) {
    content = (
      <div className={className}>
        <ButtonTooltip
          variant="outline-success"
          size={size}
          className="me-2"
          onClick={() => history.push(`/${item.itemType}s/edit/${item._id}`)}
          tooltip={t("shared.edit")}
        >
          <i className="bi bi-pencil-square"></i>
        </ButtonTooltip>
        <ButtonTooltip
          size={size}
          variant="outline-danger"
          className="me-2"
          onClick={onDelete}
          tooltip={t("shared.delete")}
        >
          <i className="bi bi-trash"></i>
        </ButtonTooltip>
      </div>
    );
  } else if(isLoggedIn) {
    content = (
      <div className={className}>
        <FavButton
          isFavorite={itemIsFavorite}
          removeFavHandler={onRemoveFav}
          addFavHandler={onAddFav}
        />
      </div>
    );
  }

  return <Fragment>{content}</Fragment>;
};

export default ActionButtons;
