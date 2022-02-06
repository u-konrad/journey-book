import React, { useRef, useEffect } from "react";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import "mapbox-gl/dist/mapbox-gl.css";
import "./Map.css";


mapboxgl.accessToken =
  process.env.REACT_APP_MAPBOX_KEY;

const Map = React.forwardRef((props, ref) => {
  const mapContainer = useRef(null);

  const mapRef = useRef();
  const map = ref ? ref : mapRef;

  useEffect(() => {
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [0, 51],
      zoom: 8,
    });
    map.current.addControl(new mapboxgl.NavigationControl());
  }, [map]);

  useEffect(() => {
    if (!map.current || !props.markers) return;

    props.markers
      .filter(
        (marker) => !!marker.coordinates && marker.coordinates.length === 2
      )
      .forEach((element) => {
        const newMarker = new mapboxgl.Marker(props.markerOptions)
          .setLngLat(element.coordinates)
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }).setHTML(
              `<div class='d-flex justify-content-center align-items-center p-1'>
              <p class='text-center m-0'>
              <a class='popup-link ' href='#${element._id}'>${element.location}</a>
              </p></div>
            `
            )
          )
          .addTo(map.current);

        newMarker.getElement().setAttribute("id", `marker_${element._id}`);

        if (props.markerOptions.draggable) {
          newMarker.on(
            "dragend",
            (e) => {
              let coords = [e.target._lngLat.lng, e.target._lngLat.lat];
              props.onDragMarker(coords);
            },
            { passive: true }
          );
        }
      });

    if (
      props.markers[0] &&
      props.markers[0].coordinates &&
      props.markers[0].coordinates.length === 2
    ) {
      map.current.jumpTo({ center: props.markers[0].coordinates });
    }
  }, [ map]);

  return (
    <div
      style={props.style}
      ref={mapContainer}
      className={`map-container ${props.className}`}
    />
  );
});

export default Map;
