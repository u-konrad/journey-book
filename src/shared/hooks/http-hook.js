import { useState, useRef, useEffect } from "react";
import { useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import { setAlertWithTimeout } from "../../store/alert-actions";
import { favActions } from "../../store/store";
import { useTranslation } from "react-i18next";

const fetchDataTimeout = 20000;
const sendDataTimeout = 8000;

const getFavArray = (type) => {
  return "fav" + type[0].toUpperCase() + type.slice(1) + "s";
};

const useHttp = () => {
  const dispatch = useDispatch();
  const url = process.env.REACT_APP_BACKEND_URL;
  const [isLoading, setLoading] = useState(false);
  const activeHttpRequests = useRef([]);

  const {i18n} =useTranslation();
  const lang= i18n.language

  const fetchWithTimeout = useCallback(async (resource, options = {}) => {
    const { timeout = sendDataTimeout } = options;

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    const response = await fetch(resource, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  }, []);

  const sendData = useCallback(
    async ({
      method = "POST",
      api = "items/new",
      type='null',
      body = null,
      headers,
      successMsg = "Successfully created item!",
    }) => {
      setLoading(true);
      try {
        const response = await fetchWithTimeout(url + `${api}?lang=${lang}&type=${type}`, {
          method: method,
          body: body,
          headers: headers,
        });
        const responseData = await response.json();
        if (!response.ok) {
          throw new Error(responseData.error);
        }

        dispatch(
          setAlertWithTimeout({
            alertType: "success",
            alertText: successMsg,
          })
        );
        setLoading(false);
        return responseData;
      } catch (err) {
        setLoading(false);
        dispatch(
          setAlertWithTimeout({
            alertType: "danger",
            alertText: err.message,
          })
        );
        throw err;
      }
    },
    [dispatch, url, fetchWithTimeout,lang]
  );

  const sendItem = useCallback(
    async ({ method, api, type, body, headers }) => {
      return await sendData({ method, api, type, body, headers });
    },
    [sendData]
  );

  const deleteItem = useCallback(
    async (item, token) => {
      try {
        return await sendData({
          api: `items/${item._id}`,
          method: "DELETE",
          headers: { Authorization: "Bearer " + token },
          type: item.itemType,
          successMsg: "Successfully deleted item!",
        });
      } catch (err) {}
    },
    [sendData]
  );

  const addFav = useCallback(
    async ({ itemId, token, type }) => {
      const arrayName = getFavArray(type);
      try {
        await sendData({
          method: "POST",
          api: "favorites",
          type,
          body: JSON.stringify({ itemId }),
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          successMsg: "Successfully added item to favorites.",
        });
        dispatch(favActions.addItem({ itemType: arrayName, item: itemId }));
      } catch (err) {}
    },
    [dispatch, sendData]
  );

  const removeFav = useCallback(
    async ({ itemId, token, type }) => {
      const arrayName = getFavArray(type);
      try {
        await sendData({
          method: "DELETE",
          api: "favorites",
          type,
          body: JSON.stringify({ itemId }),
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          successMsg: "Successfully removed item from favorites.",
        });
        dispatch(favActions.removeItem({ itemType: arrayName, item: itemId }));
      } catch (err) {}
    },
    [dispatch, sendData]
  );

  const clearDeletedFav = useCallback(
    async ({ itemId, token, type }) => {
      const arrayName = getFavArray(type);
      try {
        await sendData({
          method: "DELETE",
          api: "favorites/clear",
          type,
          body: JSON.stringify({ itemId }),
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          successMsg: "Successfully cleared item from favorites.",
        });
        dispatch(favActions.removeItem({ itemType: arrayName, item: itemId }));
      } catch (err) {}
    },
    [dispatch, sendData]
  );

  const fetchData = useCallback(
    async (api, fetchOptions = {}) => {
      setLoading(true);

      const httpAbortCtrl = new AbortController();
      activeHttpRequests.current.push(httpAbortCtrl);

      try {
        const timeoutId = setTimeout(
          () => httpAbortCtrl.abort(),
          fetchDataTimeout
        );

        const response = await fetch(url + api, {
          ...fetchOptions,
          signal: httpAbortCtrl.signal,
        });
        clearTimeout(timeoutId);

        const responseData = await response.json();

        activeHttpRequests.current = activeHttpRequests.current.filter(
          (reqCtrl) => reqCtrl !== httpAbortCtrl
        );

        if (!response.ok) {
          throw new Error(responseData.error);
        }

        setLoading(false);
        return responseData;
      } catch (err) {
        setLoading(false);
        dispatch(
          setAlertWithTimeout({
            alertType: "danger",
            alertText: err.message,
          })
        );
        throw err;
      }
    },
    [dispatch, url]
  );

  const fetchPhotos = useCallback(
    async (api, fetchOptions = {}) => {
      setLoading(true);

      const httpAbortCtrl = new AbortController();
      activeHttpRequests.current.push(httpAbortCtrl);

      try {
        const response = await fetch(
          "https://api.unsplash.com/search/photos" + api,
          {
            ...fetchOptions,
            signal: httpAbortCtrl.signal,
          }
        );

        const responseData = await response.json();

        activeHttpRequests.current = activeHttpRequests.current.filter(
          (reqCtrl) => reqCtrl !== httpAbortCtrl
        );

        if (!response.ok) {
          throw new Error(responseData.error);
        }

        setLoading(false);
        return responseData;
      } catch (err) {
        setLoading(false);
        dispatch(
          setAlertWithTimeout({
            alertType: "danger",
            alertText: err.message,
          })
        );
        throw err;
      }
    },
    [dispatch]
  );

  useEffect(() => {
    return () => {
      activeHttpRequests.current.forEach((abortCtrl) => abortCtrl.abort());
    };
  }, []);

  return {
    sendItem,
    fetchData,
    addFav,
    removeFav,
    isLoading,
    clearDeletedFav,
    fetchPhotos,
    deleteItem,
  };
};

export default useHttp;
