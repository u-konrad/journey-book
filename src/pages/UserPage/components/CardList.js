import { useState, Fragment, useEffect, useContext } from "react";
import useHttp from "../../../shared/hooks/http-hook";
import LoadingSpinner from "../../../shared/components/LoadingSpinner/LoadingSpinner";
import { AuthContext } from "../../../shared/context/auth-context";
import CustomModal from "../../../shared/components/CustomModal";
import { useDispatch } from "react-redux";
import { setAlertWithTimeout } from "../../../store/alert-actions";
import DeletedCard from "./DeletedCard";
import UserCard from "./UserCard";
import PostCard from "./PostCard";
import ExpCard from "./ExpCard";
import JourneyCard from "./JourneyCard";
import { useTranslation } from "react-i18next";



const CardList = (props) => {
  const [itemsList, setItemsList] = useState([]);
  const { fetchData, isLoading, addFav, removeFav, clearDeletedFav } =
    useHttp();
  const { token } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const dispatch = useDispatch();

  
  const { t } = useTranslation();

  const defaultModalText = {
    title: t('modal.deleteItemTitle'),
    text: t('modal.deleteItemText'),
  };
  const [modalText, setModalText] = useState(defaultModalText);


  let filteredList = itemsList;
  if (props.searchQuery) {
    try {
      filteredList = itemsList.filter((item) => {
        if (item.itemType !== "user") {
          return (
            item.title.match(RegExp(props.searchQuery, "i")) ||
            item.location.match(RegExp(props.searchQuery, "i")) ||
            item.content.match(RegExp(props.searchQuery, "i"))
          );
        } else {
          return item.username.match(RegExp(props.searchQuery, "i"));
        }
      });
    } catch (err) {
      console.log(err);
    }
  }

  const deleteHandler = (item) => {
    setItemToDelete(item);
    if (item.itemType === "journey") {
      setModalText({
        title: t('modal.deleteJourneyTitle'),
        text: t('modal.deleteJourneyText'),
      });
    } else {
      setModalText(defaultModalText);
    }
    setShowModal(true);
  };

  const addFavHandler = (item) => {
    addFav({ token, itemId: item._id, type: item.itemType });
  };

  const removeFavHandler = (item) => {
    removeFav({ token, itemId: item._id, type: item.itemType });
  };

  const clearDeletedHandler = (item) => {
    clearDeletedFav({ token, itemId: item._id, type: item.itemType });
  };

  const deleteItem = async (item) => {
    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL +
          `items/${item._id}?type=${item.itemType}`,
        {
          method: "DELETE",
          headers: { Authorization: "Bearer " + token },
        }
      );
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error);
      }

      dispatch(
        setAlertWithTimeout({
          alertType: "success",
          alertText: t('modal.deleteSuccess'),
        })
      );
      setItemsList((prev) =>
        prev.filter((listItem) => listItem._id !== item._id)
      );
    } catch (err) {
      dispatch(
        setAlertWithTimeout({
          alertType: "danger",
          alertText: err.message,
        })
      );
    }
  };

  const sortKey = props.favList ? "added" : "posted";
  const sortFunc = (a, b) => b[sortKey] - a[sortKey];

  const itemsToRender = filteredList.sort(sortFunc).map((item, index) => {
    if (!item.deleted) {
      switch (item.itemType) {
        case "post":
          return (
            <PostCard
              key={index}
              item={item}
              onDelete={() => deleteHandler(item)}
              onAddFav={() => addFavHandler(item)}
              onRemoveFav={() => removeFavHandler(item)}
            />
          );
        case "journey":
          return (
            <JourneyCard
              key={index}
              item={item}
              onDelete={() => deleteHandler(item)}
              onAddFav={() => addFavHandler(item)}
              onRemoveFav={() => removeFavHandler(item)}
            />
          );
        case "exp":
          return (
            <ExpCard
              key={index}
              item={item}
              onDelete={() => deleteHandler(item)}
              onAddFav={() => addFavHandler(item)}
              onRemoveFav={() => removeFavHandler(item)}
            />
          );
        case "user":
          return <UserCard key={index} item={item} />;
        default:
          return <div></div>;
      }
    } else {
      return (
        <DeletedCard
          key={index}
          item={item}
          onClear={() => clearDeletedHandler(item)}
        />
      );
    }
  });

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetchData(props.api);
        const { items } = response;
        let processedItems;
        if (props.favList) {
          processedItems = items.map((el) => {
            if (!el.deleted) {
              return { ...el.item, added: el.added };
            } else {
              return el;
            }
          });
        } else {
          processedItems = items;
        }
        setItemsList(processedItems);
      } catch (err) {}
    };

    fetchItems();
  }, [props.api, props.favList, fetchData]);

  const deleteItemModalProps = {
    type: "confirm",

    acceptBtnLabel: t('shared.delete'),
    acceptBtnType: "danger",
    cancelBtnType: "success",
    onAccept: () => {
      setShowModal(false);
      deleteItem(itemToDelete);
    },
    onCancel: () => {
      setShowModal(false);
      setItemToDelete(null);
    },
  };

  return (
    <Fragment>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div>
          <CustomModal
            show={showModal}
            {...deleteItemModalProps}
            {...modalText}
          />
          <div className="d-flex flex-column gap-3">
            {!!itemsToRender.length ? (
              itemsToRender
            ) : (
              <p className="ms-auto display-4 text-muted p-3">{t('user.noItems')}</p>
            )}
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default CardList;
