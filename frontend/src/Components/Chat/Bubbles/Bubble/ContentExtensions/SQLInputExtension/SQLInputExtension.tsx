import React, { FC, useCallback, useContext, useState } from "react";
import CodeMirror, { ViewUpdate } from "@uiw/react-codemirror";
import { sql } from "@codemirror/lang-sql";
import { Button } from "react-bootstrap";
import styles from "./SQLInputExtension.module.css";
import { languageContext } from "../../../../../../context/LanguageContext";

interface SQLInputExtensionProps {
  content: string;
  onSQLModifyClick?: (content: string) => void;
  onSQLExecuteClick?: (contents: string) => void;
}

const removeSpeechmarks = (str: string) => {
  return str.substring(1, str.length - 2) + ";";
};

const SQLInputExtension: FC<SQLInputExtensionProps> = (props) => {
  const content =
    props.content.length > 3 && props.content[0] === '"'
      ? removeSpeechmarks(props.content)
      : props.content;

  const langCtx = useContext(languageContext);

  const onSQLModifyClickHandler = () => {
    props.onSQLModifyClick?.(content);
  };

  const onExecuteClickHandler = () => {
    props.onSQLExecuteClick?.(content);
  };

  return (
    <div className={styles.SQLInputExtension}>
      <Button
        variant="dark"
        className={styles.ModifyButton}
        onClick={onSQLModifyClickHandler}
      >
        {langCtx.language === "ENG" ? "Modify" : "Zmodyfikuj"}
      </Button>
      <Button
        variant="primary"
        className={styles.ExecuteButton}
        onClick={onExecuteClickHandler}
      >
        {langCtx.language === "ENG" ? "Execute" : "Wykonaj"}
      </Button>
      <CodeMirror
        value={content}
        theme={"dark"}
        height="200px"
        extensions={[sql({ upperCaseKeywords: true })]}
        editable={false}
        // onChange={onChange}
      />
    </div>
  );
};

export default SQLInputExtension;
