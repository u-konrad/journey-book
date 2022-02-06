import { Card } from "react-bootstrap";

const DeletedCard = ({ item, onClear }) => {
  return (
    <Card className="shadow">
      <Card.Body>
        <Card.Text>
          This {item.itemType === "exp" ? "experience" : item.itemType} has been
          deleted by its author!
        </Card.Text>
      </Card.Body>
      <Card.Footer>
        {" "}
        <button className="btn btn-sm btn-danger" onClick={onClear}>
          <i className="bi bi-trash"></i>
        </button>
      </Card.Footer>
    </Card>
  );
};

export default DeletedCard;
