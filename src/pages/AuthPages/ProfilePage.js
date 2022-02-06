import { Formik, Form } from "formik";
import * as Yup from "yup";
import InputField from "../../shared/components/InputField";
import { useHistory } from "react-router";
import FormWrapper from "../../shared/components/FormWrapper";
import { Button } from "react-bootstrap";
import useHttp from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import { useContext, useEffect, useState } from "react";
import LoadingSpinner from "../../shared/components/LoadingSpinner/LoadingSpinner";
import { Fragment } from "react";
import CustomModal from "../../shared/components/CustomModal";
import ImagePicker from "../../shared/components/ImagePicker/ImagePicker";
import transformImgUrl from "../../shared/utils/transformImgUrl";
import ButtonTooltip from "../../shared/components/ButtonTooltip";
import { useDispatch } from "react-redux";
import { userActions } from "../../store/store";
import { useTranslation } from "react-i18next";

const ProfilePage = () => {
  const history = useHistory();
  const { sendItem, fetchData, isLoading } = useHttp();
  const { token, userId, logout } = useContext(AuthContext);
  const [newPhoto, setNewPhoto] = useState(null);
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [changePhoto, setChangePhoto] = useState(false);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const imgUrl = transformImgUrl(user?.profileImage?.path, "200");

  const schema = Yup.object({
    username: Yup.string()
      .required(t('auth.usernameRequired'))
      .min(3, t('auth.usernameMin')),
    email: Yup.string()
      .required(t('auth.emailRequired'))
      .email(t('auth.emailCorrect')),
    about: Yup.string(),
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetchData(`users/${userId}/profile`, {
          headers: { Authorization: "Bearer " + token },
        });
        const { user } = response;

        setUser(user);
      } catch (err) {}
    };
    fetchProfile();
  }, [userId, token, fetchData]);

  const submitHandler = async (values) => {
    const formData = new FormData();
    formData.append("username", values.username);
    formData.append("email", values.email);
    formData.append("about", values.about);
    if (newPhoto) {
      formData.append("image", newPhoto);
    }

    try {
      const response = await sendItem({
        method: "PATCH",
        api: `users/${userId}`,
        type: "user&profile=true",
        body: formData,
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      if (newPhoto) {
        dispatch(
          userActions.updateUser({
            userImg: response.updated.profileImage,
            userName: response.updated.username,
          })
        );
      } else {
        dispatch(
          userActions.updateUser({
            userImg: user.profileImage,
            userName: response.updated.username,
          })
        );
      }
      history.push("/");
    } catch (err) {
      console.log(err);
    }
  };

  const deleteAccountHandler = async (password) => {
    try {
      await sendItem({
        method: "DELETE",
        api: `users/${userId}`,
        body: JSON.stringify({ password }),
        type: "user",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      logout();
      history.push("/");
    } catch (err) {}
  };

  const deleteAccountModalProps = {
    type: "prompt",
    title: t("modal.deleteAccountTitle"),
    text: t("modal.deleteAccountText"),
    inputType: "password",
    inputPlaceholder: t("modal.inputPassword"),
    acceptBtnLabel: t("shared.delete"),
    acceptBtnType: "danger",
    cancelBtnType: "success",
    onAccept: (password) => {
      setShowModal(false);
      deleteAccountHandler(password);
    },
    onCancel: () => {
      setShowModal(false);
    },
  };

  return (
    <FormWrapper title={t("profile.profileTitle")}>
      {isLoading ? (
        <LoadingSpinner />
      ) : user ? (
        <Fragment>
          <CustomModal show={showModal} {...deleteAccountModalProps} />
          <div className="d-flex w-100 flex-column align-items-center justify-content-center mb-3">
            {!changePhoto ? (
              <div className="position-relative">
                <ButtonTooltip
                  onClick={() => setChangePhoto(true)}
                  variant="success"
                  tooltip={t("profile.changePhoto")}
                  size="sm"
                  style={{
                    position: "absolute",
                    zIndex: 99,
                    bottom: "5%",
                    right: "5%",
                  }}
                >
                  <i className="bi bi-arrow-left-right"></i>
                </ButtonTooltip>
                <div
                  className="d-flex align-items-center"
                  style={{
                    borderRadius: "50%",
                    width: "200px",
                    height: "200px",
                    overflow: "hidden",
                    position: "relative",
                    marginTop: "1rem",
                  }}
                >
                  {!!imgUrl ? (
                    <img src={imgUrl} alt="Profile" style={{ width: "100%" }} />
                  ) : (
                    <i
                      style={{ fontSize: "120px" }}
                      className="bi bi-person-circle mx-auto"
                    ></i>
                  )}
                </div>
              </div>
            ) : (
              <ImagePicker
                existingPhoto={user.profileImage}
                onNewPhoto={setNewPhoto}
                previewShape="round"
                previewWidth="200"
              />
            )}
          </div>
          <Formik
            validationSchema={schema}
            onSubmit={submitHandler}
            initialValues={{ ...user }}
          >
            {(props) => (
              <Form>
                <InputField
                  name="username"
                  type="text"
                  label={t("auth.login")}
                  {...props}
                />
                <InputField name="email" type="email" {...props} />
                <InputField
                  name="about"
                  type="text"
                  as="textarea"
                  rows="5"
                  label={t("add.description")}
                  {...props}
                />

                <div className="w-100 d-flex justify-content-between">
                  <Button
                    type="button"
                    variant="outline-danger"
                    onClick={() => setShowModal(true)}
                  >
                    {t("profile.deleteAccount")}
                  </Button>
                  <Button type="submit" variant="outline-success">
                    {t("profile.saveChanges")}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </Fragment>
      ) : (
        <p>{t("profile.unableToLoad")}</p>
      )}
    </FormWrapper>
  );
};

export default ProfilePage;
