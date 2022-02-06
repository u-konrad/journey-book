import ButtonTooltip from "../../../shared/components/ButtonTooltip";
import { Card, Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import transformImgUrl from "../../../shared/utils/transformImgUrl";
import { useTranslation } from "react-i18next";

const SmallUserPanel = ({ isAuthor, userData }) => {
  const history = useHistory();

  const { t } = useTranslation();

  return (
    <div className="d-md-none">
      <div className="d-flex flex-row align-items-top  position-relative my-4 ">
        {isAuthor && (
          <ButtonTooltip
            onClick={() => history.push("/profile")}
            tooltip={t('user.edit-profile-tooltip')}
            className="position-absolute user-page__edit-btn"
            style={{ top: "5px", right: "0" }}
            variant="outline-success"
            size="sm"
          >
            <i className="bi bi-pencil-square"></i>
          </ButtonTooltip>
        )}
        <div className="d-flex flex-column align-items-center  ">
          {userData.profileImage?.path && (
            <Card.Img
              style={{
                width: "75px",
                height: "75px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
              className="me-auto"
              src={transformImgUrl(userData.profileImage?.path, "75")}
              alt="Profile "
            />
          )}
          <p style={{ fontSize: "14px" }} className="my-1 text-center ">
            <strong>{userData.username}</strong>
          </p>
        </div>
        <div className="px-4 col-8">
          <p className="mb-1" style={{ fontSize: "16px" }}>
            {userData.about}
          </p>
          <div className="d-flex flex-column text-muted  w-100 justify-content-between">
            <p className="my-0" style={{ fontSize: "12px" }}>
              {userData.journeyNum} {t('user.journeys')}
            </p>

            <p className="my-0" style={{ fontSize: "12px" }}>
              {userData.postNum} {t('user.posts')}
            </p>

            <p className="my-0" style={{ fontSize: "12px" }}>
              {userData.expNum} {t('user.exps')}
            </p>
          </div>
        </div>
      </div>
      {isAuthor && (
        <div className="d-flex flex-row justify-content-start align-items-center">
          <Button
            className="user-page__profile-btn ms-0  text-start btn-add-j"
            variant="outline-primary"
            onClick={() => history.push("/journeys/new")}
          >
            {" "}
            <i className="bi bi-plus-lg"></i> {t('shared.journey')}
          </Button>
          <Button
            className="user-page__profile-btn  text-start btn-add-p"
            variant="outline-success"
            onClick={() => history.push("/posts/new")}
          >
            {" "}
            <i className="bi bi-plus-lg"></i> {t('shared.post')}
          </Button>
          <Button
            className="user-page__profile-btn text-start btn-add-e"
            variant="outline-secondary"
            onClick={() => history.push("/exps/new")}
          >
            {" "}
            <i className="bi bi-plus-lg"></i> {t('shared.exp')}
          </Button>
        </div>
      )}
    </div>
  );
};

export default SmallUserPanel;
