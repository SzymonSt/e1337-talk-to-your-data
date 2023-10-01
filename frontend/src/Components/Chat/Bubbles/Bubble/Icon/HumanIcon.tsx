import React, { useContext } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import styles from "./Icon.module.css";
import { languageContext } from "../../../../../context/LanguageContext";

const HumanIcon = () => {
  const langCtx = useContext(languageContext);
  return (
    <div className={styles.Icon}>
      <FontAwesomeIcon icon={faUser} />
      <h6>{langCtx.language === "ENG" ? "You" : "Ty"}</h6>
    </div>
  );
};

export default HumanIcon;
