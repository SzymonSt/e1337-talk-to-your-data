import React, { FC, useCallback, useState } from "react";
import CodeMirror, { ViewUpdate } from "@uiw/react-codemirror";
import { sql } from "@codemirror/lang-sql";
import { Button } from "react-bootstrap";
import styles from "./SQLInputExtension.module.css";

interface SQLInputExtensionProps {
  content: string;
  onSQLModifyClick?: (content: string) => void;
}

const SQLInputExtension: FC<SQLInputExtensionProps> = (props) => {
  //   const [content, setContent] = useState(props.content);
  //   const onChange = (val: string, viewUpdate: ViewUpdate) => {
  //     setContent(val);
  //   };

  const onSQLModifyClickHandler = () => {
    props.onSQLModifyClick?.(props.content);
  };

  return (
    <div className={styles.SQLInputExtension}>
      <Button
        variant="dark"
        className={styles.ModifyButton}
        onClick={onSQLModifyClickHandler}
      >
        Modify
      </Button>
      <CodeMirror
        value={props.content}
        theme={"dark"}
        height="200px"
        extensions={[sql({})]}
        editable={false}
        // onChange={onChange}
      />
    </div>
  );
};

export default SQLInputExtension;
