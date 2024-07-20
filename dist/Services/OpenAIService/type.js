"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiConfig = exports.openAiUrl = exports.connectionType = void 0;
const openai_1 = require("openai");
var connectionType;
(function (connectionType) {
    connectionType["BASIC"] = "basic";
    connectionType["STREAM"] = "stream";
})(connectionType = exports.connectionType || (exports.connectionType = {}));
exports.openAiUrl = "https://api.openai.com/v1/chat/completions";
exports.ApiConfig = new openai_1.Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
//# sourceMappingURL=type.js.map