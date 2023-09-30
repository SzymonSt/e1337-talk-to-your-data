import React, { useState } from "react";
import Input from "./Input/Input";
import Bubbles from "./Bubbles/Bubbles";
import { InputMode, MessageType, WHO } from "../../enums";
import styles from "./Chat.module.css";
import useLangChain from "../../hooks/useLangChain";
import { Message } from "../../types";

// const MOCK_MESSAGES: Message[] = [
//   {
//     id: 4,
//     who: WHO.HUMAN,
//     type: MessageType.TEXT,
//     content:
//       "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
//   },
//   {
//     id: 1,
//     who: WHO.AI,
//     type: MessageType.TEXT,
//     content:
//       "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
//   },
//   {
//     id: 2,
//     who: WHO.AI,
//     type: MessageType.SQL,
//     content: `SELECT * \nFROM users \nWHERE age >= 18;`,
//   },
//   {
//     id: 3,
//     who: WHO.AI,
//     type: MessageType.TABLE,
//     content: [
//       {
//         id: 1,
//         "first name": "John",
//         surname: "Smith",
//         some: "This is a very long row",
//         lorem: "ipsum",
//         some1: "This is a very long row",
//         some2: "This is a very long row",
//         some3: "This is a very long row",
//         some4: "This is a very long row",
//         some5: "This is a very long row",
//       },
//       {
//         id: 2,
//         "first name": "Jack",
//         surname: "Sparrow",
//         some: "This is a very long row",
//         lorem: "ipsum",
//         some1: "This is a very long row",
//         some2: "This is a very long row",
//         some3: "This is a very long row",
//         some4: "This is a very long row",
//         some5: "This is a very long row",
//       },
//     ],
//   },
// ];

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const { askAgent, executeSqlQuery } = useLangChain();

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

  const onAskHandler = async (content: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        who: WHO.HUMAN,
        type: MessageType.TEXT,
        content,
      },
    ]);

    const data = await askAgent(content);

    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        who: WHO.AI,
        type: MessageType.TEXT,
        content: data.response,
      },
      {
        id: crypto.randomUUID(),
        who: WHO.AI,
        type: MessageType.SQL,
        content: data["sql_query"],
      },
    ]);

    // response: "Alice Williams zarabia najwięcej - 80000.0.";
    // sql_query: "SELECT Name, Salary FROM Employees ORDER BY Salary DESC LIMIT 10;";
  };

  const onExecuteInputHandler = async (content: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        who: WHO.HUMAN,
        type: MessageType.SQL,
        content,
      },
    ]);

    await onExecuteHandler(content);
  };

  const onExecuteHandler = async (content: string) => {
    const data = await executeSqlQuery(content);

    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        who: WHO.AI,
        type: MessageType.TABLE,
        content: data.result,
      },
    ]);
  };

  // TODO : ADD EXECUTE BUTTON TO SQL EDIT IN MESSAGE

  return (
    <div className={styles.Chat}>
      <Bubbles
        messages={messages}
        onSQLModifyClick={onSQLModifyClickHandler}
        onSQLExecuteClick={onExecuteHandler}
      />

      <Input
        onAsk={onAskHandler}
        onExecute={onExecuteInputHandler}
        mode={inputMode}
        defaultInput={defaultInput}
        onCancelSQLModify={onCancelSQLModifyHandler}
      />
    </div>
  );
};

export default Chat;
