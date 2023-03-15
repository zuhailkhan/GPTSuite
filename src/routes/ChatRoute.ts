import express from "express";
import ChatController  from "../controllers/ChatController";
import authenticator from "../middlewares/authenticator";
const ChatRoute = express.Router();

ChatRoute.get('/health', authenticator, ChatController.healthCheck)

ChatRoute.post('/talkBasic', ChatController.basicResponse);

// ChatRoute.post('/talkStream', ChatController.streamResponse);

export default ChatRoute;