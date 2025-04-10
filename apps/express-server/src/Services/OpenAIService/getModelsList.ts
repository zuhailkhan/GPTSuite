import { Request, Response } from "express";
import { OpenAIApi } from "openai";
import { ApiConfig } from "./type";

const listModels = async (req: Request, res: Response) => {
  try {
    const openai = new OpenAIApi(ApiConfig);
    const response = await openai.listModels();
    return res.status(200).json(response.data);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

export default listModels;