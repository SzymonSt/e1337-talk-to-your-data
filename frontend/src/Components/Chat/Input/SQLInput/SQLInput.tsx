import CodeMirror, { ViewUpdate } from "@uiw/react-codemirror";
import React, { FC, useContext, useState } from "react";
import styles from "./SQLInput.module.css";
import { Button } from "react-bootstrap";
import { sql } from "@codemirror/lang-sql";
import { languageContext } from "../../../../context/LanguageContext";

interface SQLInputProps {
  defaultInput: string;
  onCancelSQLModify?: () => void;
  onExecute: (contents: string) => void;
}

const SQLInput: FC<SQLInputProps> = (props) => {
  const langCtx = useContext(languageContext);

  const [content, setContent] = useState(props.defaultInput);
  const onChange = (val: string, viewUpdate: ViewUpdate) => {
    setContent(val);
  };

  const onCancelHandler = () => {
    props.onCancelSQLModify?.();
  };

  const onExecuteClickHandler = () => {
    props.onExecute(content);
    props.onCancelSQLModify?.();
  };

  return (
    <div className={styles.SQLInput}>
      <Button
        variant="primary"
        className={styles.ExecuteButton}
        onClick={onExecuteClickHandler}
      >
        {langCtx.language === "ENG" ? "Execute" : "Wykonaj"}
      </Button>
      <Button
        variant="dark"
        className={styles.CloseButton}
        onClick={onCancelHandler}
      >
        X
      </Button>
      <CodeMirror
        value={content}
        theme={"dark"}
        height="150px"
        extensions={[sql({})]}
        onChange={onChange}
      />
    </div>
  );
};

export default SQLInput;
