import axios from "axios";
import { ChatModel, ollamaBaseUrl } from "./type";

async function getChatModelsList(): Promise<ChatModel[]> {
  try {
    const result = await axios.get(`${ollamaBaseUrl}api/tags`);

    return result.data.models ?? [];
  } catch (error: unknown) {
    console.error(error);
    throw error;
  }
}

export default getChatModelsList;