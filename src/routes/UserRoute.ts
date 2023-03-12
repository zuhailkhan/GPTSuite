import express from "express";
import UserController from "../controllers/UserController";
import authenticator from "../middlewares/authenticator";
const UserRoute = express.Router();

UserRoute.post('/login', UserController.Login)

UserRoute.post('/register', UserController.Register)

UserRoute.get('/revalidate', UserController.reValidate)

export default UserRoute;