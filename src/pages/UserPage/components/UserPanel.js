import ButtonTooltip from "../../../shared/components/ButtonTooltip";
import { Card, Col, Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import transformImgUrl from "../../../shared/utils/transformImgUrl";
import { useTranslation } from "react-i18next";

const UserPanel = ({ isAuthor, userData }) => {
  const history = useHistory();

  const { t } = useTranslation();

  return (
    <Col className="d-none d-md-block" lg={5}>
      <Card className="d-flex flex-column align-items-center text-center shadow position-relative mb-5">
        {isAuthor && (
          <ButtonTooltip
            onClick={() => history.push("/profile")}
            tooltip={t('user.edit-profile-tooltip')}
            className="position-absolute"
            style={{ top: "15px", right: "15px" }}
            variant="outline-success"
            size="sm"
          >
            <i className="bi bi-pencil-square"></i>
          </ButtonTooltip>
        )}
        <Card.Body className="d-flex flex-column flex-sm-row d-lg-block justify-content-between align-items-center w-100 px-3 px-sm-5 py-3 py-lg-5">
          {userData.profileImage?.path && (
            <Card.Img
              style={{
                width: "150px",
                height: "150px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
              className="mb-4"
              src={transformImgUrl(userData.profileImage?.path, "200")}
              alt="Profile image"
            />
          )}
          <div className="px-3">
            <p style={{ fontSize: "24px" }} className="my-3 mb-4 lead">
              {t('user.user-panel-title')} <strong>{userData.username}</strong>
            </p>
            <p className="mt-3 mb-4">{userData.about}</p>
            <div className="d-flex text-muted px-sm-4 mb-4 w-100 justify-content-between">
              <div>
                <p className="display-4">{userData.journeyNum}</p>
                <span style={{ fontSize: "14px" }}>{t('user.journeys')}</span>
              </div>
              <div>
                <p className="display-4">{userData.postNum}</p>
                <span style={{ fontSize: "14px" }}>{t('user.posts')}</span>
              </div>
              <div>
                <p className="display-4">{userData.expNum}</p>
                <span style={{ fontSize: "14px" }}>{t('user.exps')}</span>
              </div>
            </div>
          </div>
          {isAuthor && (
            <div className="d-flex flex-row flex-sm-column justify-content-between align-items-center">
              <Button
                className="user-page__profile-btn  text-start btn-add-j"
                variant="outline-primary"
                onClick={() => history.push("/journeys/new")}
              >
                {" "}
                <i className="bi bi-plus-lg"></i> {t('shared.newJourney')}
              </Button>
              <Button
                className="user-page__profile-btn  text-start btn-add-p"
                variant="outline-success"
                onClick={() => history.push("/posts/new")}
              >
                {" "}
                <i className="bi bi-plus-lg"></i> {t('shared.newPost')}
              </Button>
              <Button
                className="user-page__profile-btn text-start btn-add-e"
                variant="outline-info"
                onClick={() => history.push("/exps/new")}
              >
                {" "}
                <i className="bi bi-plus-lg"></i> {t('shared.newExp')}
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>
    </Col>
  );
};

export default UserPanel;
