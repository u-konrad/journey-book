import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";

const ButtonTooltip = ({
  tooltip,
  children,
  onClick,
  variant = "primary",
  type = "button",
  className,
  size='',
  style
}) => {
  return (
    <OverlayTrigger
      placement="bottom"
      delay={{ show: 200, hide: 200 }}
      overlay={<Tooltip id="button-tooltip">{tooltip}</Tooltip>}
    >
      <Button size={size} style={style} className={className} type={type} variant={variant} onClick={onClick}>
        {children}
      </Button>
    </OverlayTrigger>
  );
};

export default ButtonTooltip;
