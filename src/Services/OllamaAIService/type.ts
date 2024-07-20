export const ollamaUrl = "http://localhost:11434/api/generate";
export const ollamaBaseUrl = "http://localhost:11434/";
export interface BasicChatRequestConfig {
  model: string;
  prompt: string;
}

export interface ChatModel {
  name: string;
  model: string;
  modified_at: Date | string;
  size: number;
  digest: string;
  details: Object;
}
