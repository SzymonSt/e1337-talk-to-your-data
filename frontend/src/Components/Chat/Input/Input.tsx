import React, { FC } from "react";
import styles from "./Input.module.css";
import TextInput from "./TextInput/TextInput";
import { InputMode } from "../../../enums";
import SQLInput from "./SQLInput/SQLInput";

interface InputProps {
  mode: InputMode;
  defaultInput?: string;
  onCancelSQLModify?: () => void;
  onAsk: (contents: string) => void;
  onExecute: (contents: string) => void;
}

const Input: FC<InputProps> = ({ defaultInput = "", ...props }) => {
  return (
    <>
      <div className={styles.Input}>
        {props.mode === InputMode.TEXT && <TextInput onAsk={props.onAsk} />}
        {props.mode === InputMode.SQL && (
          <SQLInput
            onExecute={props.onExecute}
            defaultInput={defaultInput}
            onCancelSQLModify={props.onCancelSQLModify}
          />
        )}
      </div>
    </>
  );
};

export default Input;
