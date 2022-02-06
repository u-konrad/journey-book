import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const CheckButton = ({
  type,
  typeName,
  selected,
  onSelect,
  onUnselect = () => {},
}) => {
  const { t } = useTranslation();

  return (
    <div
      className="me-2 mb-2 tag-btn check-btn"
      style={{ position: "relative" }}
    >
      <OverlayTrigger
        placement="bottom"
        delay={{ show: 200, hide: 200 }}
        overlay={
          <Tooltip id="button-tooltip">
            {!selected ? t("shared.select") : t("shared.selected")}
          </Tooltip>
        }
      >
        <div>
          <input
            type="checkbox"
            className="btn-check"
            id={`btn-${type}`}
            autoComplete="off"
            onChange={() => {
              if (!selected) {
                onSelect(type);
              } else {
                onUnselect(type);
              }
            }}
            checked={selected}
          />

          <label
            className="btn btn-outline-primary btn-sm h-100"
            htmlFor={`btn-${type}`}
          >
            {typeName}
          </label>
        </div>
      </OverlayTrigger>
    </div>
  );
};

export default CheckButton;
