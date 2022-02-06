import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Toast, ToastContainer } from "react-bootstrap";

const CustomToast = () => {
  const [show, setShow] = useState(false);
  const alertType = useSelector((state) => state.alert.alertType);
  const alertText = useSelector((state) => state.alert.alertText);

  useEffect(() => {
    if (alertType === "none") {
      setShow(false);
    } else {
      setShow(true);
    }
  }, [alertType]);

  return (
      <ToastContainer className="p-5"  position='top-center' style={{zIndex:99}}>
    <Toast show={show} bg={alertType} onClose={() => setShow(false)}>
      <Toast.Header>
        <strong className="me-auto">{alertText}</strong>
      </Toast.Header>
      {/* <Toast.Body></Toast.Body> */}
    </Toast>
    </ToastContainer>
  );
};

export default CustomToast;
