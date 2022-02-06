import { useFormikContext } from "formik";
import InputField from "../InputField";
import { Dropdown, Row, Col } from "react-bootstrap";
import { useState, useEffect, useCallback, Fragment } from "react";
import MapModal from "./MapModal";
import ButtonTooltip from "../ButtonTooltip";
import { useTranslation } from "react-i18next";

const mapboxUrl = "https://api.mapbox.com/geocoding/v5/mapbox.places/";
const mapboxToken =
  "pk.eyJ1IjoiaG9yc2llIiwiYSI6ImNrd25udGQ2djJubGsycG1qdThjMG5oNmQifQ.I1MHVbyYkP1timH2lnD0lQ";

const LocationInput = (props) => {
  const { setFieldValue } = useFormikContext();
  const [geoData, setGeoData] = useState();
  const [geoQuery, setGeoQuery] = useState("");
  const [showMapModal, setShowMapModal] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchGeoData = async () => {
      try {
        const response = await fetch(
          mapboxUrl + `${geoQuery}.json?access_token=${mapboxToken}`
        );
        const data = await response.json();
        setGeoData(data);
      } catch (err) {
        console.log(err);
      }
    };
    if (geoQuery) {
      fetchGeoData();
    }
  }, [geoQuery]);

  const suggestions =
    geoData && geoData.features
      ? geoData.features.map((item, index) => (
          <Dropdown.Item
            key={index}
            as="button"
            type="button"
            onClick={() =>
              handleClick(item.place_name, item.geometry.coordinates)
            }
          >
            {item.matching_place_name || item.place_name}
          </Dropdown.Item>
        ))
      : [];

  const convertCoords = (coords) => {
    if (!coords || !coords[0] || !coords[1]) return t("add.noCoords");
    const lng = coords[0].toFixed(4);
    const lngLetter = lng > 0 ? Math.abs(lng) + "E" : Math.abs(lng) + "W";
    const lat = coords[1].toFixed(4);
    const latLetter = lat > 0 ? Math.abs(lat) + "N" : Math.abs(lat) + "S";
    return `Long: ${lngLetter} Lat: ${latLetter}`;
  };

  let timer;

  useEffect(() => {
    return () => {
      clearTimeout(timer);
    };
  }, [timer]);

  const debounceFunction = useCallback(
    (func, delay) => {
      return function () {
        let self = this;
        let args = arguments;
        clearTimeout(timer);
        timer = setTimeout(() => {
          func.apply(self, args);
        }, delay);
      };
    },
    [timer]
  );

  const debounceSetGeoQuery = useCallback(
    debounceFunction((nextValue) => setGeoQuery(nextValue), 300),
    [debounceFunction]
  );

  const handleClick = (value, coords) => {
    setFieldValue("location", value);
    props.setCoords(coords);
    setGeoQuery("");
  };

  const locationChangeHandler = (event) => {
    if (event.target.value.length > 2) {
      debounceSetGeoQuery(event.target.value);
    }
  };

  const locationBlurHandler = () => {
    debounceSetGeoQuery("");
  };

  return (
    <Fragment>
      <Row>
        <Col>
          <div className="mb-3">
            <InputField
              name="location"
              label={t("add.location")}
              type="text"
              autocomplete="off"
              divClass="mb-0"
              onChange={locationChangeHandler}
              onBlur={locationBlurHandler}
              {...props}
            />
            <Dropdown show={!!geoQuery}>
              <Dropdown.Menu>{suggestions}</Dropdown.Menu>
            </Dropdown>
            <div className="d-flex mt-1 text-muted">
              <small>
                <i className="bi bi-compass"></i> {convertCoords(props.coords)}
              </small>
              {!!props.coords?.length && (
                <ButtonTooltip
                  variant="outline-secondary"
                  style={{ borderRadius: "0.5rem" }}
                  className="py-0 px-1 ms-2"
                  onClick={() => props.setCoords()}
                  tooltip={t('add.clearCoords')}
                >
                  {" "}
                  <i className="bi bi-x"></i>
                </ButtonTooltip>
              )}
            </div>
          </div>
        </Col>
        <Col lg={1} className="d-flex align-items-center justify-content-end">
          <ButtonTooltip
            variant="outline-primary"
            style={{ marginBottom: "10px" }}
            onClick={() => {
              setShowMapModal(true);
            }}
            tooltip={t('add.pickLocation')}
          >
            {" "}
            <i className="bi bi-map"></i>
          </ButtonTooltip>
        </Col>
      </Row>
      <MapModal
        show={showMapModal}
        markers={[
          {
            _id: "",
            location: props.values.location || "London",
            coordinates: props.coords?.length
              ? props.coords
              : [-0.0118, 51.4778],
          },
        ]}
        onClose={() => setShowMapModal(false)}
        onAccept={(coords) => {
          if (!coords) return;
          props.setCoords(coords);
        }}
      />
    </Fragment>
  );
};

export default LocationInput;
