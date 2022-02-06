import { Modal, Button } from "react-bootstrap";
import { useState } from "react";
import Map from "../../../map/Map";
import { useTranslation } from "react-i18next";

const MapModal = (props) => {
  const [coords, setCoords] = useState();
  const { t } = useTranslation();

  const closeHandler = () => {
    props.onClose();
  };

  return (
    <Modal size="lg" show={props.show} onHide={closeHandler} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('add.pickLocation')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Map
          markers={props.markers}
          markerOptions={{
            anchor: "bottom",
            draggable: true,
          }}
          onDragMarker={setCoords}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button type="button" variant="warning" onClick={closeHandler}>
         {t('shared.cancel')}
        </Button>
        <Button
          variant="success"
          type="button"
          onClick={() => {
            props.onAccept(coords);
            closeHandler();
          }}
        >
         {t('shared.accept')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MapModal;
