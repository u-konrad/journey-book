import React from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.min.css"
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store";
import { Suspense } from "react";
import LoadingSpinner from "./shared/components/LoadingSpinner/LoadingSpinner";
import './i18n/config';
import ErrorBoundary from './shared/ErrorBoundary'



ReactDOM.render(
  <React.StrictMode>
    <ErrorBoundary>
    <Provider store={store}>
      <BrowserRouter>
      <Suspense fallback={<LoadingSpinner asOverlay/>}>
        <App />
        </Suspense>
      </BrowserRouter>
    </Provider>
    </ErrorBoundary>
  </React.StrictMode>,
  document.getElementById("root")
);
