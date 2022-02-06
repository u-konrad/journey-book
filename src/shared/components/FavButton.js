import { Fragment } from "react";
import { OverlayTrigger,Tooltip } from "react-bootstrap";
import { useTranslation } from "react-i18next";


const FavButton = (props) => {
  let content;
    const buttonStyle ={border: "none",backgroundColor:'transparent', color:'black',fontSize:'20px',...props.style}

    const { t } = useTranslation();

  if (props.isFavorite) {
    content = (
        <OverlayTrigger
        placement="bottom"
        delay={{ show: 200, hide: 200 }}
        overlay={<Tooltip id="button-tooltip">{t('shared.removeFromFavs')}</Tooltip>}
      >
      <button style={buttonStyle} onClick={props.removeFavHandler}>
        <i className="bi bi-star-fill"></i>
      </button>
      </OverlayTrigger>
    );
  } else {
    content = (
        <OverlayTrigger
        placement="bottom"
        delay={{ show: 200, hide: 200 }}
        overlay={<Tooltip id="button-tooltip">{t('shared.addToFavs')}</Tooltip>}
      >
      <button style={buttonStyle} onClick={props.addFavHandler}>
        <i className="bi bi-star"></i>
      </button>
      </OverlayTrigger>
    );
  }

  return <Fragment>{content}</Fragment>;
};

export default FavButton;