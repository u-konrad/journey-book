import React, { useState, useEffect } from "react";
import transformImgUrl from "../../utils/transformImgUrl";

import ButtonTooltip from "../ButtonTooltip";
import "./ImageUpload.css";
import { useTranslation } from "react-i18next";

const ImageUpload = React.forwardRef((props, ref) => {
  const [previewUrl, setPreviewUrl] = useState();
  const { t } = useTranslation();

  useEffect(() => {
    if (props.webPhoto) {
      const thumb = transformImgUrl(props.webPhoto.path, props.previewWidth);
      setPreviewUrl(thumb);
      return;
    }
    if (!props.file) {
      setPreviewUrl("");
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = () => {
      let img = new Image();
      img.src = fileReader.result;
      setPreviewUrl(img.src);
      img.onload = () => {
        console.log(img.width, img.height);
      };
    };
    fileReader.readAsDataURL(props.file);
  }, [props.file, props.webPhoto, props.previewWidth]);

  const pickedHandler = (event) => {
    let pickedFile;
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];
    }
    props.onInput(pickedFile);
  };

  return (
    <div className="form-control" style={{ border: "none" }}>
      <input
        id={props.id}
        ref={ref}
        style={{ display: "none" }}
        type="file"
        accept=".jpg,.png,.jpeg"
        onChange={pickedHandler}
      />
      <div className={`image-upload center`}>
        <div className={`image-upload__preview-${props.previewShape}`}>
          {previewUrl && <img src={previewUrl} alt="Preview" />}
          {previewUrl && (
            <ButtonTooltip
              type="button"
              className="btn btn-sm btn-danger px-1 py-0"
              tooltip={t('image.clearImg')}
              onClick={() => {
                props.onInput();
                setPreviewUrl();
              }}
            >
              <i className="bi bi-x"></i>
            </ButtonTooltip>
          )}
          {!previewUrl && (
            <p className="m-0">
              <i className="bi bi-image"></i> {props.imageLabel || t('image.noImg')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
});

export default ImageUpload;
