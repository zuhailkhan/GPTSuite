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
// @ts-ignore
const launchdarkly_eventsource_1 = require("launchdarkly-eventsource");
const type_1 = require("./type");
function getStreamingChatResponse(res, { messages, model, }) {
    return __awaiter(this, void 0, void 0, function* () {
        const evs = new launchdarkly_eventsource_1.EventSource(type_1.openAiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${type_1.ApiConfig.apiKey}`,
            },
            body: JSON.stringify({
                messages,
                model: model !== null && model !== void 0 ? model : "gpt-3.5-turbo",
                stream: true,
            }),
        });
        evs.addEventListener("message", (event) => {
            if (event.data === `[DONE]`)
                evs.close();
            res.write(`data: ${event.data}\n\n`);
        });
        evs.addEventListener("error", (event) => {
            evs.close();
            res.end();
        });
        evs.addEventListener("abort", (event) => {
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
    });
}
exports.default = getStreamingChatResponse;
//# sourceMappingURL=getStreamingChatResponse.js.map