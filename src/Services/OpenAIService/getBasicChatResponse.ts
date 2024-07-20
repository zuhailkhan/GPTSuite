import { ChatCompletionRequestMessage, OpenAIApi } from "openai";
import { ApiConfig } from "./type";

async function getBasicChatResponse(
  messages: ChatCompletionRequestMessage[],
  model?: string
) {
  try {
    const openai = new OpenAIApi(ApiConfig);

    const response = await openai.createChatCompletion({
      model: model ?? "gpt-3.5-turbo",
      messages,
    });

    return response;
  } catch (error: unknown) {
    console.error(error);
    throw error;
  }
}


export default getBasicChatResponse;