import React, { FC, useRef, useState } from "react";
import { Button } from "react-bootstrap";
import styles from "./TextInput.module.css";

interface TextInputProps {
  onAsk: (contents: string) => void;
}

const TextInput: FC<TextInputProps> = (props) => {
  //   const [input, setInput] = useState("");
  const inputRef = useRef<HTMLDivElement>(null);

  const onClickHandler = () => {
    const input = inputRef.current?.innerText || "";
    props.onAsk(input);
    if (inputRef.current) inputRef.current.innerText = "";
  };

  return (
    <>
      <div
        className={styles.TextareaElement}
        ref={inputRef}
        contentEditable
      ></div>

      <div className={styles.ButtonGroup}>
        <Button
          variant="primary"
          className={styles.Button}
          onClick={onClickHandler}
        >
          Ask
        </Button>
      </div>
    </>
  );
};

export default TextInput;
