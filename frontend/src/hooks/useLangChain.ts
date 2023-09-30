import { useState } from 'react';
import LangChainService from '../services/LangChainService';

interface Data {
  chatHistory: string[];
  [key: string]: any;
}

const useLangChain = () => {
  const [chatHistory, setChatHistory] = useState<string[]>([]);

  const askAgent = async (question: string): Promise<Data> => {
    const data = await LangChainService.askAgent(chatHistory, question);
    setChatHistory(data.chatHistory);
    return data;
  };

  const executeSqlQuery = async (sqlQuery: string): Promise<Data> => {
    const data = await LangChainService.executeSqlQuery(sqlQuery);
    return data;
  };

  return { chatHistory, askAgent, executeSqlQuery };
};

export default useLangChain;