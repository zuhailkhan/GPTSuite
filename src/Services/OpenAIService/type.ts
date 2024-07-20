import { Configuration } from "openai";

export enum connectionType {
  BASIC = "basic",
  STREAM = "stream",
}

export const openAiUrl = "https://api.openai.com/v1/chat/completions";

export const ApiConfig = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});