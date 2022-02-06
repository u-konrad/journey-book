import { useState, useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { userActions } from "../../store/store";

let logoutTimer;

export const useAuth = () => {
  const [token, setToken] = useState(false);
  const [tokenExpirationDate, setTokenExpirationDate] = useState();
  const [userId, setUserId] = useState(false);
  const [username, setUsername] = useState(false);
  const [loginState, setLoginState] = useState("pending");
  const dispatch = useDispatch();

  const login = useCallback(
    ({ userId, token, username, expirationDate = null }) => {
      setToken(token);
      setUserId(userId);
      setUsername(username);
      setLoginState("completed");
      const tokenExpirationDate =
        expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60 * 10);
      setTokenExpirationDate(tokenExpirationDate);
      localStorage.setItem(
        "userData",
        JSON.stringify({
          userId: userId,
          username: username,
          token: token,
          expiration: tokenExpirationDate.toISOString(),
        })
      );
    },
    []
  );

  const logout = useCallback(() => {
    setToken(null);
    setTokenExpirationDate(null);
    setUserId(null);
    setUsername(null);
    localStorage.removeItem("userData");
    dispatch(userActions.clearUser())
  }, [dispatch]);

  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime =
        tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      login({
        ...storedData,
        expirationDate: new Date(storedData.expiration),
      });
    } else {
      setLoginState("completed");
    }
  }, [login]);

  return { token, login, logout, userId, username, loginState };
};
