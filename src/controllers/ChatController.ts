import { Request, Response } from "express";
import getBasicChatResponse from "../Services/OpenAIService/getBasicChatResponse";
import getStreamingChatResponse from "../Services/OpenAIService/getStreamingChatResponse";
import getBasicChatResponseFromCustomModel from "../Services/OllamaAIService/getBasicChatResponse";
import getStreamingChatResponseFromCustomModel from "../Services/OllamaAIService/getStreamingChatResponse";
import getChatModelsList from "../Services/OllamaAIService/getInstalledModelList";
import listModels from "../Services/OpenAIService/getModelsList";

const healthCheck = async (req: Request, res: Response) => {
  res.status(200).json({
    status: true,
    message: "Health Check Successful",
  });
};

const basicResponse = async (req: Request, res: Response) => {
  const messages = req.body.messages;

  try {
    const response = await getBasicChatResponse(messages);
    return res.status(200).json(response.data);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

const streamResponse = async (req: Request, res: Response) => {
  const messages = req.body.messages;

  try {
    await getStreamingChatResponse(res, {
      messages
    });
  } catch (error: unknown) {
    console.error(error);
    return res.status(500).json(error);
  }
};

const getResponseFromModel = async (req: Request, res: Response) => {
  const prompt = req.body.prompt;
  const model = req.body.model;
  const mode = req.params.mode;

  try {
    const modelsList = await getChatModelsList();
    
    if(modelsList.length === 0){
        return res.status(200).json({
          message:"No models available",
          code:"NO_MODEL_AVAILABLE",
        });
    }
    const modelsNameMap = modelsList.map(model => model.name)
    if (
      !modelsNameMap.includes(model)
    ) {
      return res.status(400).json({
        message: `The model ${model} is not available`,
        code: "BAD_REQUEST",
      });
    }

    if (mode === "basic") {
      const response = await getBasicChatResponseFromCustomModel({
        model,
        prompt,
      });

      return res.status(200).json(response);
    } else if (mode === "stream") {
      await getStreamingChatResponseFromCustomModel(
        {
          model,
          prompt,
        },
        res
      );
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

export default {
  basicResponse,
  streamResponse,
  healthCheck,
  listModels,
  getResponseFromModel,
  getChatModelsList,
};
