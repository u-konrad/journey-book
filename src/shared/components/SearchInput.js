// import OverlayTrigger from "react-bootstrap/OverlayTrigger";
// import Tooltip from "react-bootstrap/Tooltip";
import { Button } from "react-bootstrap";

const SearchInput = ({
  query,
  onQuerySubmit,
  onQueryChange,
  // onQueryClear,
  formClassName = "",
  btnVariant = "success",
  fontSize = "16px",
  placeholder
}) => {
  return (
    <form className={formClassName} onSubmit={onQuerySubmit}>
      <div className="input-group ">
        <input
          style={{ fontSize: fontSize }}
          className="form-control"
          type="search"
          placeholder={placeholder}
          aria-label="Search"
          value={query}
          onChange={onQueryChange}
        />
        <Button variant={btnVariant} type="submit">
          <i className="bi bi-search"></i>
        </Button>
        {/* {query && (
        <OverlayTrigger
          placement="bottom"
          delay={{ show: 200, hide: 200 }}
          overlay={<Tooltip id="button-tooltip">Clear query</Tooltip>}
        >
          <button
            className="btn btn-danger"
            type="button"
            onClick={onQueryClear}
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </OverlayTrigger>
      )} */}
      </div>
    </form>
  );
};

export default SearchInput;
