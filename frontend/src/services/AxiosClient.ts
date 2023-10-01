import axios, { AxiosInstance } from "axios";
import { BASE_URL } from "../constants";

class AxiosClient {
  private static client: AxiosInstance;

  public static getInstance() {
    if (!this.client)
      this.client = axios.create({
        baseURL: BASE_URL, // Replace with your API base URL
      });

    return this.client;
  }
}

export default AxiosClient;
