import React, { createRef } from "react";
import Pagination from "@mui/material/Pagination";

const LatestItems = ({ title, subtitle, items }) => {
  const itemsRef = createRef();

  return (
    <div className="home-page__outer-container">
      <h3 className=" ">{title}</h3>
      <p className="text-muted lead" style={{marginBottom:'2rem'}}>{subtitle}</p>
      <div ref={itemsRef} className="post-grid mb-4">
        {items}
      </div>
      <div className="d-flex justify-content-center">
        <Pagination
          className="pagination"
          siblingCount={0}
          boundaryCount={1}
          count={2}
          defaultPage={1}
          onChange={(e, page) => {
            itemsRef.current.scrollLeft =
              (page - 1) * itemsRef.current.offsetWidth;
          }}
        />
      </div>
    </div>
  );
};

export default LatestItems;
