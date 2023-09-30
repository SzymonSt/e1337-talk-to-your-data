import { useEffect, useState } from "react";
import LangChainService from "../services/LangChainService";

interface Data {
  chatHistory: string[];
  [key: string]: any;
}

const useLangChain = () => {
  const [chatHistory, setChatHistory] = useState<string[]>([]);

  useEffect(() => {
    // TODO : read from local storage
  }, []);

  const askAgent = async (question: string): Promise<Data> => {
    const data = await LangChainService.askAgent(chatHistory, question);
    setChatHistory(data.chatHistory);
    // TODO : save to local storage
    return data;
  };

  const executeSqlQuery = async (sqlQuery: string): Promise<Data> => {
    const data = await LangChainService.executeSqlQuery(sqlQuery);
    return data;
  };

  return { askAgent, executeSqlQuery };
};

export default useLangChain;
