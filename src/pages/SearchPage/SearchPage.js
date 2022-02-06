import { useEffect, useState, useCallback, Fragment } from "react";
import { useLocation, useHistory } from "react-router-dom";
import SearchInput from "../../shared/components/SearchInput";
import { Card, Col } from "react-bootstrap";
import SearchPageItem from "./SearchPageItem";
import "./SearchPage.css";
import CheckButton from "./CheckButton";
import useHttp from "../../shared/hooks/http-hook";
import Pagination from "@mui/material/Pagination";
import categories from "../../shared/constants/categories";
import { useTranslation } from "react-i18next";

const itemsPerPage = 10;

const SearchPage = () => {
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [displayQuery, setDisplayQuery] = useState("");
  const [itemsList, setItemsList] = useState([]);
  const [selectedType, setSelectedType] = useState("journey");
  const [pagesNum, setPagesNum] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("");
  const history = useHistory();

  const { t } = useTranslation();

  const typeString = (type) => {
    switch (type) {
      case "post":
        return t("search.noPosts");
      case "journey":
        return t("search.noJourneys");
      case "exp":
        return t("search.noExps");
      default:
        return "";
    }
  };

  const { fetchData } = useHttp();

  const fetchQueriedData = useCallback(
    async ({ query, type, page = "", size = "" }) => {
      try {
        const response = await fetchData(
          `items/search?type=${type}&q=${query}&page=${page}&size=${size}`
        );
        return response;
      } catch (err) {}
    },
    [fetchData]
  );

  const sendQuery = useCallback(
    async (query, type, page) => {
      if (!query) return;

      const response = await fetchQueriedData({
        query,
        type: type,
        page: page,
        size: itemsPerPage,
      });

      if (!response) return;

      setPagesNum(Math.ceil(response.count / itemsPerPage));
      setItemsList(response.items);
      setDisplayQuery(query);
    },
    [fetchQueriedData]
  );

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get("query");
    const type = searchParams.get("type");

    if (type) {
      setSelectedType(type);
    }

    setCurrentPage(0);

    if (query && type) {
      sendQuery(query, type, 0);
      setQuery(query);
    }
  }, [location, sendQuery]);

  const selectTypeHandler = (type) => {
    history.push(`/search?type=${type}&query=${query}&page=0`);
  };

  const filteredList =
    selectedType !== "exp" || !selectedCategory
      ? itemsList
      : itemsList.filter((exp) => {
          if (!exp.category) return false;
          return exp.category === selectedCategory;
        });

  const itemsToRender = filteredList
    .sort((a, b) => b.posted - a.posted)
    .map((item, index) => {
      return <SearchPageItem item={item} key={index} />;
    });

  return (
    <Col lg={12} xl={10} xxl={8} className="me-auto ms-auto mb-5 mt-5">
      <Card className="my-4 py-3">
        <div>
          <SearchInput
            query={query}
            formClassName="ms-5 m-3 col-lg-8"
            onQueryChange={(event) => setQuery(event.target.value)}
            onQuerySubmit={(event) => {
              event.preventDefault();
              sendQuery(query, selectedType, 0);
            }}
          />

          <div className="d-flex ms-5">
            <CheckButton
              type="journey"
              typeName={t("user.journeys")}
              onSelect={selectTypeHandler}
              selected={selectedType === "journey"}
            />
            <CheckButton
              type="post"
              typeName={t("user.posts")}
              onSelect={selectTypeHandler}
              selected={selectedType === "post"}
            />
            <CheckButton
              type="exp"
              typeName={t("user.exps")}
              onSelect={selectTypeHandler}
              selected={selectedType === "exp"}
            />
          </div>
          {selectedType === "exp" && (
            <div className="col-8 col-sm-4 h-50 ms-5 mt-2 d-flex align-items-center">
              <span className="me-2">
                <i className="bi bi-filter"> </i>
              </span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{ fontSize: "14px" }}
                type="select"
                className="form-control"
              >
                <option value="">{t("add.selectCategory")}</option>
                {categories.map((item, index) => (
                  <option key={index} value={item.name}>
                    {t(`categories.${item.name.toLocaleLowerCase()}`)}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </Card>
      {itemsToRender.length ? (
        <Fragment>
          <p className="lead text-muted">
            {t("search.results")} <strong>{displayQuery}</strong>
          </p>

          <div className="d-flex justify-content-center">
            <Pagination
              className="mb-3"
              siblingCount={0}
              boundaryCount={1}
              count={pagesNum}
              defaultPage={1}
              page={currentPage + 1}
              onChange={(e, page) => {
                setCurrentPage(page - 1);
                sendQuery(query, selectedType, page - 1);
              }}
            />
          </div>
          <div>{itemsToRender}</div>
        </Fragment>
      ) : !!displayQuery ? (
        <p className="display-4 text-muted">
          {" "}
          {t("search.noResults", { type: typeString(selectedType) })}
          <strong>{displayQuery}</strong>
        </p>
      ) : (
        <p className="display-4 text-muted">{t("search.placeholder")}</p>
      )}
    </Col>
  );
};

export default SearchPage;
