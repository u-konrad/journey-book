import { Formik, Form } from "formik";
import * as Yup from "yup";
import InputField from "../../shared/components/InputField";
import { useHistory } from "react-router";
import FormWrapper from "../../shared/components/FormWrapper";
import { Button } from "react-bootstrap";
import useHttp from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import { Fragment, useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import LocationInput from "../../shared/components/LocationInput/LocationInput";
import LoadingSpinner from "../../shared/components/LoadingSpinner/LoadingSpinner";
import ImagePicker from "../../shared/components/ImagePicker/ImagePicker";
import { useTranslation } from "react-i18next";

const AddPost = ({ mode }) => {
  const history = useHistory();
  const { sendItem, fetchData } = useHttp();
  const { itemId, journeyId } = useParams();
  const { userId, token } = useContext(AuthContext);
  const { t } = useTranslation();

  const [existingItem, setExistingItem] = useState(null);
  const [selectedJourney, setSelectedJourney] = useState(null);
  const [journeys, setJourneys] = useState([]);

  const [newPhoto, setNewPhoto] = useState(
    JSON.stringify({ path: "", filename: "" })
  );
  const [coords, setCoords] = useState();

  const pageTitle =
    mode === "edit"
      ? t('add.editPost')
      : !selectedJourney
      ? t('shared.newPost')
      : t('add.addPost');

  const schema = Yup.object({
    title: Yup.string()
      .required(t('add.titleRequired'))
      .min(3, t('add.titleMin')),
    content: Yup.string().required(t('add.contentRequired')),
  });

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
        const response = await fetchData(`items/${itemId}?type=post`);
        const { item } = response;
        setExistingItem(item);

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
  }, [fetchData, itemId, mode, userId]);

  useEffect(() => {
    if (journeys.length && (journeyId || existingItem?.journey)) {
      const jid = journeyId ? journeyId : existingItem.journey;
      setSelectedJourney(journeys.find((item) => item._id === jid));
    }
  }, [journeys, existingItem, journeyId]);

  const submitHandler = async (values) => {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("location", values.location);
    formData.append("content", values.content);
    formData.append("coordinates", coords);

    if (values.journey) {
      formData.append("journey", values.journey);
    } else if (selectedJourney) {
      formData.append("journey", selectedJourney._id);
    }

    formData.append("image", newPhoto);

    const method = mode === "edit" ? "PATCH" : "POST";
    const api = mode === "edit" ? `items/${itemId}` : "items/new";

    try {
      await sendItem({
        api: api,
        method: method,
        type: "post",
        body: formData,
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      history.goBack();
    } catch (err) {
      console.log(err);
    }
  };

  let initFormValues = { title: "", location: "", content: "", journey: "" };
  if (mode === "edit" && existingItem) {
    initFormValues = {
      title: existingItem.title,
      location: existingItem.location || "",
      content: existingItem.content,
      journey: existingItem.journey?._id || "",
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
              <InputField name="title" type="text" label={t('add.title')} {...props} />
              <LocationInput {...props} setCoords={setCoords} coords={coords} />
              <InputField
                name="content"
                type="text"
                as="textarea"
                label={t('add.content')}
                rows={7}
                {...props}
              />
              {!selectedJourney ? (
                <InputField name="journey" type="text" label={t('shared.journey')} as="select" {...props}>
                  <option value="" default>
                  {t('add.selectJourney')}
                  </option>
                  {journeys.map((item, index) => (
                    <option key={index} value={item._id}>
                      {item.title}
                    </option>
                  ))}
                </InputField>
              ) : (
                <Fragment>
                  <label className="form-label ">{t('shared.journey')}</label>
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
              <div className="w-100 mt-3 d-flex justify-content-end">
                <Button type="submit" variant="success">
                {t('add.submit')}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      )}
    </FormWrapper>
  );
};

export default AddPost;
