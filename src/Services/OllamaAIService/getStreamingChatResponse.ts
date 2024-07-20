import { Response } from "express";
import { BasicChatRequestConfig, ollamaUrl } from "./type";
import generateStream from "../StreamingService/generateStream";

async function getStreamingChatResponseFromOllama(
  config: BasicChatRequestConfig,
  res: Response
) {
  const { prompt, model } = config;

  try {
    const stream = await generateStream(ollamaUrl, model, prompt);

    for await (const chunk of stream) {
      res.write(chunk);
    }
  } catch (error: unknown) {
    console.error(error);
    res.status(500).send({ error });
  } finally {
    res.end();
  }
}

export default getStreamingChatResponseFromOllama;
