import { Fragment, useEffect, useState, useReducer, useRef } from "react";
import ImagePickModal from "./ImagePickModal";
import ImageUpload from "./ImageUpload";
import ButtonTooltip from "../ButtonTooltip";
import { useTranslation } from "react-i18next";

const initState = { file: null, webPhoto: null };

const reducer = (state, action) => {
  switch (action.type) {
    case "loadFile":
      return { file: action.payload, webPhoto: null };
    case "loadWebPhoto":
      return { file: null, webPhoto: action.payload };
    case "clear":
      return initState;
    default:
      return state;
  }
};

const ImagePicker = ({
  existingPhoto,
  onNewPhoto,
  proposedQuery,
  previewWidth = "400",
  previewShape = "square",
}) => {
  const [showModal, setShowModal] = useState(false);
  const [photoData, dispatchPhoto] = useReducer(reducer, initState);
  const filePickerRef = useRef();

  const { t } = useTranslation();

  useEffect(() => {
    if (existingPhoto) {
      dispatchPhoto({ type: "loadWebPhoto", payload: existingPhoto });
    }
  }, [existingPhoto]);

  useEffect(() => {
    if (photoData.file) {
      onNewPhoto(photoData.file);
    } else if (photoData.webPhoto) {
      onNewPhoto(JSON.stringify(photoData.webPhoto));
    } else {
      onNewPhoto(JSON.stringify({ path: "", filename: "" }));
    }
  }, [photoData, onNewPhoto]);

  const pickImageHandler = () => {
    filePickerRef.current.click();
  };

  const pickerAcceptHandler = (photo) => {
    if (!photo) return;
    const img = { path: photo.urls.regular, filename: `unsplash_${photo.id}` };
    dispatchPhoto({ type: "loadWebPhoto", payload: img });
  };

  const fileInputHandler = (file) => {
    dispatchPhoto({ type: "loadFile", payload: file });
  };

  return (
    <Fragment>
      <ImageUpload
        id="image"
        file={photoData.file}
        onInput={fileInputHandler}
        webPhoto={photoData.webPhoto}
        ref={filePickerRef}
        previewWidth={previewWidth}
        previewShape={previewShape}
      />
      <div className="d-flex justify-content-center">
        <ButtonTooltip
          className="me-2"
          onClick={pickImageHandler}
          tooltip={t('image.uploadTooltip')}
          size="sm"
          variant="outline-primary"
        >
          <i className="bi bi-upload"></i> {t('image.upload')}
        </ButtonTooltip>
        <ButtonTooltip
          onClick={() => setShowModal(true)}
          variant="outline-success"
          tooltip={t('image.findWebTooltip')}
          size="sm"
        >
          <i className="bi bi-cloud-arrow-down"></i> {t('image.web')}
        </ButtonTooltip>
      </div>
      <ImagePickModal
        query={proposedQuery}
        show={showModal}
        onCancel={() => setShowModal(false)}
        onAccept={pickerAcceptHandler}
      />
    </Fragment>
  );
};

export default ImagePicker;
