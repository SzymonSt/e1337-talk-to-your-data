import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRobot } from "@fortawesome/free-solid-svg-icons";
import styles from "./Icon.module.css";

const AIIcon = () => {
  return (
    <div className={styles.Icon}>
      <FontAwesomeIcon icon={faRobot} />
      <h6>SQLucjan</h6>
    </div>
  );
};

export default AIIcon;
