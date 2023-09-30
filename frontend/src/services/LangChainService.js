import axios from 'axios';
import { BASE_URL } from '../constants';

class LangChainService {
  constructor() {
    this.client = axios.create({
      baseURL: BASE_URL, // Replace with your API base URL
    });
  }

  async askAgent(chatHistory, question) {
    const response = await this.client.post('/ask_agent', {
      chat_history: chatHistory,
      question: question,
    });
    return response.data;
  }

  async executeSqlQuery(sqlQuery) {
    const response = await this.client.post('/execute_sql_query', {
      query: sqlQuery,
    });
    return response.data;
  }
}

const langChainService = new LangChainService();

export default langChainService;