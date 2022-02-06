import ReactDOM from "react-dom";
import { Modal, Button } from "react-bootstrap";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import InputField from "../../../shared/components/InputField";
import { useContext, useState, Fragment } from "react";
import { AuthContext } from "../../../shared/context/auth-context";
import useHttp from "../../../shared/hooks/http-hook";
import LoadingSpinner from "../../../shared/components/LoadingSpinner/LoadingSpinner";
import ImagePicker from "../../../shared/components/ImagePicker/ImagePicker";
import { useTranslation } from "react-i18next";

const EditPageModal = (props) => {
  const [newPhoto, setNewPhoto] = useState(null);
  const { userId, token } = useContext(AuthContext);
  const { sendItem, isLoading } = useHttp();
  const { t } = useTranslation();

  const existingPhoto = props.image;

  const schema = Yup.object({
    blogTitle: Yup.string().required(t("add.titleRequired")),
    blogDesc: Yup.string().required(t("add.descriptionRequired")),
  });

  const submitHandler = async (values) => {
    const formData = new FormData();
    formData.append("blogTitle", values.blogTitle);
    formData.append("blogDesc", values.blogDesc);
    if (newPhoto) {
      formData.append("image", newPhoto);
    }

    try {
      const response = await sendItem({
        method: "PATCH",
        api: `users/${userId}`,
        type: "user",
        body: formData,
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      props.onSubmit({ ...response.updated });
    } catch (err) {
      props.onSubmit();
    }
  };

  const closeHandler = () => {
    setNewPhoto(null);
    props.onClose();
  };

  const content = (
    <Fragment>
      <Modal show={props.show} onHide={closeHandler} centered>
        {isLoading && <LoadingSpinner asOverlay />}
        <Modal.Header closeButton>
          <Modal.Title>{t('shared.edit')} blog</Modal.Title>
        </Modal.Header>

        <Formik
          validationSchema={schema}
          onSubmit={submitHandler}
          initialValues={{
            blogTitle: props.blogTitle,
            blogDesc: props.blogDesc,
          }}
        >
          {(props) => (
            <Form>
              <Modal.Body>
                <InputField
                  name="blogTitle"
                  label={t('add.title')}
                  type="text"
                  {...props}
                />
                <InputField
                  name="blogDesc"
                  label={t('add.description')}
                  type="text"
                  as="textarea"
                  rows="5"
                  {...props}
                />
                <ImagePicker
                  existingPhoto={existingPhoto}
                  onNewPhoto={setNewPhoto}
                />
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => closeHandler()}
                >
                 {t('shared.cancel')}
                </Button>
                <Button type="submit" variant="success">
                {t('add.submit')}
                </Button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Modal>
    </Fragment>
  );
  return ReactDOM.createPortal(content, document.getElementById("modal-hook"));
};

export default EditPageModal;
