import { Formik, Form } from "formik";
import * as Yup from "yup";
import InputField from "../../shared/components/InputField";
import { useHistory, useLocation } from "react-router";
import FormWrapper from "../../shared/components/FormWrapper";
import { Button } from "react-bootstrap";
import { useContext } from "react";
import { AuthContext } from "../../shared/context/auth-context";
import { setAlertWithTimeout } from "../../store/alert-actions";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

const LoginPage = () => {
  const history = useHistory();
  const location = useLocation();
  let { from } = location.state || { from: { pathname: "/" } };
  const { login } = useContext(AuthContext);
  const dispatch = useDispatch();

  const { t } = useTranslation();

  const schema = Yup.object({
    username: Yup.string()
      .required(t("auth.usernameRequired"))
      .min(3, t("auth.usernameMin")),
    password: Yup.string().required(t('auth.passwordRequired')),
  });

  const submitHandler = async (values) => {
    const user = { ...values };

    const sendUser = async (user) => {
      try {
        const response = await fetch(
          process.env.REACT_APP_BACKEND_URL + "users/login",
          {
            method: "POST",
            body: JSON.stringify(user),
            headers: { "Content-Type": "application/json" },
          }
        );
        const responseData = await response.json();
        if (!response.ok) {
          throw new Error(responseData.error);
        }

        login(responseData);
        dispatch(
          setAlertWithTimeout({
            alertType: "success",
            alertText: t("auth.loginMsg"),
          })
        );
        history.replace(from);
      } catch (err) {
        dispatch(
          setAlertWithTimeout({
            alertType: "danger",
            alertText: err.message,
          })
        );
      }
    };
    sendUser(user);
  };

  return (
    <FormWrapper title={t('auth.loginTitle')}>
      <Formik
        validationSchema={schema}
        onSubmit={submitHandler}
        initialValues={{ username: "", password: "" }}
      >
        {(props) => (
          <Form>
            <InputField name="username" label={t('auth.login')} type="text" {...props} />
            <InputField name="password" label={t('auth.password')}  type="password" {...props} />
            <div className="w-100 d-flex justify-content-end">
              <Button type="submit" variant="outline-success">
                {t('shared.login')}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </FormWrapper>
  );
};

export default LoginPage;
