import React, { useEffect, useRef, useState } from "react";
import Input from "./Input/Input";
import Bubbles, { Message } from "./Bubbles/Bubbles";
import { InputMode, MessageType, WHO } from "../../enums";
import styles from "./Chat.module.css";

const MOCK_MESSAGES: Message[] = [
  {
    id: 4,
    who: WHO.HUMAN,
    type: MessageType.TEXT,
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
  {
    id: 1,
    who: WHO.AI,
    type: MessageType.TEXT,
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
  {
    id: 2,
    who: WHO.AI,
    type: MessageType.SQL,
    content: `SELECT * \nFROM users \nWHERE age >= 18;`,
  },
  {
    id: 3,
    who: WHO.AI,
    type: MessageType.TABLE,
    content: [
      {
        id: 1,
        "first name": "John",
        surname: "Smith",
        some: "This is a very long row",
        lorem: "ipsum",
        some1: "This is a very long row",
        some2: "This is a very long row",
        some3: "This is a very long row",
        some4: "This is a very long row",
        some5: "This is a very long row",
      },
      {
        id: 2,
        "first name": "Jack",
        surname: "Sparrow",
        some: "This is a very long row",
        lorem: "ipsum",
        some1: "This is a very long row",
        some2: "This is a very long row",
        some3: "This is a very long row",
        some4: "This is a very long row",
        some5: "This is a very long row",
      },
    ],
  },
];

const Chat = () => {
  const [messages, setMessages] = useState(MOCK_MESSAGES);

  const [inputMode, setInputMode] = useState<InputMode>(InputMode.TEXT);

  const [defaultInput, setDefaultInput] = useState<string>("");
  const onSQLModifyClickHandler = (content: string) => {
    setInputMode(InputMode.SQL);
    setDefaultInput(content);
  };

  const onCancelSQLModifyHandler = () => {
    setInputMode(InputMode.TEXT);
    setDefaultInput("");
  };

  const onAskHandler = (content: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: 5,
        who: WHO.HUMAN,
        type: MessageType.TEXT,
        content,
      },
    ]);
  };

  const onExecuteHandler = (content: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: 6,
        who: WHO.HUMAN,
        type: MessageType.SQL,
        content,
      },
    ]);
  };

  return (
    <div className={styles.Chat}>
      <Bubbles messages={messages} onSQLModifyClick={onSQLModifyClickHandler} />

      <Input
        onAsk={onAskHandler}
        onExecute={onExecuteHandler}
        mode={inputMode}
        defaultInput={defaultInput}
        onCancelSQLModify={onCancelSQLModifyHandler}
      />
    </div>
  );
};

export default Chat;
