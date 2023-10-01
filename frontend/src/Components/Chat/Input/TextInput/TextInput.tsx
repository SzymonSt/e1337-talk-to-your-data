import React, { FC, useContext, useRef } from "react";
import { Button } from "react-bootstrap";
import styles from "./TextInput.module.css";
import { languageContext } from "../../../../context/LanguageContext";

interface TextInputProps {
  onAsk: (contents: string) => void;
}

const TextInput: FC<TextInputProps> = (props) => {
  const langCtx = useContext(languageContext);

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
          className={`${styles.Button} ${styles.PrimaryButton}`}
          onClick={onClickHandler}
        >
          {langCtx.language === "ENG" ? "Ask" : "Zapytaj"}
        </Button>
      </div>
    </>
  );
};

export default TextInput;
