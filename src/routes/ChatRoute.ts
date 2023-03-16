import express from "express";
import ChatController  from "../controllers/ChatController";
import authenticator from "../middlewares/authenticator";
const ChatRoute = express.Router();

ChatRoute.get('/health', authenticator, ChatController.healthCheck);

ChatRoute.post('/talkBasic', authenticator, ChatController.basicResponse);

ChatRoute.post('/talkStream', authenticator, ChatController.streamResponse);

ChatRoute.get('/listModels', authenticator, ChatController.listModels);

export default ChatRoute;