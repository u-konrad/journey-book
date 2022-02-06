import { useState } from "react";
import ReactDOM from "react-dom";
import { Modal, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const CustomModal = (props) => {
  const [prompt, setPrompt] = useState("");
  const { t } = useTranslation();

  const content = (
    <Modal show={props.show} onHide={props.onCancel} centered>
      <Modal.Header closeButton>
        <Modal.Title>{props.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {props.text}
        {props.type === "prompt" && (
          <input
            type={props.inputType || "text"}
            className="form-control container my-3"
            onChange={(event) => {
              setPrompt(event.target.value);
            }}
            placeholder={props.inputPlaceholder || ""}
          />
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant={props.cancelBtnType} onClick={props.onCancel}>
          {t('shared.cancel')}
        </Button>
        <Button
          variant={props.acceptBtnType}
          onClick={() => props.onAccept(prompt)}
        >
          {props.acceptBtnLabel}
        </Button>
      </Modal.Footer>
    </Modal>
  );
  return ReactDOM.createPortal(content, document.getElementById("modal-hook"));
};

export default CustomModal;
