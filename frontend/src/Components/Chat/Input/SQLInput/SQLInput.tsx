import CodeMirror, { ViewUpdate } from "@uiw/react-codemirror";
import React, { FC, useState } from "react";
import styles from "./SQLInput.module.css";
import { Button } from "react-bootstrap";
import { sql } from "@codemirror/lang-sql";

interface SQLInputProps {
  defaultInput: string;
  onCancelSQLModify?: () => void;
  onExecute: (contents: string) => void;
}

const SQLInput: FC<SQLInputProps> = (props) => {
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
        Execute
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
