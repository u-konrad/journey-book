import React, { useEffect } from "react"
import { CSSTransition } from "react-transition-group"
import { useSelector } from "react-redux"
import { useState } from "react"

const animationTiming = {
  enter: 500,
  exit: 400,
}

const Notification = () => {

  const type = useSelector((state) => state.alert.alertType);
  const text = useSelector((state) => state.alert.alertText);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (type === "none") {
      setShow(false);
    } else {
      setShow(true);
    }
  }, [type]);

  return (
    <CSSTransition
      mountOnEnter
      unmountOnExit
      in={show}
      timeout={animationTiming}
      classNames={{
        enter: "",
        enterActive: "showing",
        exit: "",
        exitActive: "hiding",
      }}
    >
      <div className={`notification ${type}`}>
        <span>{text}</span>
      </div>
    </CSSTransition>
  )
}


export default Notification
