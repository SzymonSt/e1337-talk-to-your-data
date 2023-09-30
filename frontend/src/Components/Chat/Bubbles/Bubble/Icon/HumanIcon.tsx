import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import styles from "./Icon.module.css";

const HumanIcon = () => {
  return (
    <div className={styles.Icon}>
      <FontAwesomeIcon icon={faUser} />
      <h6>Ty</h6>
    </div>
  );
};

export default HumanIcon;
