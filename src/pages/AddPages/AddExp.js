import { Formik, Form } from "formik";
import * as Yup from "yup";
import InputField from "../../shared/components/InputField";
import { useHistory } from "react-router";
import FormWrapper from "../../shared/components/FormWrapper";
import { Button } from "react-bootstrap";
import useHttp from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import { useContext, useState, useEffect, Fragment } from "react";
import { useParams } from "react-router";
import Rating from "@mui/material/Rating";
import LocationInput from "../../shared/components/LocationInput/LocationInput";
import LoadingSpinner from "../../shared/components/LoadingSpinner/LoadingSpinner";
import ImagePicker from "../../shared/components/ImagePicker/ImagePicker";
import categories from "../../shared/constants/categories";
import { useTranslation } from "react-i18next";

const AddExp = ({ mode }) => {
  const history = useHistory();
  const { sendItem, fetchData } = useHttp();
  const { userId, token } = useContext(AuthContext);
  const { journeyId, itemId } = useParams();

  const { t } = useTranslation();

  const [rating, setRating] = useState(0);
  const [existingItem, setExistingItem] = useState(null);
  const [selectedJourney, setSelectedJourney] = useState(null);
  const [journeys, setJourneys] = useState([]);

  const [newPhoto, setNewPhoto] = useState(
    JSON.stringify({ path: "", filename: "" })
  );
  const [coords, setCoords] = useState();

  const pageTitle =
    mode === "edit"
      ? t("add.editExp")
      : !selectedJourney
      ? t("shared.newExp")
      : t("add.addExp");

  useEffect(() => {
    const fetchJourneys = async () => {
      try {
        const response = await fetchData(`users/${userId}/items?type=journey`);
        const { items } = response;
        setJourneys(items);
      } catch (err) {}
    };

    const fetchItem = async () => {
      try {
        const response = await fetchData(`items/${itemId}?type=exp`);
        const { item } = response;
        setExistingItem(item);
        setRating(item.rating);

        if (item.coordinates) {
          setCoords(item.coordinates);
        }
      } catch (err) {}
    };

    if (mode === "edit") {
      fetchItem().then(fetchJourneys());
    } else {
      fetchJourneys();
    }
  }, [itemId, userId, fetchData, mode]);

  useEffect(() => {
    if (journeys.length && (journeyId || existingItem?.journey)) {
      const jid = journeyId ? journeyId : existingItem.journey;
      setSelectedJourney(journeys.find((item) => item._id === jid));
    }
  }, [journeys, existingItem, journeyId]);

  const schema = Yup.object({
    title: Yup.string()
      .required(t("add.titleRequired"))
      .min(3, t("add.titleMin")),
    location: Yup.string(),
    content: Yup.string().required(t("add.contentRequired")),
    rating: Yup.number(),
  });

  const submitHandler = async (values) => {
    console.log(values);
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("location", values.location);
    formData.append("content", values.content);
    formData.append("rating", rating ?? 0);
    formData.append("category", values.category);
    formData.append("coordinates", coords);

    if (values.journey) {
      formData.append("journey", values.journey);
    } else if (selectedJourney) {
      formData.append("journey", selectedJourney._id);
    }

    formData.append("image", newPhoto);

    const method = mode === "edit" ? "PATCH" : "POST";
    const api = mode === "edit" ? `items/${itemId}` : "items/new";

    await sendItem({
      api: api,
      method: method,
      type: "exp",
      body: formData,
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    history.goBack();
  };

  let initFormValues = {
    title: "",
    location: "",
    content: "",
    journey: "",
    category: "",
  };
  if (mode === "edit" && existingItem) {
    initFormValues = {
      title: existingItem.title,
      location: existingItem.location || "",
      content: existingItem.content,
      journey: existingItem.journey?._id || "",
      category: existingItem.category || "",
    };
  }

  return (
    <FormWrapper
      journey={mode !== "edit" ? selectedJourney?.title : ""}
      title={pageTitle}
    >
      {mode === "edit" && !existingItem && <LoadingSpinner />}
      {(mode !== "edit" || (mode === "edit" && !!existingItem)) && (
        <Formik
          validationSchema={schema}
          onSubmit={submitHandler}
          initialValues={initFormValues}
        >
          {(props) => (
            <Form>
              <InputField
                name="title"
                type="text"
                label={t("add.title")}
                {...props}
              />
              <LocationInput {...props} setCoords={setCoords} coords={coords} />
              <InputField
                name="content"
                type="text"
                as="textarea"
                rows="5"
                label={t("add.content")}
                {...props}
              />
              <div className="mb-3 d-flex flex-column">
                <label className="form-label " htmlFor="rating">
                  {t("add.rating")}
                </label>
                <Rating
                  name="rating"
                  value={rating}
                  onChange={(event, newValue) => {
                    setRating(newValue);
                  }}
                />
              </div>
              <InputField
                name="category"
                type="text"
                label={t("add.category")}
                as="select"
                {...props}
              >
                <option value="">{t("add.selectCategory")}</option>
                {categories.map((item, index) => (
                  <option key={index} value={item.name}>
                    {t(`categories.${item.name.toLocaleLowerCase()}`)}
                  </option>
                ))}
              </InputField>
              {!selectedJourney ? (
                <InputField
                  name="journey"
                  type="text"
                  label={t("shared.journey")}
                  as="select"
                  {...props}
                >
                  <option value="" default>
                    {t("add.selectJourney")}
                  </option>
                  {journeys.map((item, index) => (
                    <option key={index} value={item._id}>
                      {item.title}
                    </option>
                  ))}
                </InputField>
              ) : (
                <Fragment>
                  <label className="form-label ">{t("shared.journey")}</label>
                  <div className="form-control mb-3 text-muted bg-light">
                    {selectedJourney.title}
                  </div>
                </Fragment>
              )}

              <ImagePicker
                existingPhoto={existingItem?.image}
                onNewPhoto={setNewPhoto}
                proposedQuery={props.values.title}
              />
              <div className="w-100 d-flex justify-content-end">
                <Button type="submit" variant="outline-success">
                  {t("add.submit")}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      )}
    </FormWrapper>
  );
};

export default AddExp;
