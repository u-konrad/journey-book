import { alertActions } from "./store";

export const setAlertWithTimeout = (alert) => {
    return (dispatch) => {
      dispatch(alertActions.setAlert(alert));
  
      setTimeout(() => {
        dispatch(alertActions.cancelAlert());
      }, 5000);
    };
  };