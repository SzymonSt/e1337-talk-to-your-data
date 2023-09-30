import axios, { AxiosInstance } from 'axios';
import { BASE_URL } from '../constants';

interface AskAgentPayload {
  chat_history: string[];
  question: string;
}

interface ExecuteSqlQueryPayload {
  query: string;
}

class LangChainService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: BASE_URL, // Replace with your API base URL
    });
  }

  async askAgent(chatHistory: string[], question: string) {
    const payload: AskAgentPayload = {
      chat_history: chatHistory,
      question: question,
    };
    const response = await this.client.post('/ask_agent', payload);
    return response.data;
  }

  async executeSqlQuery(sqlQuery: string) {
    const payload: ExecuteSqlQueryPayload = {
      query: sqlQuery,
    };
    const response = await this.client.post('/execute_sql_query', payload);
    return response.data;
  }
}

const langChainService = new LangChainService();

export default langChainService;