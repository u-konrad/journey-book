import { useState, useEffect, useCallback, createRef } from "react";
import SearchInput from "../../shared/components/SearchInput";
import useHttp from "../../shared/hooks/http-hook";
import { useHistory } from "react-router-dom";
import "./HomePage.css";
import ItemCard from "./ItemCard";
import LatestItems from "./LatestItems";
import { useTranslation } from "react-i18next";

const HomePage = () => {
  const [query, setQuery] = useState("");
  const [postList, setPostList] = useState([]);
  const [journeyList, setJourneyList] = useState([]);
  const [expList, setExpList] = useState([]);
  const { fetchData } = useHttp();
  const { t } = useTranslation();

  const history = useHistory();

  const postRef = createRef();
  const journeyRef = createRef();
  const expRef = createRef();

  const fetchLatestData = useCallback(
    async ({ type, page = "", size = "" }) => {
      try {
        const response = await fetchData(
          `items?type=${type}&page=${page}&size=${size}`
        );
        return response.items;
      } catch (err) {}
    },
    [fetchData]
  );



  useEffect(() => {
    fetchLatestData({ type: "post", page: 0, size: 18 }).then((items) =>
      setPostList(items)
    );

    fetchLatestData({ type: "journey", page: 0, size: 6 }).then((items) =>
      setJourneyList(items)
    );
    fetchLatestData({ type: "exp", page: 0, size: 12 }).then((items) =>
      setExpList(items)
    );
  }, [fetchLatestData]);


  let postsToRender;
  if (postList) {
    postsToRender = postList.map((item, index) => (
      <ItemCard item={item} key={index} />
    ));
  }

  let journeysToRender;
  if (journeyList) {
    journeysToRender = journeyList.map((item, index) => (
      <ItemCard item={item} key={index} />
    ));
  }

  let expsToRender;
  if (expList) {
    expsToRender = expList.map((item, index) => (
      <ItemCard item={item} key={index} />
    ));
  }

  return (
    <div className="pt-3  mb-5">
      <div className="position-relative">
        <img
          className="home-page__hero rounded shadow"
          src="https://res.cloudinary.com/dgemkl9rs/image/upload/v1643988778/TravelBlog/home_uq5rkc.jpg"
          alt="Empty journal waiting to be filled"
        />
        <SearchInput
          formClassName="position-absolute top-50 start-50 translate-middle search-input"
          btnVariant="dark"
          fontSize="20px"
          placeholder={t('home.search')}
          query={query}
          onQueryChange={(event) => setQuery(event.target.value)}
          onQuerySubmit={(event) => {
            event.preventDefault();
            history.push(`/search?type=journey&query=${query}`);
          }}
          onQueryClear={() => {
            setQuery("");
          }}
        />
      </div>

      <LatestItems
        title={t("home.title1")}
        subtitle={t("home.subtitle1")}
        items={journeysToRender}
      />
      <LatestItems
        title={t("home.title2")}
        subtitle={t("home.subtitle2")}
        items={postsToRender}
      />
      <LatestItems
        title={t("home.title3")}
        subtitle={t("home.subtitle3")}
        items={expsToRender}
      />
    </div>
  );
};

export default HomePage;
