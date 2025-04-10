import express from "express";
import ChatController  from "../controllers/ChatController";
import authenticator from "../middlewares/authenticator";
const ChatRoute = express.Router();

ChatRoute.get('/health', authenticator, ChatController.healthCheck);

ChatRoute.post('/talkBasic', authenticator, ChatController.basicResponse);

ChatRoute.post('/talkStream', authenticator, ChatController.streamResponse);

ChatRoute.post('/talk/:mode', authenticator, ChatController.getResponseFromModel)

ChatRoute.get('/listModels/openAi', authenticator, ChatController.listModels);

ChatRoute.get('/listModels', authenticator, ChatController.getChatModelsList);


export default ChatRoute;