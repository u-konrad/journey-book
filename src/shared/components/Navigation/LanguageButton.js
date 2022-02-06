import React from "react";
import { useTranslation } from "react-i18next";
import { ReactComponent as FlagPL } from "../../../svg/Flag_of_Poland.svg";
import { ReactComponent as FlagUK } from "../../../svg/flag_uk.svg";


const LanguageButton = () => {
  const { i18n } = useTranslation();

  function changeLanguage(lang) {
    i18n.changeLanguage(lang);
  }

  const img = "../../";

  const lang = i18n.language;
  return (
    <div className="lang-container mx-2">
      {lang === "pl" ? (
        <button className="btn btn-outline-dark btn-lang" onClick={() => changeLanguage("en")}>
          EN <FlagUK style={{ height: "100%", width: "30px",marginLeft:'0.25rem'}} alt='english language' />
        </button>
      ) : (
        <button className="btn btn-outline-dark btn-lang" onClick={() => changeLanguage("pl")}>
          PL <FlagPL style={{ height: "100%", width: "30px",marginLeft:'0.25rem' }} alt='polish language' />
        </button>
      )}
    </div>
  );
};

export default LanguageButton;
