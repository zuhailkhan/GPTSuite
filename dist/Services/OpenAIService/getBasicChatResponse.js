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
Object.defineProperty(exports, "__esModule", { value: true });
const openai_1 = require("openai");
const type_1 = require("./type");
function getBasicChatResponse(messages, model) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const openai = new openai_1.OpenAIApi(type_1.ApiConfig);
            const response = yield openai.createChatCompletion({
                model: model !== null && model !== void 0 ? model : "gpt-3.5-turbo",
                messages,
            });
            return response;
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    });
}
exports.default = getBasicChatResponse;
//# sourceMappingURL=getBasicChatResponse.js.map