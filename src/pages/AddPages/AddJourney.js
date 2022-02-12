import { Formik, Form } from "formik";
import * as Yup from "yup";
import InputField from "../../shared/components/InputField";
import { useHistory, useParams } from "react-router";
import FormWrapper from "../../shared/components/FormWrapper";
import { Button } from "react-bootstrap";
import useHttp from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import { useContext, useState, useEffect } from "react";
import LocationInput from "../../shared/components/LocationInput/LocationInput";
import LoadingSpinner from "../../shared/components/LoadingSpinner/LoadingSpinner";
import ImagePicker from "../../shared/components/ImagePicker/ImagePicker";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import enLocale from "date-fns/locale/en-US";
import plLocale from "date-fns/locale/pl";
import DatePicker from "@mui/lab/DatePicker";
import Box from "@mui/material/Box";
import { useTranslation } from "react-i18next";

const AddJourney = ({ mode }) => {
  const history = useHistory();
  const { sendItem, fetchData } = useHttp();
  const { token } = useContext(AuthContext);
  const { itemId } = useParams();

  const { t, i18n } = useTranslation();

  const [existingItem, setExistingItem] = useState(null);
  const [newPhoto, setNewPhoto] = useState(
    JSON.stringify({ path: "", filename: "" })
  );
  const [coords, setCoords] = useState();
  const [date, setDate] = useState();

  const pageTitle =
    mode === "edit" ? t("add.editJourney") : t("shared.newJourney");

  const lang = i18n.language;

  const localeMap = {
    en: enLocale,
    pl: plLocale,
  };

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await fetchData(`items/${itemId}?type=journey`);
        const { item } = response;
        setExistingItem(item);

        if (item.coordinates) {
          setCoords(item.coordinates);
        }
        if (item.when) {
          setDate(item.when);
        }
      } catch (err) {}
    };

    if (mode === "edit") {
      fetchItem();
    }
  }, [fetchData, itemId, mode]);

  const schema = Yup.object({
    title: Yup.string()
      .required(t("add.titleRequired"))
      .min(3, t("add.titleMin")),
    location: Yup.string(),
    content: Yup.string().required(t("add.descriptionRequired")),
  });

  const submitHandler = async (values) => {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("location", values.location);
    formData.append("coordinates", coords);
    formData.append("content", values.content);
    formData.append("image", newPhoto);

    var dateOptions = { month: "long", year: "numeric" };
    const dateString = new Intl.DateTimeFormat(lang, dateOptions).format(date);
    formData.append("when", dateString)


    const method = mode === "edit" ? "PATCH" : "POST";
    const api = mode === "edit" ? `items/${itemId}` : "items/new";

    await sendItem({
      api: api,
      method: method,
      type: "journey",
      body: formData,
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    history.goBack();
  };

  let initFormValues = { title: "", location: "", content: "", journey: "" };
  if (mode === "edit" && existingItem) {
    initFormValues = {
      title: existingItem.title,
      location: existingItem?.location || "",
      content: existingItem.content,
      when: existingItem?.when || "",
    };
  }

  return (
    <FormWrapper title={pageTitle}>
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
              <LocalizationProvider
                dateAdapter={AdapterDateFns}
                locale={localeMap[lang]}
              >
                <div className="mb-3">
                  <label className="form-label ">{t("add.when")}</label>
                  <DatePicker
                    views={["year", "month"]}
                    label="Date"
                    value={date}
                    onChange={(newValue) => {
                      setDate(newValue);
                    }}
                    renderInput={({ inputRef, inputProps, InputProps }) => (
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <input
                          className="form-control"
                          ref={inputRef}
                          {...inputProps}
                        />
                        {InputProps?.endAdornment}
                      </Box>
                    )}
                  />
                </div>
              </LocalizationProvider>
              <InputField
                name="content"
                label={t("add.description")}
                type="text"
                as="textarea"
                rows="5"
                {...props}
              />
              <ImagePicker
                existingPhoto={existingItem?.image}
                onNewPhoto={setNewPhoto}
                proposedQuery={props.values.title}
              />

              <div className="w-100 d-flex justify-content-end">
                <Button type="submit" variant="success">
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

export default AddJourney;
