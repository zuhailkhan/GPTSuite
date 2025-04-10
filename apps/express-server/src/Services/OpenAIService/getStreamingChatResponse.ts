// @ts-ignore
import { EventSource } from "launchdarkly-eventsource";
import { ApiConfig, openAiUrl } from "./type";
import { Response } from "express";

async function getStreamingChatResponse(
  res: Response,
  {
    messages,
    model,
  }: {
    messages?: string[];
    model?: string;
  }
): Promise<Response> {
  const evs = new EventSource(openAiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${ApiConfig.apiKey}`,
    },
    body: JSON.stringify({
      messages,
      model: model ?? "gpt-3.5-turbo",
      stream: true,
    }),
  });

  evs.addEventListener("message", (event: any) => {
    if (event.data === `[DONE]`) evs.close();
    res.write(`data: ${event.data}\n\n`);
  });

  evs.addEventListener("error", (event: any) => {
    evs.close();
    res.end();
  });

  evs.addEventListener("abort", (event: any) => {
    evs.close();
    res.end();
  });

  evs.addEventListener("close", () => {
    res.end();
  });

  //   req.on("close", () => {
  //     evs.close();
  //   });

  res.on("error", () => {
    evs.close();
  });

  return res;
}

export default getStreamingChatResponse;