import { useState } from 'react';
import LangChainService from '../services/LangChainService';

const useLangChain = () => {
  const [chatHistory, setChatHistory] = useState([]);

  const askAgent = async (question) => {
    const data = await LangChainService.askAgent(chatHistory, question);
    setChatHistory(data.chatHistory);
    return data;
  };

  const executeSqlQuery = async (sqlQuery) => {
    const data = await LangChainService.executeSqlQuery(sqlQuery);
    return data;
  };

  return { chatHistory, askAgent, executeSqlQuery };
};

export default useLangChain;