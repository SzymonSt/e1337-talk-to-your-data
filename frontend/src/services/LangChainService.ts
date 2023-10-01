import AxiosClient from "./AxiosClient";

interface AskAgentPayload {
  chat_history: Object[];
  question: string;
}

interface ExecuteSqlQueryPayload {
  query: string;
  chat_history: Object[];
}

class LangChainService {
  async askAgent(chatHistory: Object[], question: string) {
    const payload: AskAgentPayload = {
      chat_history: chatHistory,
      question: question,
    };
    const response = await AxiosClient.getInstance().post(
      "/ask_agent",
      payload
    );
    return response.data;
  }

  async executeSqlQuery(chatHistory: Object[], sqlQuery: string) {
    const payload: ExecuteSqlQueryPayload = {
      query: sqlQuery,
      chat_history: chatHistory,
    };
    const response = await AxiosClient.getInstance().post(
      "/execute_sql_query",
      payload
    );
    return response.data;
  }
}

const langChainService = new LangChainService();

export default langChainService;
