import React, { useState } from "react";
import Input from "./Input/Input";
import Bubbles from "./Bubbles/Bubbles";
import { InputMode, MessageType, WHO } from "../../enums";
import styles from "./Chat.module.css";
import useLangChain from "../../hooks/useLangChain";
import { Message } from "../../types";

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const { askAgent, executeSqlQuery } = useLangChain();
  const [isAiAnswerLoading, setIsAIAnswerLoading] = useState(false);

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
    setIsAIAnswerLoading(true);
    const data = await askAgent(content);
    setIsAIAnswerLoading(false);

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
    setIsAIAnswerLoading(true);
    await onExecuteHandler(content);
    setIsAIAnswerLoading(false);
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

  return (
    <div className={styles.Chat}>
      <Bubbles
        messages={messages}
        onSQLModifyClick={onSQLModifyClickHandler}
        onSQLExecuteClick={onExecuteHandler}
        isAiAnswerLoading={isAiAnswerLoading}
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
