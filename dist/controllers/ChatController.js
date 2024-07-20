"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getBasicChatResponse_1 = __importDefault(require("../Services/OpenAIService/getBasicChatResponse"));
const getStreamingChatResponse_1 = __importDefault(require("../Services/OpenAIService/getStreamingChatResponse"));
const getBasicChatResponse_2 = __importDefault(require("../Services/OllamaAIService/getBasicChatResponse"));
const getStreamingChatResponse_2 = __importDefault(require("../Services/OllamaAIService/getStreamingChatResponse"));
const getInstalledModelList_1 = __importDefault(require("../Services/OllamaAIService/getInstalledModelList"));
const getModelsList_1 = __importDefault(require("../Services/OpenAIService/getModelsList"));
const healthCheck = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).json({
        status: true,
        message: "Health Check Successful",
    });
});
const basicResponse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const messages = req.body.messages;
    try {
        const response = yield (0, getBasicChatResponse_1.default)(messages);
        return res.status(200).json(response.data);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
});
const streamResponse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const messages = req.body.messages;
    try {
        yield (0, getStreamingChatResponse_1.default)(res, {
            messages
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json(error);
    }
});
const getResponseFromModel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const prompt = req.body.prompt;
    const model = req.body.model;
    const mode = req.params.mode;
    try {
        const modelsList = yield (0, getInstalledModelList_1.default)();
        if (modelsList.length === 0) {
            return res.status(200).json({
                message: "No models available",
                code: "NO_MODEL_AVAILABLE",
            });
        }
        const modelsNameMap = modelsList.map(model => model.name);
        if (!modelsNameMap.includes(model)) {
            return res.status(400).json({
                message: `The model ${model} is not available`,
                code: "BAD_REQUEST",
            });
        }
        if (mode === "basic") {
            const response = yield (0, getBasicChatResponse_2.default)({
                model,
                prompt,
            });
            return res.status(200).json(response);
        }
        else if (mode === "stream") {
            yield (0, getStreamingChatResponse_2.default)({
                model,
                prompt,
            }, res);
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json(error);
    }
});
exports.default = {
    basicResponse,
    streamResponse,
    healthCheck,
    listModels: getModelsList_1.default,
    getResponseFromModel,
    getChatModelsList: getInstalledModelList_1.default,
};
//# sourceMappingURL=ChatController.js.map