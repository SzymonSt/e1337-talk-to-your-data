import { useEffect, useState } from "react";
import LangChainService from "../services/LangChainService";

interface Data {
  chatHistory: string[];
  [key: string]: any;
}

const createHistoryItem = (content: string, type: "human" | "ai") => {
  return {
    content,
    additional_kwargs: {},
    type,
    example: false,
  };
};

const useLangChain = () => {
  const [chatHistory, setChatHistory] = useState<any[]>([]);

  useEffect(() => {
    // TODO : read from local storage
  }, []);

  const askAgent = async (question: string): Promise<Data> => {
    console.log("chatHistory0", chatHistory);
    const data = await LangChainService.askAgent(chatHistory, question);
    console.log("chatHistory1", data.chat_history, chatHistory);
    setChatHistory([...(data.chat_history || [])]);
    //   createHistoryItem(question, "human"),
    //   createHistoryItem(data.response, "ai"),

    // setChatHistory((prev) => [
    //   ...prev,
    //   ,
    // ]);

    // TODO : save to local storage
    return data;
  };

  const executeSqlQuery = async (sqlQuery: string): Promise<Data> => {
    const data = await LangChainService.executeSqlQuery(chatHistory, sqlQuery);
    setChatHistory(data.chat_history);

    return data;
  };

  return { askAgent, executeSqlQuery };
};

export default useLangChain;
