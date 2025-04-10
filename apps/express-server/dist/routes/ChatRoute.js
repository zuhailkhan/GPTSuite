"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ChatController_1 = __importDefault(require("../controllers/ChatController"));
const authenticator_1 = __importDefault(require("../middlewares/authenticator"));
const ChatRoute = express_1.default.Router();
ChatRoute.get('/health', authenticator_1.default, ChatController_1.default.healthCheck);
ChatRoute.post('/talkBasic', authenticator_1.default, ChatController_1.default.basicResponse);
ChatRoute.post('/talkStream', authenticator_1.default, ChatController_1.default.streamResponse);
ChatRoute.post('/talk/:mode', authenticator_1.default, ChatController_1.default.getResponseFromModel);
ChatRoute.get('/listModels/openAi', authenticator_1.default, ChatController_1.default.listModels);
ChatRoute.get('/listModels', authenticator_1.default, ChatController_1.default.getChatModelsList);
exports.default = ChatRoute;
//# sourceMappingURL=ChatRoute.js.map