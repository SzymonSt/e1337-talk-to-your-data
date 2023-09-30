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

  const onCancelSQLModifyHandler = () => {
    props.onCancelSQLModify?.();
  };

  const onClickHandler = () => {
    props.onExecute(content);
    props.onCancelSQLModify?.();
  };

  return (
    <div className={styles.SQLInput}>
      <Button
        variant="primary"
        className={styles.ExecuteButton}
        onClick={onClickHandler}
      >
        Execute
      </Button>
      <Button
        variant="dark"
        className={styles.CloseButton}
        onClick={onCancelSQLModifyHandler}
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
