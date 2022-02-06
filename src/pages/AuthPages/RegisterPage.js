import { Formik, Form } from "formik";
import * as Yup from "yup";
import InputField from "../../shared/components/InputField";
import { useHistory } from "react-router";
import FormWrapper from "../../shared/components/FormWrapper";
import { Button } from "react-bootstrap";
import { AuthContext } from "../../shared/context/auth-context";
import { useContext } from "react";
import { useDispatch } from "react-redux";
import { setAlertWithTimeout } from "../../store/alert-actions";
import { useTranslation } from "react-i18next";
import useHttp from "../../shared/hooks/http-hook";

const RegisterPage = () => {
  const history = useHistory();
  const { login } = useContext(AuthContext);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { sendItem } = useHttp();

  const schema = Yup.object({
    username: Yup.string()
      .required(t("auth.usernameRequired"))
      .min(3, t("auth.usernameMin")),
    email: Yup.string()
      .required(t("auth.emailRequired"))
      .email(t("auth.emailMin")),
    password: Yup.string()
      .required(t("auth.passwordRequired"))
      .min(6, t("auth.passwordMin")),
  });

  const submitHandler = async (values) => {
    const user = { ...values };

    const response = await sendItem({
      api: "users/register",
      method: "POST",
      body: JSON.stringify(user),
      headers: { "Content-Type": "application/json" },
      successMsg: t("auth.registerMsg"),
    });

    login(response);
    history.push("/");
  };

  return (
    <FormWrapper title={t("auth.registerTitle")}>
      <Formik
        validationSchema={schema}
        onSubmit={submitHandler}
        initialValues={{ username: "", password: "", email: "" }}
      >
        {(props) => (
          <Form>
            <InputField
              name="username"
              label={t("auth.login")}
              type="text"
              {...props}
            />
            <InputField name="email" type="email" {...props} />
            <InputField
              name="password"
              label={t("auth.password")}
              type="password"
              {...props}
            />
            <div className="w-100 d-flex justify-content-end">
              <Button type="submit" variant="outline-success">
                {t("shared.register")}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </FormWrapper>
  );
};

export default RegisterPage;
