import axios from 'axios';
import { ollamaUrl } from './type';

export interface BasicChatRequestConfig {
    model: string;
    prompt: string;
}

async function getBasicChatResponseFromCustomModel(
  config: BasicChatRequestConfig
) {
  const { model, prompt } = config;

  try {
    const response = await axios.post(ollamaUrl, {
      model,
      prompt,
      stream: false,
    });

    return response.data;
  } catch (error: unknown) {
    console.error(error);
    throw new Error("Error in request");
  }
}

export default getBasicChatResponseFromCustomModel;