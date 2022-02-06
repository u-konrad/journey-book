import { Card} from "react-bootstrap";

const FormWrapper = ({ title, journey = "", children }) => {
  return (
    <div className="col-xxl-8 col-12 mx-auto my-5 ">
      {!journey ? (
        <h1 className="mb-3 align-self-start">{title}</h1>
      ) : (
        <h1 className="mb-3 align-self-start">
          {title}
          <span className="text-muted">{journey}</span>
        </h1>
      )}
      <Card className="shadow p-3">
        <Card.Body>{children}</Card.Body>
      </Card>
    </div>
  );
};

export default FormWrapper;
