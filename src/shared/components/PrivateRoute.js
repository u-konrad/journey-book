import { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { AuthContext } from "../context/auth-context";
import LoadingSpinner from "./LoadingSpinner/LoadingSpinner";
import { useDispatch } from "react-redux";
import { setAlertWithTimeout } from "../../store/alert-actions";
import { useTranslation } from "react-i18next";

function PrivateRoute({ children, ...rest }) {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { isLoggedIn, loginState } = useContext(AuthContext);

  if (!isLoggedIn && loginState !== "pending") {
    dispatch(
      setAlertWithTimeout({
        alertType: "warning",
        alertText: t("shared.notLoggedIn"),
      })
    );
  }

  return (
    <Route
      {...rest}
      render={({ location }) =>
        loginState === "pending" ? (
          <LoadingSpinner />
        ) : isLoggedIn ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}

export default PrivateRoute;
