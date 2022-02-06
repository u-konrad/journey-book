import { useEffect, useState } from "react";
import useHttp from "../../hooks/http-hook";
import SearchInput from "../SearchInput";
import { Modal, Button } from "react-bootstrap";
import ReactDOM from "react-dom";
import "./ImagePickModal.css";
import Masonry from "react-masonry-component";
import Item from "./Item";
import { useTranslation } from "react-i18next";

const unsplashKey = process.env.REACT_APP_UNSPLASH_KEY;

const ImagePickModal = (props) => {
  const [query, setQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [images, setImages] = useState([]);
  const { fetchPhotos } = useHttp();
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (props.query) setQuery(props.query);
  }, [props.query]);

  useEffect(() => {
    if (!searchQuery) return;

    const fetchList = async () => {
      try {
        const response = await fetchPhotos(
          `?query=${searchQuery}&per_page=20`,
          {
            headers: {
              Authorization: `Client-ID ${unsplashKey}`,
            },
          }
        );
        const photos = response.results.map((item) => {
          return { id: item.id, urls: item.urls, alt: item.alt_description };
        });
        setImages(photos);
      } catch (err) {}
    };

    fetchList();
  }, [searchQuery, fetchPhotos]);

  const closeHandler = () => {
    setQuery("");
    setSearchQuery("");
    setImages([]);
    props.onCancel();
  };

  const photoList = images.map((photo, index) => {
    return (
      <Item
        selected={selectedPhoto ? selectedPhoto.id === photo.id : false}
        photo={photo}
        key={index}
        onSelect={() => {
          setSelectedPhoto(photo);
        }}
        onDeselect={() => {
          setSelectedPhoto(null);
        }}
      />
    );
  });

  const masonryOptions = {
    transitionDuration: 0,
  };

  const content = (
    <Modal size="lg" show={props.show} onHide={closeHandler} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('image.pickImg')}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="mx-auto ">
        <div style={{ paddingLeft: "10px" }} className="mx-auto mt-3 w-100">
          <SearchInput
            formClassName="mb-2"
            query={query}
            onQueryChange={(event) => setQuery(event.target.value)}
            onQuerySubmit={(event) => {
              event.preventDefault();
              event.stopPropagation();
              setSearchQuery(query);
            }}
            onQueryClear={() => {
              setQuery("");
              setSearchQuery("");
            }}
          />
        </div>
        {!!images.length && (
          <Masonry
            style={{
              overflowY: "scroll",
              paddingTop: "10px",
            }}
            className="mx-auto masonry-container"
            options={masonryOptions}
          >
            {photoList}
          </Masonry>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button type="button" variant="warning" onClick={closeHandler}>
        {t('shared.cancel')}
        </Button>
        <Button
          variant="success"
          type="button"
          onClick={() => {
            props.onAccept(selectedPhoto);
            closeHandler();
          }}
        >
        {t('shared.accept')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
  return ReactDOM.createPortal(content, document.getElementById("modal-hook"));
};

export default ImagePickModal;
